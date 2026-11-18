# Map: Six Easy Pieces

- **Author**: Richard P. Feynman; introduction by Paul Davies; special preface by David L. Goodstein and Gerry Neugebauer
- **Edition/year**: Six Easy Pieces: Essentials of Physics Explained by Its Most Brilliant Teacher (Basic Books, eISBN 978-0-465-02529-9). The six chapters are from The Feynman Lectures on Physics (1963, with Robert B. Leighton and Matthew Sands). Feynman's preface is dated June 1963, the special preface April 1989, Davies's introduction September 1994.
- **Pages**: 101 synthetic pages (about 50,000 words, of which the last three pages are index, footnotes and copyright). The source is an EPUB, so `[[page N]]` markers in `source.txt` are 500-word blocks, not printed pages.
- **Page offset**: none; printed page numbers are not recoverable from this file. A different coordinate system (line numbers in `../source/source.txt`) is used by `../brief.md`. Do not mix the two.
- **Text condition**: all displayed equations, all figures and Tables 2-1 and 2-2 are images in the EPUB and appear in `source.txt` only as `[]` or as a bare equation number. Exponents are flattened (for example "10-8 cm"). The eight footnotes are collected at the end (pp. 100–101), not at their call sites. Notes paraphrase any passage that depends on a missing equation.

## Classification

- **Kind**: theoretical. It explains what is the case and how physicists come to know it. It prescribes nothing beyond a way of reasoning.
- **Genre**: science, written as transcribed lectures for first-year students, with three prefatory essays about the lecturer. Read with the science-and-math strategy: anchor each chapter on the problem posed, reconstruct only the arguments and experiments that carry conclusions (the reversible-machine derivation in ch04, the moon's fall in ch05, the two-slit sequence in ch06), and keep definitions exact in `terms.md`.

## The whole-book question

What is the physical world made of, what kind of thing is a law of physics, and how do we know either?

## Unity statement

Feynman gives a beginner a map of physics as it stood in 1963: matter is atoms in motion, held by electrical forces, obeying a small number of abstract laws that are guessed, tested by experiment and always provisional. Three chapters draw the map and its edges (atoms, the basic forces and particles, the links to other sciences), and three work one law each in detail (energy, gravitation, quantum behavior). The common finding is that the deepest laws are rules for calculating numbers with no known mechanism behind them, and at the atomic scale they predict only probabilities.

## Structure

| Part/Chapter | Pages | Title | Role in the argument |
| --- | --- | --- | --- |
| fm01 | 1–8 | Publisher's Note and Introduction (Paul Davies) | Why these six chapters; Feynman's style and standing; a physicist's preview of the laws, symmetry and the quantum chapters |
| fm02 | 8–15 | Special Preface (Goodstein and Neugebauer) and Feynman's Preface | How the course came about and ran; Feynman's aims and his own verdict on it |
| ch01 | 15–28 | Atoms in Motion | What a law is and how it is tested; the atomic hypothesis and what follows from it |
| ch02 | 28–43 | Basic Physics | What understanding means (the chess analogy); the picture before 1920; fields; quantum physics; nuclei, particles and the four interactions |
| ch03 | 43–57 | The Relation of Physics to Other Sciences | What reduction to physics achieves in chemistry, biology, astronomy, geology and psychology, and where it stops |
| ch04 | 57–68 | Conservation of Energy | A law as an abstract conserved number; a derivation from the impossibility of perpetual motion; the forms of energy; the six conservation laws |
| ch05 | 68–83 | The Theory of Gravitation | How one law was found, tested by prediction, extended to the galaxies, and left without a mechanism |
| ch06 | 83–98 | Quantum Behavior | The two-slit experiment with bullets, waves and electrons; probability amplitudes; the uncertainty principle |
| bm01 | 98–101 | Index, Footnotes and Copyright | Eight footnotes belonging to ch01–ch05; the index is not analysed |

<!-- diagram:start -->
```mermaid
mindmap
  "Map: Six Easy Pieces"
    "fm01: Publisher's Note and Introduction (Paul Davies) (pp. 1–8)"
    "fm02: Special Preface and Feynman's Preface (pp. 8–15)"
    "ch01: Atoms in Motion (pp. 15–28)"
    "ch02: Basic Physics (pp. 28–43)"
    "ch03: The Relation of Physics to Other Sciences (pp. 43–57)"
    "ch04: Conservation of Energy (pp. 57–68)"
    "ch05: The Theory of Gravitation (pp. 68–83)"
    "ch06: Quantum Behavior (pp. 83–98)"
    "bm01: Index, Footnotes and Copyright (pp. 98–101)"
```
<!-- diagram:end -->

## High-value chapters for this reading

Ranked against the stated reading purpose: "Understand Feynman's account of what physics knows and how it knows it, evaluate it, and leave notes solid enough to support later cross-book thematic syntheses." The purpose was not stated by the reader; it is inferred from this repository's use (deep reads that feed `themes/` syntheses).

1. ch06 — the hardest argument and the one the book builds toward: what quantum mechanics asserts and what it refuses to explain
2. ch04 — the clearest statement that a law is an abstract quantity, plus a complete piece of theoretical reasoning
3. ch01 — the method (experiment as judge, laws as approximations) and the atomic hypothesis
4. ch05 — a full case study of discovery, prediction and the limits of explanation
5. ch02 — the chess analogy and the philosophy-of-science remarks; the particle survey is a period piece
6. ch03 — the reductionist programme and its admitted limits; the most relevant chapter for cross-book work on science and other fields
7. fm02 and fm01 — context on the teaching experiment and on Feynman's method

## Mode and plan

- **Mode chosen**: study. `prepare-text.sh` reports about 67,000 tokens and hints medium, sequential.
- **Plan**: full analytical pass on every unit, one note each, read sequentially in a single context because the book is short. The front matter gets two notes (fm01, fm02). The footnotes are read and attributed to their chapters in `notes/bm01-index-footnotes-and-copyright.md` and cited from the chapter notes; the index is not noted. Derivations that depend on missing equation images are reconstructed from the prose and marked as such.
