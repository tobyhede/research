# Map: The Conscious Mind

- **Author**: David J. Chalmers
- **Edition/year**: The Conscious Mind: In Search of a Fundamental Theory. Oxford University Press, Philosophy of Mind Series (series editor Owen Flanagan), 1996. EPUB edition.
- **Pages**: 392 synthetic pages (about 196,000 words including endnotes, bibliography and index). The source is an EPUB, so `[[page N]]` markers in `source.txt` are 500-word blocks, not printed pages. Figures and inline formulae appear as `[image]`.
- **Page offset**: none. The index and the book's own cross-references ("pp. 153–55") use printed page numbers, which do not correspond to the markers here and are not recoverable as locators. A different coordinate system (line numbers in `../source/source.txt`) is used by `../brief.md`. Do not mix the two.

## Classification

- **Kind**: theoretical. It argues for what consciousness is and how it relates to the physical world, and prescribes only a research programme.
- **Genre**: analytic philosophy of mind, with excursions into cognitive science, the theory of computation and the foundations of quantum mechanics. Read with the philosophy strategy: dig for unstated premises, track terms whose meaning is stipulated and then stretched (consciousness, awareness, supervenience, possibility, information), and keep positions separate from the arguments for them.

## The whole-book question

Can conscious experience be explained in physical terms, and if it cannot, what kind of theory of it is possible?

## Unity statement

Chalmers argues that experience does not logically supervene on the physical: the physical facts could be exactly as they are with no experience at all, so no reductive explanation of consciousness can succeed and materialism is false. He replaces it with naturalistic dualism, on which experience is a fundamental feature of the world tied to physical processes by psychophysical laws, and he then looks for those laws: coherence between consciousness and awareness, organizational invariance, and a speculative double-aspect theory of information. The last two chapters apply the result to argue that the right computation would be conscious and that the Everett interpretation of quantum mechanics is the most attractive.

## Structure

| Part/Chapter | Pages | Title | Role in the argument |
| --- | --- | --- | --- |
| fm01 | 3–10 | Introduction: Taking Consciousness Seriously | States the three constraints (take consciousness seriously, take science seriously, treat consciousness as lawful), previews the four parts, gives the short tour |
| ch01 | 10–37 | Two Concepts of Mind | Part I. Separates the phenomenal concept of mind from the psychological one; consciousness from awareness; the hard part of the mind–body problem from the easy part |
| ch02 | 37–91 | Supervenience and Explanation | Part I. The framework: logical and natural supervenience, reductive explanation as requiring logical supervenience, primary and secondary intensions, and the claim that almost everything supervenes logically on the physical |
| ch03 | 91–117 | Can Consciousness Be Reductively Explained? | Part II. Five arguments that consciousness does not logically supervene (zombies, inverted spectrum, epistemic asymmetry, knowledge argument, absence of analysis); why cognitive, neurobiological, quantum and evolutionary accounts fall short |
| ch04 | 117–164 | Naturalistic Dualism | Part II. From failure of logical supervenience to the falsity of materialism; replies from a posteriori necessity; epiphenomenalism; the taxonomy of positions; the positive view |
| ch05 | 164–200 | The Paradox of Phenomenal Judgment | Part II. The hardest objection to the view: our claims about consciousness can be explained without consciousness. Defends the view on knowledge, memory and reference |
| ch06 | 200–232 | The Coherence Between Consciousness and Cognition | Part III. First psychophysical principles: consciousness goes with awareness, and the structure of experience mirrors the structure of awareness; what neuroscience can and cannot do |
| ch07 | 232–259 | Absent Qualia, Fading Qualia, Dancing Qualia | Part III. Organizational invariance, argued by gradual-replacement thought experiments; nonreductive functionalism |
| ch08 | 259–292 | Consciousness and Information: Some Speculation | Part III. A prototheory of the fundamental laws: the double-aspect principle, the thermostat and panpsychism, the Russellian reading |
| ch09 | 292–310 | Strong Artificial Intelligence | Part IV. An account of what it is to implement a computation; strong AI follows from organizational invariance; replies to Searle and to Gödelian objections |
| ch10 | 310–334 | The Interpretation of Quantum Mechanics | Part IV. Recasts the measurement problem as a psychophysical question; the theory supports Everett's interpretation; the probability problem; the author's final confidence ranking |
| ap01 | 334–371 | Notes | Endnotes to chapters 1–10. Substantive: technical qualifications, replies to the literature, and several concessions that are not in the main text |

Not mapped as units: title and copyright pages, acknowledgments and contents (pp. 1–3), bibliography (pp. 371–382) and index (pp. 382–392).

<!-- diagram:start -->
```mermaid
mindmap
  "Map: The Conscious Mind"
    "fm01: Introduction: Taking Consciousness Seriously (pp. 3–10)"
    "ch01: Two Concepts of Mind (pp. 10–37)"
    "ch02: Supervenience and Explanation (pp. 37–91)"
    "ch03: Can Consciousness Be Reductively Explained? (pp. 91–117)"
    "ch04: Naturalistic Dualism (pp. 117–164)"
    "ch05: The Paradox of Phenomenal Judgment (pp. 164–200)"
    "ch06: The Coherence Between Consciousness and Cognition (pp. 200–232)"
    "ch07: Absent Qualia, Fading Qualia, Dancing Qualia (pp. 232–259)"
    "ch08: Consciousness and Information: Some Speculation (pp. 259–292)"
    "ch09: Strong Artificial Intelligence (pp. 292–310)"
    "ch10: The Interpretation of Quantum Mechanics (pp. 310–334)"
    "ap01: Notes (pp. 334–371)"
```
<!-- diagram:end -->

## High-value chapters for this reading

Ranked against the stated reading purpose: "Understand and critically evaluate Chalmers's argument in full, and leave notes solid enough to support later cross-book thematic syntheses." The purpose was not stated by the reader; it is inferred from this repository's use (deep reads that feed `themes/` syntheses). Revise section 4 of `synthesis.md` if the real purpose differs.

1. ch03 — the case against reductive explanation; everything else is conditional on it
2. ch04 — the step from explanation to ontology, the replies to the strongest materialist objection, and the positive view
3. ch02 — the framework; the two-dimensional semantics is what the reply to a posteriori necessity rests on
4. ch05 — the author's own statement of the worst problem for his view
5. ch07 — the best-argued positive result, and the hinge for ch09 and ch10
6. ch01 and ch06 — the distinction between consciousness and awareness, then the laws connecting them
7. ch08 — openly speculative, but it is where the book's most quoted claims come from
8. ch09 and ch10 — applications; valuable mainly for what they show the theory commits one to

## Mode and plan

- **Mode chosen**: study. `prepare-text.sh` reports about 261,000 tokens and hints large.
- **Plan**: full analytical pass on fm01 and ch01–ch10, one note each. The endnotes (ap01) are not given a note of their own: each chapter's endnotes are read with that chapter and folded into its note, cited at the endnote's own page. The bibliography and index are not read. Chapters were read in separate contexts in balanced batches; ch08 and ch10 were read by the orchestrator because a sixth reader could not be started. Terms are merged centrally into `terms.md`; synthesis is written from the notes.
