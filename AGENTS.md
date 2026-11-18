# research

Distillations and deep reads of books. Each book lives in one directory, `books/<slug>/`, and every file about that book goes inside it.

## Book directory

```
books/<slug>/
├── source/       the book file, distill-book's extraction, and source.txt
├── brief.md      distill-book report
├── brief.html    distill-book interactive reader
└── deep-read/    deep-reader workspace (map.md, terms.md, notes/, synthesis.md)
```

- `<slug>` is the short title in kebab-case (`road-to-serfdom`). Append the author's surname when two books collide.
- Filenames inside a book directory are fixed, so links and cross-book work can rely on them.
- `themes/<topic>.md` holds syntheses that span several books. Each links into the `deep-read/synthesis.md` of the books it draws on.

## Book artifacts

Commit the source book, extracted text, extraction manifest, generated HTML reader, and deep-reader workspace alongside the Markdown notes. Keep source locators stable so readers can verify claims. Quotations in briefs and notes stay short and carry a locator.

## Adding or extending a book

`queue.md` tracks every book's status. For book lists, inbox files, or queue status, read [book-intake](.agents/skills/book-intake/SKILL.md) and follow its queue, scan, and reading workflow.

1. Place the book file in `books/<slug>/source/`.
2. **Distill** with the `distill-book` skill. Extract into `books/<slug>/source/`, with the line-numbered text at `source/source.txt`. Write the report to `brief.md`, citing `./source/source.txt#L<n>`, and build the reader to `brief.html`.
3. **Deep read** with the `deep-reader` skill. Pass `books/<slug>/deep-read` as the workspace (second argument to `prepare-text.sh`); its default is a `<slug>-notes/` directory beside the source.
4. Update the book's row in the `README.md` index, and set its `queue.md` status to `done`.

Done when every file shown by `git status --short --untracked-files=all` belongs to the intended book artifacts or documentation changes, and the README row links to every finished reading output, including `brief.html`.

## Locators

A book has two coordinate systems. `brief.md` cites line numbers in `source/source.txt`. Deep-read notes cite `[[page N]]` markers in `deep-read/source.txt`. Quote each in its own system.
