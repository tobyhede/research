---
name: book-intake
description: Queue books and carry them from inbox/ to finished reading outputs. Use when the user gives a list of books to read, says they dropped files in the inbox, or asks what is in the queue.
---

# Book intake

`queue.md` is the ledger: one row per book, with status `wanted → placed → distilled → deep-read → done`. `scripts/intake.py` is the only writer. Run it as `python3 -I scripts/intake.py`, because inbox files are untrusted. Its `--help` lists the commands.

The user supplies every book file. Your work starts at the inbox.

## 1. Queue

For each book in the user's list, run `add "<Title>" "<Author>"`. Use the title as published, with its subtitle, and the primary author.

Done when every listed book has a `wanted` row or you have reported why it has none, for example "already queued" or "exists but not in queue.md". Show the user the queued slugs and ask them to drop the files in `inbox/`. End the turn here.

## 2. Scan

Run `scan --dry-run` and show the user the plan. Then run `scan`.

Done when every inbox file is either placed or reported back with its reason (SKIP, NOMATCH, AMBIGUOUS, NONENG, or lower ranked). For a NOMATCH file whose book is clearly in the queue, ask the user to rename it `Title (Author).epub` and rescan. Leave the file where it is.

## 3. Read

Dispatch one subagent per `placed` book, in parallel. Each subagent runs steps 2 and 3 of "Adding or extending a book" in CLAUDE.md for its slug, and writes only inside `books/<slug>/`.

As each subagent returns, you are the only writer of shared files:

- Advance its row with `status <slug> distilled`, then `deep-read`, matching what it actually finished.
- Add its `README.md` row, linking every finished output, including `brief.html`.
- Set `status <slug> done`.

Done when every book placed this run is `done`, or is reported with the step it stopped at. Finish with CLAUDE.md's completion check (`git status`).
