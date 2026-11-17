#!/usr/bin/env node
// Build an InfinityCube Aggregate directory (cube/) from the books' briefs and deep reads.
//
// Levels of abstraction, one Space per level:
//   Library (Meta)                       every book, how to read the cube
//   └─ Book                              question, thesis, tour; reading plan
//      ├─ Argument                       core ideas, synthesis, concept map, concepts → chapters
//      ├─ Chapters                       reading order, (parts), dependencies, value chart
//      │  └─ (Part)                      chapters of one part, when the book has parts
//      │     └─ Chapter                  one deep-read note split into its analytical sections
//      ├─ Lexicon                        contested terms, cross-references, terms → chapters
//      └─ Critique                       is it true?, what of it?, action layer
//
// Ids are derived from stable keys, so rebuilding writes the same bytes and git diffs stay small.
// The script owns cube/ entirely: it deletes and rewrites it. Edits made in a cube run are lost on rebuild.

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, rmSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'cube');
const REPO_URL = 'https://github.com/tobyhede/research/blob/main/';

const BOOKS = [
  {
    slug: 'road-to-serfdom',
    short: 'Serfdom',
    title: 'The Road to Serfdom',
    author: 'F. A. Hayek',
    year: 1944,
    valueOverrides: {
      "Caldwell's Introduction (editor)": 'fm01',
      'Preface to the original editions': 'fm02',
      '1956 foreword': 'fm02',
      '1976 preface': 'fm02',
      "Hayek's Introduction": 'fm03',
      'Bibliographical Note': 'ch16',
      'Appendix: 1933 memo': 'ap01',
      'Appendix: Knight and Marschak reports': 'ap01',
      'Appendix: Chamberlain, Scoon, Friedman': 'ap01',
    },
  },
  {
    slug: 'capital-in-the-twenty-first-century',
    short: 'Capital',
    title: 'Capital in the Twenty-First Century',
    author: 'Thomas Piketty',
    year: 2013,
    valueOverrides: { Introduction: 'fm01', Conclusion: 'ch17' },
  },
];

// ---------- ids, assets, files ----------

function uid(key) {
  const h = createHash('sha256').update(`research-cube:${key}`).digest('hex');
  const v = ((parseInt(h[16], 16) & 0x3) | 0x8).toString(16);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-${v}${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

let assets = new Map();
function asset(text) {
  const body = text.replace(/\r\n?/g, '\n').trim() + '\n';
  const bytes = Buffer.from(body, 'utf8');
  const hash = createHash('sha256').update(bytes).digest('base64url');
  assets.set(hash, bytes);
  return `/assets/${hash}`;
}

const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

// ---------- Markdown helpers ----------

function sections(md, level) {
  const marker = '#'.repeat(level) + ' ';
  const out = [];
  let cur = { heading: null, lines: [] };
  let fence = false;
  for (const line of md.split('\n')) {
    if (line.startsWith('```')) fence = !fence;
    if (!fence && line.startsWith(marker)) {
      out.push(cur);
      cur = { heading: line.slice(marker.length).trim(), lines: [] };
    } else if (!fence && level > 1 && /^#{1,6} /.test(line) && line.match(/^#+/)[0].length < level) {
      out.push(cur);
      cur = { heading: null, lines: [] };
    } else cur.lines.push(line);
  }
  out.push(cur);
  return out.map((s) => ({ heading: s.heading, body: s.lines.join('\n').trim() }));
}

const find = (secs, pred) => secs.find((s) => s.heading && pred(s.heading));
const named = (secs, name) => find(secs, (h) => h.toLowerCase().startsWith(name.toLowerCase()));

function stripDiagrams(md) {
  return md
    .replace(/<!-- diagram:start -->[\s\S]*?<!-- diagram:end -->/g, '')
    .replace(/```mermaid[\s\S]*?```/g, '')
    .trim();
}

function rewriteLinks(md, fromFile) {
  const dir = posix.dirname(fromFile);
  return md.replace(/\]\(([^)\s]+)\)/g, (m, href) => {
    if (/^(https?:|mailto:|#)/.test(href)) return m;
    return `](${REPO_URL}${posix.normalize(posix.join(dir, href))})`;
  });
}

const md = (text, fromFile) => rewriteLinks(stripDiagrams(text), fromFile);

function tableRows(body) {
  return body
    .split('\n')
    .filter((l) => l.startsWith('|') && !/^\|\s*-/.test(l))
    .slice(1)
    .map((l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim()));
}

export function mermaid(text) {
  const block = text.match(/```mermaid\n([\s\S]*?)```/)?.[1] ?? '';
  const nodes = new Map();
  const edges = [];
  const node = (tok) => {
    const m = tok.trim().match(/^([A-Za-z0-9_]+)(?:\[(.*)\])?$/);
    if (!m) return null;
    if (m[2] && !nodes.has(m[1])) nodes.set(m[1], m[2].replace(/<br\/?>/g, '\n'));
    if (!nodes.has(m[1])) nodes.set(m[1], m[1]);
    return m[1];
  };
  for (const line of block.split('\n').map((l) => l.trim())) {
    if (!line || /^(graph|flowchart|%%|classDef|class |style |linkStyle)/.test(line)) continue;
    const m = line.match(/^(.*?)\s*(-\.->|-->)\s*(.*)$/);
    const a = m ? node(m[1]) : node(line);
    const b = m ? node(m[3]) : a;
    if (!a || !b) throw new Error(`cannot read mermaid line: ${line}`);
    if (m) edges.push({ from: a, to: b, weak: m[2] === '-.->' });
  }
  const after = text.split(/```mermaid[\s\S]*?```/)[1] ?? '';
  const caption = after.split(/\n#{1,6} /)[0].trim();
  return { nodes, edges, caption };
}

function chapterRefs(text, known) {
  const refs = [];
  for (const m of text.matchAll(/\b(ch|fm|ap)(\d\d)(?:\s*[-–]\s*(?:ch)?(\d\d))?/g)) {
    const lo = Number(m[2]);
    const hi = m[3] ? Number(m[3]) : lo;
    for (let n = lo; n <= hi; n++) {
      const id = `${m[1]}${String(n).padStart(2, '0')}`;
      if (known.has(id) && !refs.includes(id)) refs.push(id);
    }
  }
  return refs;
}

function splitTopLevel(text, sep = ';') {
  const parts = [];
  let depth = 0;
  let cur = '';
  for (const ch of text) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === sep && depth === 0) {
      parts.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

const oneLine = (s, max = 90) => {
  const t = s.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max - 1).trimEnd() + '…' : t;
};

// ---------- Space builder ----------

let spaces = [];
let resourceIds = new Set();

export class Space {
  constructor(key, title) {
    this.id = uid(`space:${key}`);
    this.key = key;
    this.title = title;
    this.resources = [];
    this.maps = [];
    spaces.push(this);
  }
  add(key, title, kind, content) {
    const r = { id: uid(`res:${this.key}:${key}`), title, kind, content };
    if (resourceIds.has(r.id)) throw new Error(`duplicate Resource key "${key}" in Space "${this.title}"`);
    resourceIds.add(r.id);
    this.resources.push(r);
    return r;
  }
  markdown(key, title, text) {
    return this.add(key, title, 'markdown', { url: asset(text) });
  }
  ur(key, title) {
    return this.add(key, title, 'ur', {});
  }
  portal(key, title, target) {
    const map = target.maps[0];
    return this.add(key, title, 'space', { spaceId: target.id, map: map.id, graph: map.graphs[0].id });
  }
  map(key, title) {
    const m = new MapBuilder(this, key, title);
    this.maps.push(m);
    return m;
  }
  json() {
    return {
      version: 1,
      id: this.id,
      title: this.title,
      maps: this.maps.map((m) => m.json()),
      defaultMap: this.maps[0]?.id,
    };
  }
}

class MapBuilder {
  constructor(space, key, title) {
    this.space = space;
    this.id = uid(`map:${space.key}:${key}`);
    this.key = key;
    this.title = title;
    this.positions = {};
    this.graphs = [];
  }
  place(r, x, y, opts = {}) {
    const p = { x: Math.round(x), y: Math.round(y) };
    if (opts.w) p.size = { width: opts.w, height: opts.h };
    if (opts.open) p.content = { open: true };
    if (opts.shape) p.content = { shape: opts.shape };
    this.positions[r.id] = p;
    return r;
  }
  graph(key, title, style = {}) {
    const g = { id: uid(`graph:${this.space.key}:${this.key}:${key}`), title, ...style, edges: [], seen: new Set() };
    this.graphs.push(g);
    return {
      id: g.id,
      edge: (from, to, title) => {
        if (!from || !to || from.id === to.id) return;
        const k = `${from.id}>${to.id}`;
        if (g.seen.has(k)) return;
        if (!this.positions[from.id] || !this.positions[to.id]) throw new Error(`edge off map ${this.title}: ${from.title} -> ${to.title}`);
        g.seen.add(k);
        const e = { from: from.id, to: to.id };
        if (title) e.title = oneLine(title, 60);
        g.edges.push(e);
      },
      chain: function (list, title) {
        for (let i = 1; i < list.length; i++) this.edge(list[i - 1], list[i], title);
      },
    };
  }
  json() {
    return {
      id: this.id,
      title: this.title,
      kind: 'positioned',
      positions: this.positions,
      graphs: this.graphs.map(({ seen, ...g }) => g),
      activeGraph: this.graphs[0].id,
    };
  }
}

// Layout constants: Closed Size is 260×146.
const CW = 260, CH = 146, GX = 340, GY = 220;
const OPEN = { w: 560, h: 420, open: true };
const WIDE = { w: 720, h: 480, open: true };

function grid(map, items, { x0 = 0, y0 = 0, cols = 4, gx = GX, gy = GY, snake = false } = {}) {
  items.forEach((r, i) => {
    const row = Math.floor(i / cols);
    let col = i % cols;
    if (snake && row % 2) col = cols - 1 - col;
    map.place(r, x0 + col * gx, y0 + row * gy);
  });
}

function layered(map, nodeIds, edges, resOf, { x0 = 0, y0 = 0, gx = 320, gy = 240 } = {}) {
  const layer = new Map(nodeIds.map((n) => [n, 0]));
  for (let pass = 0; pass < nodeIds.length; pass++)
    for (const e of edges) layer.set(e.to, Math.max(layer.get(e.to), layer.get(e.from) + 1));
  const rows = [];
  for (const n of nodeIds) (rows[layer.get(n)] ??= []).push(n);
  rows.forEach((row, y) => {
    const offset = -((row.length - 1) * gx) / 2;
    row.forEach((n, x) => map.place(resOf(n), x0 + offset + x * gx, y0 + y * gy));
  });
}

function circle(map, items, { cx = 0, cy = 0 } = {}) {
  const r = Math.max(600, (items.length * (CW + 90)) / (2 * Math.PI));
  items.forEach((it, i) => {
    const a = (2 * Math.PI * i) / items.length - Math.PI / 2;
    map.place(it, cx + r * Math.cos(a) - CW / 2, cy + r * Math.sin(a) - CH / 2);
  });
}

// ---------- one book ----------

const NOTE_ORDER = [
  'Question this chapter answers',
  'Leading propositions',
  'Arguments',
  'Evidence offered',
  'Concessions and qualifications',
  'Proposals',
  'Key terms',
  'Quotes',
  'Tensions / links to other chapters',
  'Open questions',
  'Recite check',
];
const NOTE_PARENT = {
  'Leading propositions': 'Question this chapter answers',
  Arguments: 'Leading propositions',
  'Evidence offered': 'Arguments',
  'Concessions and qualifications': 'Arguments',
  Proposals: 'Arguments',
  'Key terms': 'Question this chapter answers',
  Quotes: 'Evidence offered',
  'Tensions / links to other chapters': 'Leading propositions',
  'Open questions': 'Tensions / links to other chapters',
  'Recite check': 'Question this chapter answers',
};
const noteKind = (heading) => NOTE_ORDER.find((k) => heading.startsWith(k)) ?? heading;

function buildBook(book) {
  const base = `books/${book.slug}`;
  const f = {
    brief: `${base}/brief.md`,
    map: `${base}/deep-read/map.md`,
    synth: `${base}/deep-read/synthesis.md`,
    terms: `${base}/deep-read/terms.md`,
  };
  const brief = read(f.brief);
  const map = read(f.map);
  const synth = read(f.synth);
  const terms = read(f.terms);
  const b2 = sections(brief, 2);
  const m2 = sections(map, 2);
  const s2 = sections(synth, 2);
  const t2 = sections(terms, 2);
  const K = book.slug;

  // ----- chapter units from map.md Structure -----
  const noteFiles = readdirSync(join(ROOT, base, 'deep-read/notes'));
  const units = [];
  const parts = [];
  let part = null;
  for (const row of tableRows(named(m2, 'Structure').body)) {
    const [id, pages, title, role] = row;
    const pm = title.match(/^\*\*(.*)\*\*$/);
    if (/^\*\*Part/.test(id)) {
      part = { id: id.replace(/\*\*/g, ''), title: pm ? pm[1] : title, role, units: [] };
      parts.push(part);
      continue;
    }
    const file = noteFiles.find((n) => n.startsWith(`${id}-`));
    if (!file) continue;
    const u = { id, pages, title: title.replace(/\\/g, ''), role, file: `${base}/deep-read/notes/${file}`, chapterTxt: `${base}/deep-read/chapters/${file.replace(/\.md$/, '.txt')}` };
    if (!existsSync(join(ROOT, u.chapterTxt))) {
      const alt = readdirSync(join(ROOT, base, 'deep-read/chapters')).find((n) => n.startsWith(`${id}-`));
      u.chapterTxt = alt ? `${base}/deep-read/chapters/${alt}` : null;
    }
    units.push(u);
    if (/^Conclusion\b/.test(u.title)) part = null;
    part?.units.push(u);
  }
  const known = new Set(units.map((u) => u.id));
  const unitById = new Map(units.map((u) => [u.id, u]));

  // ----- brief's chapter value map -----
  const valueSec = named(b2, 'Chapter value map');
  for (const [label, value, contribution, rec] of tableRows(valueSec.body)) {
    const num = book.valueOverrides[label] ? null : label.match(/^(\d{1,2})\s/);
    const id = num ? `ch${num[1].padStart(2, '0')}` : book.valueOverrides[label];
    const u = unitById.get(id);
    if (!u) throw new Error(`${K}: no unit for value row "${label}"`);
    u.value = Math.max(u.value ?? 0, Number(value));
    (u.verdicts ??= []).push(rewriteLinks(`- **${label}** · ${value} · ${rec}: ${contribution}`, f.brief));
  }

  // ----- Chapter spaces (deepest level) -----
  for (const u of units) {
    const sp = new Space(`${K}:unit:${u.id}`, `${book.short} ${u.id} · ${u.title}`);
    u.space = sp;
    const note = read(u.file);
    const secs = sections(note, 2).filter((s) => s.heading);
    const mp = sp.map('note', 'Note');
    const gStruct = mp.graph('structure', 'Analysis', { color: '#4e79a7', headShape: 'arrow' });
    const byKind = new Map();
    const placed = [];
    for (const s of secs) {
      const kind = noteKind(s.heading);
      let body = md(s.body, u.file).replace(/^\*\(mirror each row[^\n]*\)\*\s*$/m, '').trim();
      if (kind === 'Question this chapter answers') {
        const meta = [`*${u.role}*`, ''];
        if (u.verdicts) meta.push("**Brief's verdict**", '', ...u.verdicts, '');
        const links = [`[Deep-read note](${REPO_URL}${u.file})`];
        if (u.chapterTxt) links.push(`[chapter text](${REPO_URL}${u.chapterTxt})`);
        meta.push(`Pages ${u.pages} · ${links.join(' · ')}`, '', '---', '');
        body = meta.join('\n') + body;
      }
      const r = sp.markdown(kind, s.heading, body);
      byKind.set(kind, r);
      placed.push({ kind, r });
    }
    const q = byKind.get('Question this chapter answers');
    if (!q) throw new Error(`${u.file}: no "Question this chapter answers" section`);
    mp.place(q, 0, 0, OPEN);
    const rest = placed.filter((p) => p.r !== q).sort((a, b) => NOTE_ORDER.indexOf(a.kind) - NOTE_ORDER.indexOf(b.kind));
    grid(mp, rest.map((p) => p.r), { x0: 640, y0: 0, cols: 3 });
    for (const { kind, r } of rest) gStruct.edge(byKind.get(NOTE_PARENT[kind]) ?? q, r);

    // cross-chapter links, parsed from the bold lead of each Tensions bullet
    const tens = secs.find((s) => s.heading.startsWith('Tensions'));
    u.links = [];
    for (const m of (tens?.body ?? '').matchAll(/^- \*\*([^*]+)\*\*/gm)) {
      const lead = m[1];
      const kind = /^depends/i.test(lead) ? 'depends' : /^feeds/i.test(lead) ? 'feeds' : /tension/i.test(lead) ? 'tension' : 'links';
      for (const ref of chapterRefs(lead, known)) if (ref !== u.id) u.links.push({ kind, ref, lead });
    }
  }

  const unitLabel = (u) => `${u.id} · ${u.title}`;

  // ----- Chapters space -----
  const chSp = new Space(`${K}:chapters`, `${book.short} · Chapters`);
  const portals = new Map(units.map((u) => [u.id, chSp.portal(`portal:${u.id}`, `${unitLabel(u)}\n${u.role}`, u.space)]));
  const P = (id) => portals.get(id);

  const mOrder = chSp.map('order', 'Reading order');
  const gNext = mOrder.graph('next', 'Next', { color: '#59a14f', headShape: 'arrow' });
  grid(mOrder, units.map((u) => P(u.id)), { cols: 5, snake: true, gx: 380 });
  gNext.chain(units.map((u) => P(u.id)));

  const filled = parts.filter((p) => p.units.length);
  if (filled.length) {
    const mParts = chSp.map('parts', 'Parts');
    const gParts = mParts.graph('sequence', 'Sequence', { color: '#59a14f', headShape: 'arrow' });
    const partPortals = filled.map((p, i) => {
      const ps = new Space(`${K}:part:${i}`, `${book.short} · ${p.id}: ${p.title}`);
      const pm = ps.map('part', p.id);
      const gp = pm.graph('chapters', 'Chapters', { color: '#59a14f', headShape: 'arrow' });
      const head = ps.ur('head', `${p.id}: ${p.title}\n${p.role}`);
      pm.place(head, 0, 0, { w: 360, h: 180, shape: 'pill' });
      const ins = p.units.map((u) => ps.portal(`portal:${u.id}`, `${unitLabel(u)}\n${u.role}`, u.space));
      ins.forEach((r, j) => pm.place(r, 440 + j * GX, 0, { w: 300, h: 200 }));
      gp.edge(head, ins[0]);
      gp.chain(ins);
      return chSp.portal(`part:${i}`, `${p.id}: ${p.title}\n${p.role}`, ps);
    });
    const partOf = new Map(filled.flatMap((p, i) => p.units.map((u) => [u.id, i])));
    const order = [];
    for (const u of units) {
      const i = partOf.get(u.id);
      if (i === undefined) order.push(P(u.id));
      else if (!order.includes(partPortals[i])) order.push(partPortals[i]);
    }
    order.forEach((r, i) => mParts.place(r, i * 420, 0, { w: 340, h: 200 }));
    gParts.chain(order);
  }

  const mDeps = chSp.map('dependencies', 'Dependencies');
  circle(mDeps, units.map((u) => P(u.id)));
  const gFeeds = mDeps.graph('feeds', 'Feeds / depends on', { color: '#4e79a7', headShape: 'arrow' });
  const gTens = mDeps.graph('tension', 'Tension', { color: '#e15759', headShape: 'diamond' });
  const gLinks = mDeps.graph('links', 'Links', { color: '#9c9c9c', headShape: 'dot' });
  for (const u of units)
    for (const l of u.links) {
      if (l.kind === 'feeds') gFeeds.edge(P(u.id), P(l.ref));
      else if (l.kind === 'depends') gFeeds.edge(P(l.ref), P(u.id));
      else if (l.kind === 'tension') gTens.edge(P(u.id), P(l.ref));
      else gLinks.edge(P(u.id), P(l.ref));
    }

  const mValue = chSp.map('value', 'Value');
  const gVal = mValue.graph('by-value', 'Most valuable first', { color: '#f28e2b', headShape: 'vee' });
  const scored = units.filter((u) => u.value != null);
  scored.forEach((u) => mValue.place(P(u.id), units.indexOf(u) * 300, (100 - u.value) * 28));
  for (const v of [90, 70, 50, 30]) mValue.place(chSp.ur(`axis:${v}`, `Value ${v}`), -420, (100 - v) * 28, { shape: 'pill' });
  const table = chSp.markdown('value-table', 'Chapter value map\nfrom the brief', md(valueSec.body, f.brief));
  mValue.place(table, -1180, 0, WIDE);
  gVal.edge(table, P([...scored].sort((a, b) => b.value - a.value)[0].id));
  gVal.chain([...scored].sort((a, b) => b.value - a.value).map((u) => P(u.id)));

  // ----- Argument space -----
  const arSp = new Space(`${K}:argument`, `${book.short} · Argument`);
  const b3 = sections(named(b2, '3-minute mental model').body, 3);
  const ranked = named(b3, 'Core ideas').body.split('\n').filter((l) => /^\d+\. /.test(l));
  const deep = sections(named(b2, '10-minute deep brief').body, 3).filter((s) => s.heading);
  const mIdeas = arSp.map('ideas', 'Core ideas');
  const gRank = mIdeas.graph('ranked', 'Ranked', { color: '#4e79a7', headShape: 'arrow' });
  const argMap = arSp.markdown('argument-map', 'Argument map\nfrom the brief', md(named(b3, 'Argument map').body, f.brief));
  mIdeas.place(argMap, 0, 0, WIDE);
  const ideas = deep.map((s, i) => {
    const lead = ranked[i] ? `${ranked[i].replace(/^\d+\.\s*/, '')}\n\n---\n\n` : '';
    return arSp.markdown(`idea:${i}`, s.heading, md(lead + s.body, f.brief));
  });
  grid(mIdeas, ideas, { x0: 820, y0: 0, cols: 3 });
  gRank.edge(argMap, ideas[0]);
  gRank.chain(ideas);

  const sec2 = find(s2, (h) => h.startsWith('2.'));
  const sub2 = sections(sec2.body, 3).filter((s) => s.heading && !s.body.includes('```mermaid'));
  const mSyn = arSp.map('synthesis', 'Synthesis');
  const gSyn = mSyn.graph('line', 'Line of argument', { color: '#76b7b2', headShape: 'arrow' });
  const synIntro = sections(sec2.body, 3)[0].body;
  const synHead = arSp.ur('synthesis-head', sec2.heading.replace(/^2\.\s*/, ''));
  mSyn.place(synHead, 0, 0, { shape: 'ellipse' });
  const synRes = sub2.map((s, i) => arSp.markdown(`syn:${i}`, s.heading, md((i === 0 && synIntro ? synIntro + '\n\n' : '') + s.body, f.synth)));
  synRes.forEach((r, i) => mSyn.place(r, 340 + i * 620, 0, OPEN));
  gSyn.edge(synHead, synRes[0]);
  gSyn.chain(synRes);

  const cm = mermaid(synth);
  const mConcept = arSp.map('concepts', 'Concept map');
  const gArg = mConcept.graph('argued', 'Argued', { color: '#4e79a7', headShape: 'arrow' });
  const gWeak = mConcept.graph('weak', 'Asserted or weakly supported', { color: '#e15759', headShape: 'vee' });
  const concept = new Map([...cm.nodes].map(([k, label]) => [k, arSp.ur(`concept:${k}`, label)]));
  layered(mConcept, [...cm.nodes.keys()], cm.edges, (k) => concept.get(k), { x0: 0, y0: 0 });
  for (const e of cm.edges) (e.weak ? gWeak : gArg).edge(concept.get(e.from), concept.get(e.to));
  if (cm.caption) {
    const cap = arSp.markdown('concept-caption', 'Reading the map', md(cm.caption, f.synth));
    const minX = Math.min(...[...concept.values()].map((r) => mConcept.positions[r.id].x));
    mConcept.place(cap, minX - OPEN.w - 140, 0, OPEN);
    gArg.edge(cap, concept.get([...cm.nodes.keys()].find((k) => !cm.edges.some((e) => e.to === k))));
  }

  const mWhere = arSp.map('concepts-chapters', 'Concepts in chapters');
  const gWhere = mWhere.graph('developed', 'Developed in', { color: '#b07aa1', headShape: 'arrow' });
  const arPortals = new Map();
  const conceptKeys = [...cm.nodes.keys()];
  conceptKeys.forEach((k, i) => mWhere.place(concept.get(k), 0, i * 190));
  units.forEach((u, i) => {
    const r = arSp.portal(`portal:${u.id}`, unitLabel(u), u.space);
    arPortals.set(u.id, r);
    mWhere.place(r, 900, i * (conceptKeys.length * 190) / units.length);
  });
  for (const k of conceptKeys) for (const ref of chapterRefs(cm.nodes.get(k), known)) gWhere.edge(concept.get(k), arPortals.get(ref));

  // ----- Lexicon space -----
  const lxSp = new Space(`${K}:lexicon`, `${book.short} · Lexicon`);
  const termSec = find(t2, (h) => /terms across/i.test(h));
  const rows = tableRows(termSec.body);
  const mTerms = lxSp.map('terms', 'Contested terms');
  const gIdx = mTerms.graph('index', 'Index', { color: '#9c9c9c', headShape: 'dot' });
  const gXref = mTerms.graph('xref', 'Cross-references', { color: '#b07aa1', headShape: 'arrow' });
  const hub = lxSp.ur('hub', termSec.heading);
  const intro = lxSp.markdown('intro', 'About this lexicon', md(t2[0].body.replace(/^# .*$/m, '') + `\n\nThe full ledger is split across the chapter Spaces, one **Key terms** card each.`, f.terms));
  mTerms.place(hub, 0, 0, { w: 320, h: 160, shape: 'ellipse' });
  mTerms.place(intro, -720, 0, OPEN);
  gIdx.edge(intro, hub);
  const termRes = rows.map(([term, at, meaning, evolves], i) => {
    const uses = splitTopLevel(evolves).map((s) => `- ${s}`).join('\n');
    const body = `**Defined at** p. ${at}\n\n${meaning}\n\n**Evolves / reused at**\n\n${uses}`;
    const r = lxSp.markdown(`term:${i}`, term, md(body, f.terms));
    r.names = term.split(/\s*[(/=]\s*/).map((s) => s.replace(/[)"]/g, '').trim()).filter((s) => s.length >= 3 || /[^\x00-\x7f]/.test(s));
    r.text = `${meaning} ${evolves}`;
    r.evolves = evolves;
    return r;
  });
  circle(mTerms, termRes, { cx: CW / 2, cy: CH / 2 });
  for (const r of termRes) gIdx.edge(hub, r);
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const a of termRes)
    for (const b of termRes)
      if (a !== b && b.names.some((n) => new RegExp(`(^|[^\\p{L}])${esc(n)}([^\\p{L}]|$)`, 'iu').test(a.text))) gXref.edge(a, b);

  const mTermCh = lxSp.map('terms-chapters', 'Terms across chapters');
  const gTermCh = mTermCh.graph('reused', 'Defined or reused in', { color: '#f28e2b', headShape: 'arrow' });
  termRes.forEach((r, i) => mTermCh.place(r, 0, i * 200));
  const lxPortals = new Map();
  units.forEach((u, i) => {
    const r = lxSp.portal(`portal:${u.id}`, unitLabel(u), u.space);
    lxPortals.set(u.id, r);
    mTermCh.place(r, 1000, i * (termRes.length * 200) / units.length);
  });
  for (const r of termRes) for (const ref of chapterRefs(r.evolves, known)) gTermCh.edge(r, lxPortals.get(ref));
  for (const r of termRes) delete r.names, delete r.text, delete r.evolves;

  // ----- Critique space -----
  const crSp = new Space(`${K}:critique`, `${book.short} · Critique`);
  const sec3 = find(s2, (h) => h.startsWith('3.'));
  const sec4 = find(s2, (h) => h.startsWith('4.'));
  const mTrue = crSp.map('assessment', 'Is it true?');
  const gVerdict = mTrue.graph('verdict', 'Verdict', { color: '#e15759', headShape: 'arrow' });
  const trueHub = crSp.ur('true-hub', sec3.heading.replace(/^3\.\s*/, ''));
  mTrue.place(trueHub, 0, 0, { w: 360, h: 180, shape: 'diamond' });
  const sub3 = sections(sec3.body, 3);
  const verdicts = [];
  if (sub3[0].body) verdicts.push(crSp.markdown('true-intro', 'In brief', md(sub3[0].body, f.synth)));
  sub3.filter((s) => s.heading).forEach((s, i) => verdicts.push(crSp.markdown(`true:${i}`, s.heading, md(s.body, f.synth))));
  verdicts.push(crSp.markdown('brief-assessment', 'Critical assessment\nfrom the brief', md(named(b2, 'Critical assessment').body, f.brief)));
  verdicts.forEach((r, i) => mTrue.place(r, 480 + (i % 3) * 620, Math.floor(i / 3) * 480, OPEN));
  for (const r of verdicts) gVerdict.edge(trueHub, r);
  const vlog = named(s2, 'Verification log');
  if (vlog) {
    const r = crSp.markdown('verification', 'Verification log', md(vlog.body, f.synth));
    mTrue.place(r, 0, 320);
    gVerdict.edge(trueHub, r, 'checked by');
  }

  const mSoWhat = crSp.map('so-what', 'What of it?');
  const gSo = mSoWhat.graph('so-what', 'So what', { color: '#59a14f', headShape: 'arrow' });
  const soWhat = crSp.markdown('what-of-it', sec4.heading.replace(/^4\.\s*/, ''), md(sec4.body, f.synth));
  const action = crSp.markdown('action', 'Action layer', md(named(b2, 'Action layer').body, f.brief));
  mSoWhat.place(soWhat, 0, 0, OPEN);
  mSoWhat.place(action, 660, 0, OPEN);
  gSo.edge(soWhat, action, 'try it');

  // ----- Book space -----
  const bkSp = new Space(`${K}:book`, `${book.title}`);
  const mOv = bkSp.map('overview', 'Overview');
  const gTour = mOv.graph('tour', 'Tour', { color: '#4e79a7', headShape: 'arrow' });
  const gSrc = mOv.graph('provenance', 'Provenance', { color: '#9c9c9c', headShape: 'dot' });
  const about = bkSp.markdown('about', `${book.title}\n${book.author}, ${book.year}`, md(named(b2, 'Header').body + '\n\n## Classification\n\n' + named(m2, 'Classification').body + '\n\n## Reading notes\n\n' + m2[0].body.replace(/^# .*$/m, ''), f.brief));
  const question = bkSp.ur('question', named(m2, 'The whole-book question').body);
  const thirty = bkSp.markdown('thirty', '30-second brief', md(named(b2, '30-second brief').body, f.brief));
  const unity = bkSp.markdown('unity', 'Unity statement', md(named(m2, 'Unity statement').body, f.map));
  const whole = bkSp.markdown('whole', find(s2, (h) => h.startsWith('1.')).heading.replace(/^1\.\s*/, ''), md(find(s2, (h) => h.startsWith('1.')).body, f.synth));
  const pArg = bkSp.portal('argument', 'Argument\ncore ideas · synthesis · concept map', arSp);
  const pCh = bkSp.portal('chapters', 'Chapters\nreading order · dependencies · value', chSp);
  const pLx = bkSp.portal('lexicon', 'Lexicon\ncontested terms and where they move', lxSp);
  const pCr = bkSp.portal('critique', 'Critique\nis it true? · what of it?', crSp);
  const remember = bkSp.markdown('remember', 'Three things to remember', md(named(b3, 'Three things').body, f.brief));
  const changes = bkSp.markdown('changes', "What it changes in the reader's thinking", md(named(b3, 'What it changes').body, f.brief));
  const recommend = bkSp.markdown('recommend', 'Reading recommendation', md(named(b2, 'Reading recommendation').body, f.brief));
  const quotes = bkSp.markdown('quotes', 'Direct quotations used', md(named(b2, 'Direct quotations used').body, f.brief));

  mOv.place(question, 0, 0, { w: 520, h: 220, shape: 'ellipse' });
  mOv.place(thirty, 620, 0, OPEN);
  mOv.place(unity, 1240, 0, OPEN);
  mOv.place(whole, 1860, 0, OPEN);
  [pArg, pCh, pLx, pCr].forEach((r, i) => mOv.place(r, 620 + i * 400, 560, { w: 340, h: 220 }));
  mOv.place(remember, 620, 900);
  mOv.place(changes, 960, 900);
  mOv.place(recommend, 1300, 900);
  mOv.place(about, 0, 360);
  mOv.place(quotes, 0, 620);
  gTour.chain([question, thirty, unity, whole, pArg, pCh, pLx, pCr, remember, changes, recommend]);
  gSrc.edge(about, question, 'asks');
  gSrc.edge(about, quotes, 'quotes');

  const mPlan = bkSp.map('plan', 'Reading plan');
  const gPlan = mPlan.graph('read-next', 'Read next', { color: '#f28e2b', headShape: 'arrow' });
  const hv = named(m2, 'High-value chapters');
  const why = bkSp.markdown('plan-why', 'Why these chapters', md(hv.body.split('\n').filter((l) => !/^\d+\. /.test(l)).join('\n') + '\n\n## Mode and plan\n\n' + named(m2, 'Mode and plan').body, f.map));
  mPlan.place(why, 0, 0, OPEN);
  const planned = [];
  for (const line of hv.body.split('\n').filter((l) => /^\d+\. /.test(l))) {
    const [ids, reason = ''] = line.replace(/^\d+\.\s*/, '').split(/\s+—\s+/);
    const rank = line.match(/^(\d+)/)[1];
    for (const id of chapterRefs(ids, known)) {
      const u = unitById.get(id);
      planned.push(bkSp.portal(`plan:${id}`, `${rank} · ${unitLabel(u)}\n${reason}`, u.space));
    }
  }
  planned.forEach((r, i) => mPlan.place(r, 680 + (i % 4) * 380, Math.floor(i / 4) * 280, { w: 320, h: 220 }));
  gPlan.edge(why, planned[0]);
  gPlan.chain(planned);

  return { space: bkSp, book };
}

// ---------- Library (Meta) ----------

function buildLibrary(built) {
  const lib = new Space('meta', 'Library');
  const m = lib.map('library', 'Library');
  const gShelf = m.graph('shelf', 'Shelf', { color: '#4e79a7', headShape: 'arrow' });
  const gTime = m.graph('chronology', 'Chronology', { color: '#9c9c9c', headShape: 'vee' });
  const guide = lib.markdown(
    'guide',
    'How this library is organised',
    `Each book is a stack of Spaces, one per level of abstraction. Open a book to start at the top and drill down.

1. **Book.** The whole-book question, the 30-second brief, the unity statement and a **Tour** to present. A second Map, **Reading plan**, goes straight to the chapters worth reading.
2. **Argument · Chapters · Lexicon · Critique.** Four lenses on the same book.
   - *Argument*: the ranked core ideas, the synthesis, a concept map with argued and weak steps as separate Graphs, and a Map from each concept to the chapters that develop it.
   - *Chapters*: reading order, the parts (where the book has them), a dependency Map built from each note's "feeds / depends on / tension" links, and a value chart (higher is more valuable).
   - *Lexicon*: the contested terms, how they cross-reference, and the chapters where each one shifts.
   - *Critique*: is it true, in whole or in part, and what of it.
3. **Chapter.** One deep-read note, split into its question, propositions, arguments, evidence, quotes, tensions and open questions, joined in the order the analysis runs.

Chapter Spaces are reachable from several lenses, so the same note can be entered from a concept, a term, the dependency web or the reading plan.

Locators: the brief cites line numbers in \`source/source.txt\`; the deep-read notes cite \`[[page N]]\` markers in \`deep-read/source.txt\`. Links open the committed files on GitHub.

This directory is generated by \`scripts/build-cube.mjs\`. Rebuilding replaces it, so edits made in a cube run are lost on the next build.`,
  );
  m.place(guide, 0, 0, OPEN);
  const portals = built.map(({ space, book }, i) => {
    const r = lib.portal(`book:${book.slug}`, `${book.title}\n${book.author}, ${book.year}`, space);
    m.place(r, 700 + i * 820, 0, { w: 760, h: 520, open: true });
    gShelf.edge(guide, r);
    return r;
  });
  const sorted = built.map((b, i) => ({ ...b, r: portals[i] })).sort((a, b) => a.book.year - b.book.year);
  for (let i = 1; i < sorted.length; i++) gTime.edge(sorted[i - 1].r, sorted[i].r, `${sorted[i - 1].book.year} → ${sorted[i].book.year}`);
  return lib;
}

// ---------- books on disk ----------

export function missingBooks(root = ROOT) {
  const dir = join(root, 'books');
  if (!existsSync(dir)) return [];
  const listed = new Set(BOOKS.map((b) => b.slug));
  return readdirSync(dir)
    .filter((slug) => existsSync(join(dir, slug, 'deep-read/synthesis.md')) && !listed.has(slug))
    .sort();
}

// ---------- write ----------

export function build(out = OUT) {
  spaces = [];
  resourceIds = new Set();
  assets = new Map();
  const missing = missingBooks();
  if (missing.length) throw new Error(`books with a finished deep read are missing from BOOKS: ${missing.join(', ')}`);
  const built = BOOKS.map(buildBook);
  const meta = buildLibrary(built);

  rmSync(out, { recursive: true, force: true });
  mkdirSync(join(out, 'assets'), { recursive: true });
  const write = (rel, obj) => {
    mkdirSync(dirname(join(out, rel)), { recursive: true });
    writeFileSync(join(out, rel), typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2) + '\n');
  };
  write('aggregate.json', { version: 1, metaSpaceId: meta.id });
  for (const sp of spaces) {
    write(`${sp.id}/space.json`, sp.json());
    for (const r of sp.resources) write(`${sp.id}/resources/${r.id}.json`, { id: r.id, title: r.title, kind: r.kind, content: r.content });
  }
  for (const [hash, bytes] of assets) writeFileSync(join(out, 'assets', `${hash}.md`), bytes);
  write(
    'README.md',
    `# Research cube\n\nAn InfinityCube Aggregate directory built from \`books/*/brief.md\` and \`books/*/deep-read/\`.\n\nGenerated by \`node scripts/build-cube.mjs\`; do not edit by hand. Check with \`pnpm cube check <abs path>/cube\` and open with \`pnpm cube run <abs path>/cube\` from an InfinityCube clone.\n`,
  );
  console.log(`${spaces.length} spaces, ${spaces.reduce((n, s) => n + s.resources.length, 0)} resources, ${assets.size} assets`);
  return { spaces: spaces.length, resources: spaces.reduce((n, s) => n + s.resources.length, 0), assets: assets.size };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) build();
