# ch09: Strong Artificial Intelligence (pp. 292–310)

The chapter file opens with the last two paragraphs of ch08 (p. 292); ch09 starts lower on that page. Endnotes for this chapter are at pp. 369-370 and are cited by their own pages. No section of this chapter carries an asterisk; section 2 is described by Chalmers as a little technical (p. 295).

## Question this chapter answers

Could an appropriately programmed computer be conscious? Chalmers's answer: yes. Implementing a computation means having a causal organization that mirrors the computation's formal structure. A conscious system's fine-grained functional organization can be written down as a computation of that kind. By the principle of organizational invariance argued in ch07, anything with that organization has the same experiences. So some computations are such that implementing them suffices, as a matter of natural law, for conscious experience. Searle's objections fail because they ignore what implementation involves, and the external objections (rule following, Gödel, uncomputability, continuity) do not show that a computer could not behave as we do.

## Key terms

| Term | First used | Author's meaning |
| --- | --- | --- |
| External objections | p. 292 | Objections that computational systems could never even behave like cognitive systems: some human functional capacity is beyond any computer. |
| Internal objections | p. 293 | Objections that grant computers might simulate human behaviour but deny them an inner life: no experience, no true understanding. |
| Strong artificial intelligence | p. 293 | Searle's label, as Chalmers states it: there is a nonempty class of computations such that implementing any member suffices for a mind, and in particular for conscious experience. The sufficiency is natural, not logical. |
| Strength / shape of the connection | p. 293 | Strength: whether consciousness is constituted by physical processes or merely arises from them. Shape: which physical systems give rise to it. The two questions are independent. |
| Computation | p. 294 | An abstract computational object: a Turing machine, Pascal program, finite-state automaton and so on. Mathematical, not concrete. Note 10 rejects the narrower use on which only symbolic computation over representations counts (p. 370). |
| Implementation | p. 294 | The relation between a computation and a physical system that realizes it. Informally: the system's causal structure mirrors the computation's formal structure (p. 296). The bridge between abstract and concrete. |
| Observer-relative | p. 295 | Searle's claim (1990b) that any system implements any computation under some interpretation. Chalmers grants only a limited version: a system implements several computations and the observer picks one (p. 298). |
| Finite-state automaton (FSA) | p. 295 | Finite sets of inputs, internal states and outputs, with transition relations; states are unstructured. |
| Combinatorial-state automaton (CSA) | p. 295 | Like an FSA, but each internal state is a vector of components, each taking finitely many values; inputs and outputs are vectors too; transition rules give each element's new value from old values (pp. 295-296). His chosen formalism. |
| Substate | p. 296 | A value of one component of a CSA state vector, or the corresponding component of a physical system's state. In a physical decomposition each must supervene on a separate region of the system (p. 297). |
| Functional organization | p. 298 | Recalled from ch07: abstract components, states for each, and dependency relations among states, inputs and outputs. A CSA is said to formalise this directly (p. 299). |
| Principle of organizational invariance | p. 294 | From ch07: any system with the same fine-grained functional organization as a conscious system has qualitatively identical experiences (p. 299). |
| Organizational invariant | p. 306 | A property that depends only on the functional organization of the underlying system and not on any other details. |
| The demon | p. 302 | Chalmers's name for the person in Searle's room who carries out the program by hand. |
| Causal facilitator | p. 304 | The demon's role in the consolidated system: mediating causal relations among slips of paper, with its own consciousness irrelevant. |
| Program vs implementation | p. 305 | A program is an abstract, purely syntactic object; an implementation is a concrete system with causal dynamics. Only the second is a candidate for mind. |
| Simulation vs replication | p. 306 | A simulation of X is an X exactly when being an X is an organizational invariant. |
| Symbolic computation | p. 307 | Manipulation of high-level conceptual representations; a narrow subclass of computation, wrongly identified with computation as such by some objectors. |

## Leading propositions

- A nonreductive view of consciousness leaves the question of machine consciousness open; computers are on the face of it no worse placed than brains (p. 293).
- Strong AI is true: some computations are such that implementing them is naturally sufficient for mind and for rich experience like ours (pp. 293-294).
- The claim does not rest on the panpsychist suggestions of ch08 (p. 294).
- Most of the work was done in ch07; what remains is the link between computation and functional organization (p. 294).
- An objective account of implementation can be given: a system implements a CSA when its states decompose into substates that map onto the CSA's, and its causal transitions reliably mirror the formal ones (pp. 296-297).
- Implementation is not vacuous: every system implements some trivial computations and most implement several, but very few systems implement any given complex CSA (p. 298).
- Realising a functional organization and implementing the corresponding CSA come to almost exactly the same thing (p. 299).
- Computational description is a formal description of causal organization, which is why computation is so widely used in cognitive science (p. 299).
- Therefore any system implementing the CSA abstracted from a conscious system has experiences indistinguishable from that system's (p. 299).
- A computer running a neuron-by-neuron simulation has real causal dynamics among its circuits that mirror those among neurons (p. 300).
- Caveat: the argument assumes the brain's organization has a finite description; the secure conclusion is conditional on cognitive dynamics being computable (p. 300).
- The Chinese room argument is at root about consciousness, and can be assessed with intentionality factored out (p. 301).
- The system in the Chinese room is conscious: a spectrum of cases connects it to a Chinese speaker's brain, and the fading and dancing qualia arguments apply along it (pp. 302-303).
- The slips of paper are a concrete dynamical system; the demon is a causal facilitator whose consciousness is irrelevant (pp. 303-304).
- Programs are syntactic; implementations are not, and it is implementations that have semantic content (p. 305).
- Simulation is replication for organizational invariants and only for those; phenomenal properties are organizational invariants, hurricanes, digestion and heat are not (pp. 306-307).
- The external objections carry little force: physical law is computable as currently understood, human Gödelian insight is unproven, and noise makes unlimited precision unavailable to brains (pp. 307-309).
- Which computations suffice is open; the class is not empty (p. 310).

## Arguments

**A. The issue is open on a nonreductive view (p. 293)**

- **Premises**: (p. 293) Whether consciousness is constituted by or merely arises from the physical is one question; which systems give rise to it is another. (p. 293) It is not obvious that computation gives rise to consciousness, but neither is it obvious that neural processes do. (p. 293) We already accept the surprising fact about brains.
- **Unstated premise**: that nothing we know about why brains are conscious favours their biochemistry over their organization.
- **Conclusion**: (p. 293) A nonreductive view does not by itself favour the internal objections.

**B. Implementation is objective (pp. 295-298)**

- **Premises**: (pp. 296-297) Definition: a physical system implements a CSA if there is a decomposition of its states into substates, a mapping of these onto the CSA's substates, and for every transition rule, being in the mapped physical state with the mapped input reliably causes the mapped next state and output. (p. 297) Each substate must supervene on a separate region of the system. (p. 298) For a complex CSA the chance that an arbitrary set of physical states has the required causal relations is minute; he gives a figure for a thousand-element, ten-valued CSA and refers to arguments along the lines of ch07.
- **Unstated premises**: that reliable causation here has counterfactual force covering every transition rule, including states the system never enters (the definition quantifies over every rule, p. 297, but the modal strength is spelled out only in note 2); that there is a principled way to say which decompositions into regions are admissible.
- **Conclusion**: (p. 298) For any given computation there is a fact of the matter whether a system implements it, and only a limited class of systems do. Searle's observer-relativity holds only in the harmless sense that a system implements several computations.
- Endnotes: section drawn from Chalmers 1994a (p. 369). Putnam's 1988 argument that every open system implements every finite automaton is said to work only by letting the transition conditionals lack strong modal force (p. 369).
- He grants that the definition can be tightened or loosened and is not fixed (p. 297).

**C. The main argument for strong AI (pp. 298-300)**

- **Premises**: (p. 299) Organizational invariance: same fine-grained functional organization, same experiences (from ch07). (p. 299) Any functional organization can be abstracted into a CSA, with a vector element per component and transition rules for the dependency relations. (p. 299) That CSA is implemented whenever the organization is realised, and anything implementing it realises the organization. (p. 299) For the brain: a vector element per neuron, substates for the relevant range of each neuron's states.
- **Unstated premises**: that the brain's consciousness-relevant organization is at a grain with finitely many components and finitely many relevant states each (made explicit as the caveat, p. 300); that the small differences he notes between realising an organization and implementing a CSA, such as the treatment of inputs and outputs (p. 299), make no difference to experience; that implementation of the CSA in a conventional computer, where one processor mediates all the transitions, still counts as the same fine-grained organization.
- **Conclusion**: (p. 299) Any system implementing that CSA has experiences qualitatively indistinguishable from the original's. Strong AI follows.
- Hedged restatement: if cognitive dynamics are computable, the right computational organization gives rise to consciousness (p. 300).

**D. The direct argument (p. 300)**

- **Premises**: (p. 300) Between any two implementations of a CSA there is a spectrum of cases in which components are replaced one at a time with the causal pattern preserved. (p. 300) If one end is conscious and the other not, some intermediate has fading qualia; if the other end differs in experience, a switchable intermediate has dancing qualia. (p. 300) Both are implausible for the reasons given in ch07.
- **Unstated premise**: that a component-by-component spectrum exists between any two implementations, including ones with very different physical architecture.
- **Conclusion**: (p. 300) The second system has experiences indistinguishable from the first.

**E. Reply to the Chinese room (pp. 301-305)**

- **Searle's argument as Chalmers states it**: (pp. 301-302) Any program can be carried out by hand by a monolingual English speaker with slips of paper, even connected to a robot body. The person does not understand Chinese or have a sensation of red. So implementing a program does not suffice for those experiences.
- **Reframing**: (p. 301) Searle's conclusions are (1) no program suffices for consciousness and (2) none suffices for intentionality. Refuting (1) defeats the argument; replies aimed only at (2), such as Fodor's, Rey's, Boden's and Thagard's, leave the worry in place. Note 4: Korb and Newton make related points (p. 369).
- **Premises of the reply**: (p. 302) Take the program to be the CSA of a Chinese speaker's neuron-level organization. (p. 302) Replace neurons one by one with tiny demons that duplicate each neuron's input-output function. (pp. 302-303) Then merge demons, each keeping the states of its neurons on slips of paper, until one demon updates billions of slips. (p. 303) Throughout, functional organization is preserved: causal relations among neurons are mirrored by those among demons and then among slips, mediated by the demon but causal all the same. (p. 303) Fading and dancing qualia arguments apply to this spectrum.
- **Unstated premises**: that the merging steps preserve fine-grained functional organization in the sense ch07's arguments need, although they change a parallel system of independent parts into one whose every transition passes through a single agent; that a slip of paper updated by a demon stands to its neighbours in the same kind of causal relation, for these purposes, as a neuron to its neighbours; that the room as Searle describes it (one rule book, any program) is the same case as the end of this spectrum (a neuron-level CSA with one slip per element).
- **Conclusion**: (p. 303) The final system, which is a copy of the Chinese room, has the experiences of the original speaker. The system reply is given a positive ground and the impasse (p. 302) is broken.
- **Further claims**: (p. 304) The demon's own consciousness is irrelevant; a look-up table could do its job. (p. 304) In the memorising version there are two mental systems in one physical space, the second realised in the causal relations among locations in the demon's memory. (p. 305) The neuron-level case is only the thin end of the wedge: once one program can yield a mind when run this way, Searle's in-principle argument is gone.
- Endnotes: Hofstadter 1981 gives a similar spectrum (p. 369); the demon-in-the-skull picture comes from Haugeland 1980 (p. 369).

**F. Reply to the syntax-semantics argument (pp. 305-306)**

- **Searle's argument (1984)**: programs are syntactic; syntax is not sufficient for semantics; minds have semantics; so implementing a program is insufficient for a mind (p. 305).
- **Premises of the reply**: (p. 305) Programs are abstract and syntactic; implementations are concrete systems with causal dynamics and are not purely syntactic. (p. 305) Any sense of syntax in which implementations are syntactic is not one in which the second premise is plausible. (p. 305) Parody: recipes are syntactic, syntax is insufficient for crumbliness, cakes are crumbly, so implementing a recipe is insufficient for a cake.
- **Unstated premise**: that causal dynamics of the right organization suffice for semantic content. The chapter's argument concerns experience only, with intentionality set aside (p. 301).
- **Conclusion**: (pp. 305-306) The argument equivocates between a program and its implementations; it is implementations that give rise to minds.

**G. Reply to the simulation objection (pp. 306-307)**

- **Premises**: (p. 306) For some properties simulation is replication: a simulated causal loop is a causal loop. (p. 306) A simulation captures abstract causal organization and reproduces it in any implementation, so it reproduces exactly the organizational invariants. (p. 306) Being a hurricane, digestion and heat depend on velocity, composition and the like, so they are not organizational invariants. (p. 306) Phenomenal properties are organizational invariants (ch07).
- **Conclusion**: (pp. 306-307) A suitable simulation of a system with phenomenal properties has phenomenal properties.
- The criterion settles the objection only if the ch07 result is granted; the objector's position is that consciousness is like digestion (my comment).

**H. Replies to external objections (pp. 307-309)**

- **General**: (pp. 292, 307) The laws of physics as currently understood are computable and behaviour follows from physical law, so behaviour can be simulated.
- **Rule following**: (p. 307) Mechanical rules at the neural level do not prevent flexibility at the macroscopic level; the objection confuses computation with symbolic computation. Note 7: Dreyfus later conceded that connectionist systems escape it (p. 369).
- **Gödel**: (p. 308) We can see only that if a system is consistent its Gödel sentence is true; there is no reason to think we can determine the consistency of arbitrary systems, least of all one simulating our own brain. Note 8: the reply is credited to Putnam 1960; Penrose's rejoinder assumes an axiom-plus-rules system, which a neural simulation need not be (pp. 369-370).
- **Uncomputable physics**: (p. 308) Penrose's only evidence is the Gödelian argument; nothing in physical theory supports it.
- **Continuity**: (p. 309) Background noise in biological systems washes out precision beyond some level, so approximating to that level does as well as the system itself; the simulation may behave differently on an occasion but has the same behavioural capacities. A system of unlimited precision could exceed any discrete system, but noise rules that out for biology. Note 9 recommends simulating the noise distribution too (p. 370).
- **Unstated premise** (continuity): that matching behavioural capacities up to noise is enough for the simulation to share the fine-grained functional organization that argument C needs. The reply is given as an answer to an external objection, that is, about behaviour.
- **Conclusion**: (p. 309) There are no in-principle barriers to the ambitions of AI.

**Position versus argument.** What he holds: implementing the right computation suffices for a mind and for rich experience (pp. 293-294). What the arguments support: sufficiency for experience, given ch07 and given a finite description of the brain (pp. 299-300). The step from experience to mind in the fuller sense, including intentionality, is set aside (p. 301) and then asserted in passing (p. 305).

## Evidence offered

- **Imported result**: the principle of organizational invariance and the fading and dancing qualia arguments of ch07 (pp. 294, 299, 300, 303, 306). Nothing in ch09 re-argues them.
- **Formal construction**: the CSA formalism and the implementation definition (pp. 295-297); translation of a Turing machine into a CSA with one vector element for the head and one per tape square (p. 297). The extracted text of the formal definition has garbled sub- and superscripts on p. 297, so it is paraphrased here, not quoted.
- **Numerical estimate**: the improbability of an arbitrary system implementing a thousand-element CSA (p. 298). It is asserted by reference to ch07, not derived here.
- **Worked example**: neuron-by-neuron CSA of the brain; memory locations realised as voltages whose causal patterns mirror those among neurons (pp. 299-300).
- **Thought experiments**: Searle's Chinese room with robot body (pp. 301-302); the demon spectrum from brain to room (pp. 302-303); the memorising demon with a supermemory module (p. 304); the hurricane implemented slowly among billiard balls and the digestive system with metal parts (p. 306); the analog quantity encoding the halting problem (p. 309).
- **Parody argument**: recipes and cakes (p. 305).
- **Cited opponents**: Searle 1980, 1984, 1990b; Harnad 1989; Dreyfus 1972; Lucas 1961; Penrose 1989, 1994; Putnam 1988 in note 2 (p. 369).
- **Cited support**: his own papers (Chalmers 1994a, 1994b, 1995a, 1995c: pp. 308, 369); Hofstadter on levels (p. 307).
- **Confident language outrunning argument (my comment)**: implementation can straightforwardly be given (p. 295); a perfectly objective criterion (p. 298); the defence of strong AI is straightforward (p. 299); there is every reason to believe physical law is computable (p. 307). The computability of physical law is assumed, not argued.

## Quotes

- "On the face of it, there is no clear reason why computers should be any worse off than brains in this regard." (p. 293)
- "there is a nonempty class of computations such that the implementation of any computation in that class is sufficient for a mind" (p. 293)
- "This sufficiency holds only with natural necessity, of course: it is logically possible that any computation might take place in the absence of consciousness." (p. 293)
- "a physical system implements a computation when the causal structure of the system mirrors the formal structure of the computation" (p. 296)
- "The notion of a CSA is effectively a direct formalization of this notion." (p. 299)
- "if cognitive dynamics are computable, then the right sort of computational organization will give rise to consciousness" (p. 300)
- "The demon simply acts as a kind of causal facilitator." (p. 304)
- "The brain simulation program merely serves as the thin end of the wedge." (p. 305)
- "It is the program that is syntactic; it is the implementation that has semantic content." (p. 305)
- "A simulation of X is an X precisely when the property of being an X is an organizational invariant." (p. 306)
- "a close approximation is as good as the real thing" (p. 309)
- "the AI thesis is so plausible precisely because the class of computational systems is so wide" (p. 310)

## Tensions / links to other chapters

- **Depends on ch07, entirely.** He says most of the work was done there (p. 294). Arguments C, D, E and G each use organizational invariance or the fading and dancing qualia arguments as a premise. If ch07's arguments fail, ch09 keeps only the implementation account and the replies to external objections.
- **Depends on ch04 for the modality.** Sufficiency is natural, not logical; a computation could logically occur without consciousness, as could a brain (p. 293). So strong AI here is a claim about psychophysical law, not the functionalist claim that mind is computation. This is a different thesis from the one Searle attacked under the same name (my observation); note 10 says what matters for AI is that some formal system's implementation suffices for mentality (p. 370).
- **Disclaims ch08.** The conclusion is said not to rest on the panpsychist suggestions of the previous chapter, and to concern rich experience like ours (p. 294). He also says that if Searle were right that everything implements every computation, strong AI would be empty or would imply a strong panpsychism (p. 295), and treats that as a cost. But p. 298 grants that every system implements trivial CSAs. If ch08's view is right, the nonempty class of p. 293 is very large and the interesting claim is the one about rich experience; that claim rests on ch07 alone.
- **Uses ch01's division.** Internal objections say a computer would be a silicon zombie (p. 293): psychological properties without phenomenal ones, in ch01's terms (ch01, p. 18). Recasting Searle's argument as about consciousness (p. 301) relies on ch01's treatment of intentionality as not a separate mystery (ch01, pp. 26-28).
- **Term shift: mind.** The thesis is stated for mind and for experience (p. 293); intentionality is then factored out (p. 301); the reply to the syntax argument nonetheless asserts that implementations have semantic content and that intentionality arises from causal heft (p. 305). No argument for the claim about content is given in this chapter (my observation).
- **Term shift: program, computation, implementation.** Searle's premise that programs are syntactic is granted for programs as abstract objects (p. 305). The strong AI thesis was always about implementations (p. 293). Whether Searle's room is an implementation in the technical sense of pp. 296-297 is assumed when the room is matched to the end of the demon spectrum (p. 303).
- **Internal tension (my observation).** The separate-region stipulation (p. 297) is added to ensure that the causal organization relates distinct components. In the memorising version the components are locations in the demon's supermemory (p. 304). Whether those are separate regions with their own reliable causal relations, or one agent's recall, is not examined.
- **Internal tension (my observation).** The remark that a look-up table could do the demon's job (p. 304) concerns the local update rule only. It should not be read as allowing a look-up table to replace the whole system; the implementation definition requires interaction among separate parts (p. 297).
- **Internal tension (my observation).** The continuity reply secures the same behavioural capacities (p. 309). The main argument needs the same fine-grained functional organization (p. 299). A discretised approximation that differs from the brain's actual state transitions at the noise level is behaviourally equivalent in distribution; whether it is organizationally the same at the grain that fixes experience is not addressed, and the caveat on p. 300 leaves the thesis conditional.
- **Link to ch10.** The chapter closes the applications on AI; ch10 opens on quantum mechanics (p. 310). No dependency runs from ch09 to ch10 in the text read.

## Open questions

- At what grain must organization be preserved? The argument uses the neuron level as an example (p. 299) and says coarser or wholly different computations may also suffice (pp. 309-310). What in the theory would decide this?
- Since a system implements many CSAs (p. 298), which of the computations a brain implements is the one whose implementation suffices for its experience? Does a system that implements that CSA and others have further experiences?
- Does the demon-merging step (pp. 302-303) fall under the ch07 arguments as stated there, which concern replacing parts while holding organization fixed? Check ch07's definition of fine-grained functional organization and whether a shared mediator changes it.
- How strong must reliable causation be (p. 297)? Note 2 says the answer to Putnam turns on modal force (p. 369); the details are in papers outside the book.
- Is there an independent test for whether a property is an organizational invariant (p. 306), other than running a replacement thought experiment and consulting intuition?
- The Gödel reply is brief and defers to a separate paper (p. 308). The claim that we cannot determine our own system's consistency is offered as possible, not shown.
- Is the computability of physical law (pp. 292, 307) needed for the main thesis, or only for the replies to external objections? On p. 300 it appears as the antecedent of the hedged conclusion.
- If sufficiency is only natural (p. 293), what evidence could confirm it for a machine, given that the first-person data of fm01 (p. 6) are unavailable for systems other than oneself?
