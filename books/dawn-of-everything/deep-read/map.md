# Map: The Dawn of Everything

- **Author**: David Graeber and David Wengrow
- **Edition/year**: The Dawn of Everything: A New History of Humanity. Penguin ebook, ISBN 978-0-241-40245-0; the text was finished in August 2020 (foreword, p. 5). The foreword and acknowledgements are by Wengrow alone, Graeber having died in September 2020.
- **Pages**: 448 synthetic pages (about 224,000 words) in `source.txt`. The source is an EPUB, so `[[page N]]` markers are 500-word blocks, not printed pages. The argument occupies pp. 4–394; pp. 394–395 hold only the headings of the Notes section, pp. 395–437 the bibliography, pp. 437–448 the index and copyright page.
- **Page offset**: none; printed page numbers are not recoverable from this file. A different coordinate system (line numbers in `../source/source.txt`) is used by `../brief.md`. Do not mix the two.
- **Gaps in this text**: the conversion dropped the body of the endnotes, leaving only their chapter headings (p. 394) and the superscript numbers run into the prose (a figure such as 15 directly after a full stop is an endnote number). The endnotes survive in `../source/source.txt` (lines 4901–6622) and were not read for the notes in this workspace. The seven maps and figures are images and are absent from both texts.

## Classification

- **Kind**: theoretical in form (an account of what happened and how to describe it), practical in aim (to widen the reader's sense of what social arrangements are possible).
- **Genre**: history on the largest scale, built from archaeology and anthropology, written as a sustained polemic against earlier big histories. Read with the history strategy: find what the authors are trying to prove before judging the account, separate reported findings from interpretation, and note for each case what kind of source it rests on and whose view that source carries. Because so much of the argument turns on how words are used (egalitarian, state, civilization, freedom), the philosophy habit of tracking shifting terms applies too.

## The whole-book question

If the standard story of human history, from small egalitarian bands through farming and cities to the state, is wrong, what did happen, and how did humans lose the freedom to move between different ways of organising their societies?

## Unity statement

Graeber and Wengrow argue that there was no original human society, equal or unequal, and no fixed sequence from foraging to farming to cities to states: the archaeological and ethnographic record shows people repeatedly building hierarchies and taking them apart, farming without committing to it, and running large cities without rulers. The story of stages was devised in eighteenth-century Europe partly in answer to Native American criticism of European society. The question worth asking is therefore how three freedoms once taken for granted, to move away, to disobey and to remake social arrangements, came to be lost, and the authors' tentative answer points to the fusion of violence with relations of care in households and kingdoms.

## Structure

| Part/Chapter | Pages | Title | Role in the argument |
| --- | --- | --- | --- |
| fm01 | 4–6 | Foreword, Dedication and Acknowledgements | How the book was written; sources of maps; earlier versions of chapters |
| ch01 | 6–25 | Farewell to Humanity's Childhood | States the target (Rousseau and Hobbes as rival myths) and the three objections; announces the alternative |
| ch02 | 25–64 | Wicked Liberty | Where the inequality question came from: the indigenous critique, Kandiaronk, and Turgot's stages as a reply |
| ch03 | 64–95 | Unfreezing the Ice Age | Palaeolithic evidence: rich burials, monuments, seasonal alternation of social forms; replaces the origins question with "how did we get stuck?" |
| ch04 | 95–127 | Free People, the Origin of Cultures, and the Advent of Private Property | Post-glacial foragers; "free" in place of "egalitarian"; first statement of the freedoms; property as kin to the sacred |
| ch05 | 127–160 | Many Seasons Ago | Worked case of cultural differentiation by refusal: slave-holding Northwest Coast against California |
| ch06 | 160–189 | Gardens of Adonis | Farming in the Fertile Crescent as a slow, reversible, largely women's experiment, not a revolution |
| ch07 | 189–207 | The Ecology of Freedom | Farming's uneven spread worldwide; play farming; the failure of central Europe's first farmers |
| ch08 | 207–246 | Imaginary Cities | Scale does not require rulers: Ukrainian mega-sites, Uruk, the Indus, Taosi |
| ch09 | 246–267 | Hiding in Plain Sight | The same in the Americas: Teotihuacan's social housing, Tlaxcala's council |
| ch10 | 267–330 | Why the State Has No Origin | The theoretical core: three forms of domination, first- and second-order regimes, Egypt, bureaucracy, Minoan Crete |
| ch11 | 330–368 | Full Circle | North America as an independent test: Hopewell, Cahokia and its rejection, Osage and Haudenosaunee constitutions; the roots of the indigenous critique |
| ch12 | 368–394 | Conclusion: The Dawn of Everything | The three freedoms in final form; tentative account of how they were lost; what follows |

<!-- diagram:start -->
```mermaid
mindmap
  "Map: The Dawn of Everything"
    "fm01: Foreword, Dedication and Acknowledgements (pp. 4–6)"
    "ch01: Farewell to Humanity's Childhood (pp. 6–25)"
    "ch02: Wicked Liberty (pp. 25–64)"
    "ch03: Unfreezing the Ice Age (pp. 64–95)"
    "ch04: Free People, the Origin of Cultures, and the Advent of Private Property (pp. 95–127)"
    "ch05: Many Seasons Ago (pp. 127–160)"
    "ch06: Gardens of Adonis (pp. 160–189)"
    "ch07: The Ecology of Freedom (pp. 189–207)"
    "ch08: Imaginary Cities (pp. 207–246)"
    "ch09: Hiding in Plain Sight (pp. 246–267)"
    "ch10: Why the State Has No Origin (pp. 267–330)"
    "ch11: Full Circle (pp. 330–368)"
    "ch12: Conclusion: The Dawn of Everything (pp. 368–394)"
```
<!-- diagram:end -->

## High-value chapters for this reading

Ranked against the stated reading purpose: "Understand and critically evaluate the book's argument in full, and leave notes solid enough to support later cross-book thematic syntheses." The purpose was not stated by the reader; it is inferred from this repository's use (deep reads that feed `themes/` syntheses). Revise section 4 of `synthesis.md` if the real purpose differs.

1. ch10 — the book's own theory: forms of domination, what a state is made of, and how equality-keeping devices become instruments of rule
2. ch12 — the freedoms, the answer to "how did we get stuck?", and the authors' own statement of what remains speculation
3. ch03 — the seasonal-alternation evidence everything later depends on
4. ch08 — the case against scale, with the best-evidenced and the weakest-evidenced city cases side by side
5. ch06 — the strongest scientific evidence in the book (archaeobotany of domestication)
6. ch02 — the intellectual-history thesis the framing rests on; the authors report that most scholars reject its key source
7. ch11 — the test of inevitability and the limits of that test
8. ch05 — the method stated openly: schismogenesis, and the freedom-or-determinism dial as a matter of taste
9. ch04, ch07, ch09 — supporting cases; ch01 — the programme

## Mode and plan

- **Mode chosen**: study. `prepare-text.sh` reports about 298,000 tokens and hints large, with a suggestion to fan out to subagents.
- **Plan**: full analytical pass on every unit, one note each. The fan-out to separate readers was attempted and refused by the session's concurrent-agent limit, so all thirteen units were read sequentially by one reader, in order, with each note written immediately after its chapter and before the next was opened. Terms were then merged into `terms.md` and the synthesis written from the notes. The endnotes, bibliography and index were not read.
