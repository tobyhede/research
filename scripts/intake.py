#!/usr/bin/env python3
"""Book intake: maintain queue.md and file books dropped in inbox/ into books/<slug>/source/.

Usage (run from anywhere; use `python3 -I` because inbox files are untrusted):
  python3 -I scripts/intake.py add "Title" "Author"      add a wanted book to the queue
  python3 -I scripts/intake.py scan [--dry-run]           match inbox files to queue rows and file them
  python3 -I scripts/intake.py status <slug> <status>     set a row's status
  python3 -I scripts/intake.py list                       print the queue

Statuses: wanted -> placed -> distilled -> deep-read -> done
"""
from __future__ import annotations

import re
import shutil
import sys
import unicodedata
import xml.etree.ElementTree as ET
import zipfile
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
QUEUE = ROOT / "queue.md"
INBOX = ROOT / "inbox"
BOOKS = ROOT / "books"
STATUSES = ["wanted", "placed", "distilled", "deep-read", "done"]
HEADER = "| Slug | Title | Author | Status | File |\n| --- | --- | --- | --- | --- |\n"
PREAMBLE = (
    "# Queue\n\n"
    "Books to read. Managed by `scripts/intake.py`; see CLAUDE.md for the workflow.\n\n"
)
STOPWORDS = {"the", "a", "an", "of", "and", "in", "on", "to", "for", "with", "by"}


@dataclass
class Row:
    slug: str
    title: str
    author: str
    status: str
    file: str = ""

    def line(self) -> str:
        cells = [self.slug, self.title, self.author, self.status, self.file]
        return "| " + " | ".join(c.replace("|", "\\|") for c in cells) + " |\n"


# ---------- queue io ----------

def load() -> list[Row]:
    if not QUEUE.exists():
        return []
    rows = []
    for raw in QUEUE.read_text().splitlines():
        if not raw.startswith("| ") or raw.startswith("| Slug") or raw.startswith("| ---"):
            continue
        cells = [c.strip().replace("\\|", "|") for c in re.split(r"(?<!\\)\|", raw.strip())[1:-1]]
        cells += [""] * (5 - len(cells))
        rows.append(Row(*cells[:5]))
    return rows


def save(rows: list[Row]) -> None:
    QUEUE.write_text(PREAMBLE + HEADER + "".join(r.line() for r in rows))


# ---------- text helpers ----------

def fold(s: str) -> str:
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()


def tokens(s: str) -> set[str]:
    return {t for t in fold(s).split() if t not in STOPWORDS}


def surname(author: str) -> str:
    first = re.split(r"[;&]| and ", author)[0].strip()
    if "," in first:  # "Hayek, F. A."
        first = first.split(",")[0]
    parts = fold(first).split()
    return parts[-1] if parts else ""


def make_slug(title: str, author: str, rows: list[Row]) -> str:
    short = re.split(r"[:—–]| - ", title)[0]
    words = fold(short).split()
    if words and words[0] in {"the", "a", "an"}:
        words = words[1:]
    slug = "-".join(words)
    taken = {p.name: None for p in BOOKS.iterdir() if p.is_dir()} | {r.slug: r for r in rows}
    if slug in taken:
        existing = taken[slug]
        if existing is None:
            raise SystemExit(f"books/{slug}/ exists but is not in queue.md; add its row first")
        if surname(existing.author) == surname(author):
            raise SystemExit(f"already queued: {slug}")
        slug = f"{slug}-{surname(author)}"
        if slug in taken:
            raise SystemExit(f"slug collision even with surname: {slug}")
    return slug


# ---------- file inspection ----------

@dataclass
class Candidate:
    path: Path
    kind: str  # epub | pdf | other
    title: str
    author: str
    lang: str
    valid: bool
    problem: str = ""


def inspect(path: Path) -> Candidate:
    ext = path.suffix.lower()
    stem_title, stem_author = path.stem, ""
    m = re.match(r"(.+?)\s*\(([^()]+)\)\s*(?:\(z-lib\.org\))?$", path.stem)
    if m:
        stem_title, stem_author = m.group(1), m.group(2)
    if ext == ".pdf":
        ok = path.read_bytes()[:5] == b"%PDF-"
        return Candidate(path, "pdf", stem_title, stem_author, "", ok, "" if ok else "not a PDF")
    if ext != ".epub":
        return Candidate(path, "other", stem_title, stem_author, "", False, f"unsupported type {ext}")
    try:
        with zipfile.ZipFile(path) as z:
            if z.read("mimetype").strip() != b"application/epub+zip":
                raise ValueError("bad mimetype")
            container = ET.fromstring(z.read("META-INF/container.xml"))
            opf_path = container.find(".//{*}rootfile").get("full-path")
            opf = ET.fromstring(z.read(opf_path))
    except Exception as e:  # noqa: BLE001 - any failure means the file is unusable
        return Candidate(path, "epub", stem_title, stem_author, "", False, f"invalid epub: {e}")
    md = opf.find("{*}metadata")
    get = lambda tag: (md.findtext(f"{{*}}{tag}") or "").strip() if md is not None else ""
    authors = [e.text.strip() for e in md.iter() if e.tag.endswith("}creator") and e.text] if md is not None else []
    return Candidate(path, "epub", get("title") or stem_title, "; ".join(authors) or stem_author, get("language"), True)


def score(c: Candidate, r: Row) -> float:
    want = tokens(re.split(r"[:—–]", r.title)[0])
    if not want:
        return 0.0
    best = max(len(want & tokens(t)) / len(want) for t in (c.title, c.path.stem))
    sn = surname(r.author)
    author_hit = bool(sn) and sn in fold(c.author + " " + c.path.stem).split()
    if c.author and not author_hit:
        return 0.0  # file names a different author: never match
    return best + (0.5 if author_hit else 0.0)


def rank(c: Candidate) -> tuple:
    """Higher is better: valid, epub, english, bigger."""
    english = c.lang.lower().startswith("en") if c.lang else None
    return (c.valid, c.kind == "epub", english is True, english is not False, c.path.stat().st_size)


# ---------- commands ----------

def cmd_add(title: str, author: str) -> None:
    rows = load()
    slug = make_slug(title, author, rows)
    rows.append(Row(slug, title, author, "wanted"))
    save(rows)
    print(f"queued {slug}")


def cmd_status(slug: str, status: str) -> None:
    if status not in STATUSES:
        raise SystemExit(f"status must be one of {STATUSES}")
    rows = load()
    for r in rows:
        if r.slug == slug:
            r.status = status
            save(rows)
            print(f"{slug}: {status}")
            return
    raise SystemExit(f"no such slug: {slug}")


def cmd_list() -> None:
    for r in load():
        print(f"{r.status:10} {r.slug:45} {r.title} — {r.author}")


def cmd_scan(dry: bool) -> None:
    rows = load()
    wanted = [r for r in rows if r.status == "wanted"]
    files = sorted(p for p in INBOX.iterdir() if p.is_file() and not p.name.startswith("."))
    if not files:
        print("inbox empty")
        return
    cands = [inspect(p) for p in files]
    matches: dict[str, list[Candidate]] = {}
    for c in cands:
        if not c.valid:
            print(f"SKIP   {c.path.name}: {c.problem}")
            continue
        scored = sorted(((score(c, r), r) for r in wanted), key=lambda x: -x[0])
        if not scored or scored[0][0] < 0.8:
            print(f"NOMATCH {c.path.name} (title={c.title!r}, author={c.author!r})")
            continue
        if len(scored) > 1 and scored[1][0] == scored[0][0]:
            print(f"AMBIGUOUS {c.path.name}: {scored[0][1].slug} vs {scored[1][1].slug}")
            continue
        matches.setdefault(scored[0][1].slug, []).append(c)

    for r in wanted:
        group = matches.get(r.slug)
        if not group:
            continue
        group.sort(key=rank, reverse=True)
        best, rest = group[0], group[1:]
        if best.lang and not best.lang.lower().startswith("en"):
            print(f"NONENG {r.slug}: best candidate {best.path.name} is lang={best.lang}; left in inbox")
            continue
        dest_dir = BOOKS / r.slug / "source"
        dest = dest_dir / best.path.name
        note = f" [{best.kind}, lang={best.lang or '?'}]"
        print(f"PLACE  {best.path.name} -> {dest.relative_to(ROOT)}{note}")
        for o in rest:
            print(f"       (kept in inbox, lower ranked: {o.path.name})")
        if dry:
            continue
        dest_dir.mkdir(parents=True, exist_ok=True)
        shutil.move(str(best.path), dest)
        r.status, r.file = "placed", best.path.name
    if not dry:
        save(rows)


def main(argv: list[str]) -> None:
    if not argv or argv[0] in {"-h", "--help"}:
        print(__doc__)
        return
    cmd, args = argv[0], argv[1:]
    if cmd == "add" and len(args) == 2:
        cmd_add(*args)
    elif cmd == "scan":
        cmd_scan("--dry-run" in args)
    elif cmd == "status" and len(args) == 2:
        cmd_status(*args)
    elif cmd == "list":
        cmd_list()
    else:
        raise SystemExit(__doc__)


if __name__ == "__main__":
    main(sys.argv[1:])
