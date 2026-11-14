# U02 Skill Decomposition Proposal

## 1. Document status

- **Status:** APPROVED — PROVISIONAL skill decomposition — documentation only
- **Unit:** U02 — المتتاليات العددية
- **Scope:** U02 only
- **Topic provenance:** `user_supplied_provisional`
- **Skill provenance:** `proposed_inferred_from_user_supplied_provisional`
- **Official verification:** OPEN — not independently verified as an official syllabus
- **Arabic titles:** PROVISIONAL — pending curriculum terminology review
- **U02 skill decomposition:** APPROVED — PROVISIONAL — owner-approved as a provisional decomposition, not final or officially verified
- **Database seeding:** NOT AUTHORIZED
- **Skill prerequisite edges:** NOT CREATED in the database
- **U01, U03 and later units:** NOT MODIFIED

This document records the approved provisional decomposition of U02 into 20 skills. It does not create skills, seed data, database rows, prerequisite edges, APIs, grading logic, or exercises.

## 2. Sources and scope

Source documents:

- `docs/curriculum/Tutorly_provisional_curriculum_inventory.md`
- `docs/curriculum/Tutorly_provisional_curriculum_review.md`

Included topics:

- `SEQ_BASICS`
- `SEQ_INDUCTION`
- `SEQ_CONVERGENCE`
- `SEQ_RECURSIVE`
- `SEQ_APPLICATIONS`

Excluded:

- U01, U03–U11.
- Official Arabic curriculum wording.
- Database seeds and migration changes.
- Exercise, grading, and mastery implementation.
- Series, power series, recurrence-solving methods, and financial mathematics beyond the supplied U02 content.

## 3. Status and decision boundary

The five U02 topics are part of the owner-accepted provisional curriculum baseline. They are not officially verified syllabus content.

This document is an **APPROVED — PROVISIONAL** skill decomposition. The owner has approved the 20 U02 skill codes, titles, descriptions, and prerequisite relationships as a provisional decomposition. This approval does not confirm official curriculum content, does not resolve the OPEN items, and does not authorize database seeding or prerequisite rows.

The only direct curriculum provenance in this document is the topic-level provenance `user_supplied_provisional`. Skill boundaries and prerequisites are educational decomposition and are marked as inferred. No prerequisite is presented as a direct statement from the supplied curriculum.

## 4. Status conventions

### 4.1 Provenance

Topic provenance:

`user_supplied_provisional`

Skill provenance:

`proposed_inferred_from_user_supplied_provisional`

The distinction is intentional: the topics and their coverage are user-supplied, while the skill boundaries, descriptions, outcomes, difficulty labels, and prerequisite relationships are proposed by this decomposition.

### 4.2 Basis labels

| Label | Meaning |
|---|---|
| `D` | Directly represented in the user-supplied U02 topic content |
| `I` | Educational interpretation required to make the ability observable and assessable |
| `D/I` | User-supplied ability with an interpretive formulation or method |

### 4.3 Prerequisite classifications

| Classification | Meaning | Database treatment |
|---|---|---|
| Hard prerequisite | The student must demonstrate the prerequisite ability to perform the dependent skill as defined | Candidate for a future reviewed `skill_prerequisites` edge; not created in this task |
| Conditional prerequisite | Needed only when the exercise does not supply the required result or data | Documentation only; must not be represented as a database prerequisite edge |
| May be supplied | The exercise may provide terms, general terms, sums, monotonicity, boundedness, limits, graphical data, or a model | Not a prerequisite |

No prerequisite edge of either kind is created by this document.

### 4.4 Difficulty labels

Difficulty labels are `beginner`, `intermediate`, or `advanced`. They are proposed pedagogical judgments and are not mapped to the provisional numeric database scale in this document.

## 5. Skill design rules

Each skill:

- has a stable code;
- represents one specific observable ability;
- is independently assessable;
- is small enough for separate mastery evidence;
- uses one primary action verb;
- does not combine unrelated abilities;
- belongs to exactly one U02 topic;
- has a proposed difficulty label;
- has the required provenance.

The topic association is the section heading. No skill belongs to more than one topic.

## 6. Proposed skill decomposition

### 6.1 `SEQ_BASICS` — 7 skills

| Code | Arabic title proposal | English title | Mathematical description | Assessable outcome | Difficulty | Hard prerequisite | Conditional prerequisite — documentation only | Basis and justification |
|---|---|---|---|---|---|---|---|---|
| `SEQ_BASICS_S01` | فهم ترميز المتتالية والرتب والحدود والتعريفات | Understand sequence notation, indices, terms, and definitions | Interpret sequence notation, index sets, term notation, and the distinction between a term and the sequence as a whole; determine terms from a supplied definition or list. | Given a sequence definition or list, identify indices and terms and use the notation correctly. | beginner | — | — | D — definitions and notation are user-supplied; the skill boundary is inferred. |
| `SEQ_BASICS_S02` | تعرف المتتالية الحسابية وتمييزها وتحديد أساسها | Identify and characterize arithmetic sequences and their common difference | Determine whether consecutive terms have a constant difference; identify the common difference when the sequence is arithmetic. | Classify a sequence as arithmetic or not and state its common difference when defined. | beginner | — | `SEQ_BASICS_S01` if terms or notation are not supplied | D/I — arithmetic sequences are supplied; the characterization method is interpretive. |
| `SEQ_BASICS_S03` | تحديد الحد العام لمتتالية حسابية | Determine the general term of an arithmetic sequence | Determine the general term of an arithmetic sequence from supplied data, using the exercise's stated indexing convention and common difference. | Produce a correct general-term expression and evaluate a requested term. | intermediate | — | `SEQ_BASICS_S02` if the arithmetic characterization or common difference is not supplied | D/I — general terms are supplied; the assessment formulation is interpretive. |
| `SEQ_BASICS_S04` | حساب المجاميع المنتهية لمتتالية حسابية | Calculate finite sums of arithmetic sequences | Calculate a finite sum of an arithmetic sequence under the exercise's indexing convention, including counting the number of terms consistently with the stated index range and indexing convention. | Compute the requested finite sum and justify the formula and term count. | intermediate | — | `SEQ_BASICS_S02` or `SEQ_BASICS_S03` if the common difference or general term is not supplied | D/I — finite sums are supplied; the formula and term-count conventions are interpretive. |
| `SEQ_BASICS_S05` | تعرف المتتالية الهندسية وتمييزها وتحديد نسبتها | Identify and characterize geometric sequences and their common ratio | Determine whether a sequence satisfies the constant-ratio characterization `u(n + 1) = q * u(n)` for a constant `q`; when using the ratio form, divide only by a defined nonzero term. | Classify a sequence as geometric or not using the constant-ratio characterization or a valid ratio test, and state its common ratio when defined. | beginner | — | `SEQ_BASICS_S01` if terms or notation are not supplied | D/I — geometric sequences are supplied; the constant-ratio characterization and valid division conditions are interpretive. |
| `SEQ_BASICS_S06` | تحديد الحد العام لمتتالية هندسية | Determine the general term of a geometric sequence | Determine the general term of a geometric sequence from supplied data, using the exercise's stated indexing convention and common ratio. | Produce a correct general-term expression and evaluate a requested term. | intermediate | — | `SEQ_BASICS_S05` if the geometric characterization or common ratio is not supplied | D/I — general terms are supplied; the assessment formulation is interpretive. |
| `SEQ_BASICS_S07` | حساب المجاميع المنتهية لمتتالية هندسية | Calculate finite sums of geometric sequences | Calculate a finite sum of a geometric sequence under the exercise's indexing convention, including the common-ratio-one case and counting the number of terms consistently with the stated index range. | Compute the requested finite sum and justify the formula, conditions, and term count. | intermediate | — | `SEQ_BASICS_S05` or `SEQ_BASICS_S06` if the common ratio or general term is not supplied | D/I — finite sums are supplied; the formula and conditions are interpretive. |

### 6.2 `SEQ_INDUCTION` — 1 skill

| Code | Arabic title proposal | English title | Mathematical description | Assessable outcome | Difficulty | Hard prerequisite | Conditional prerequisite — documentation only | Basis and justification |
|---|---|---|---|---|---|---|---|---|
| `SEQ_INDUCTION_S01` | البرهان بالتراجع مع الحالة الابتدائية وفرضية التراجع وخطوة التراجع والاستنتاج | Prove a property by mathematical induction, including the initial case, induction hypothesis, induction step, and conclusion | Prove a proposition supplied by the exercise by mathematical induction for the relevant index set, establishing the initial case, stating the induction hypothesis, proving the induction step, and concluding. | Write a complete proof of the supplied proposition with all required components and correct quantification. | advanced | — | `SEQ_BASICS_S01` if sequence notation is needed and not supplied | D/I — induction is supplied; the exercise supplies the proposition, and the proof assessment is interpretive. |

### 6.3 `SEQ_CONVERGENCE` — 6 skills

| Code | Arabic title proposal | English title | Mathematical description | Assessable outcome | Difficulty | Hard prerequisite | Conditional prerequisite — documentation only | Basis and justification |
|---|---|---|---|---|---|---|---|---|
| `SEQ_CONVERGENCE_S01` | تحديد رتابة متتالية | Determine whether a sequence is increasing, decreasing, or constant | Determine whether a sequence is increasing, decreasing, constant, or none of these by comparing consecutive terms or by using supplied monotonicity data. | Classify the monotonic behavior with a valid comparison or justification. | intermediate | — | `SEQ_BASICS_S01` if terms or notation are not supplied | D/I — monotonicity is supplied; the classification method is interpretive. |
| `SEQ_CONVERGENCE_S02` | تحديد ما إذا كانت المتتالية محدودة | Establish whether a sequence is bounded | Establish whether a sequence is bounded above, bounded below, or bounded; do not infer boundedness from monotonicity or monotonicity from boundedness. | State and justify upper or lower bounds, or show unboundedness in supported cases. | intermediate | — | `SEQ_BASICS_S01` if terms or notation are not supplied | D/I — boundedness is supplied; the assessment formulation is interpretive. |
| `SEQ_CONVERGENCE_S03` | تطبيق مبرهنة التقارب للمتتاليات الرتيبة والمحدودة | Apply the monotone-bounded convergence theorem | Apply the monotone-bounded convergence theorem under its exact hypotheses: increasing and bounded above, or decreasing and bounded below. | Identify whether the hypotheses hold and conclude convergence only when they do; do not claim the limit value from the theorem alone. | advanced | — | `SEQ_CONVERGENCE_S01` and `SEQ_CONVERGENCE_S02` if monotonicity or boundedness is not supplied | D — the theorem is user-supplied; the application boundary is inferred. |
| `SEQ_CONVERGENCE_S04` | تحديد النهايات وتفسير التقارب | Determine and interpret limits and convergence of sequences | Determine limits of sequences in supported cases and interpret convergence or divergence, distinguishing a candidate limit from a proof of convergence. | Compute or otherwise determine the limit when supported, and state the convergence or divergence conclusion with justification. | advanced | — | `SEQ_BASICS_S03` or `SEQ_BASICS_S06` if a general term is not supplied; `SEQ_RECURSIVE_S02` if a recursive definition must be interpreted; `SEQ_CONVERGENCE_S03` if convergence must be established first | D/I — limits and convergence are supplied; the distinction between limit calculation and proof is an assessment interpretation. |
| `SEQ_CONVERGENCE_S05` | تطبيق نتائج المقارنة على المتتاليات ونهاياتها | Apply comparison results concerning sequences and their limits | Apply the comparison results supplied for sequences and their limits, respecting the theorem's stated hypotheses; do not assume a specific comparison or squeeze theorem unless it is supplied. | Use a valid comparison result to justify a bound, convergence, or limit in a supported case. | advanced | — | `SEQ_CONVERGENCE_S02` if boundedness data are not supplied; `SEQ_CONVERGENCE_S04` if a comparison limit is not supplied | D/I — comparison is supplied; the exact theorem and hypotheses remain OPEN. |
| `SEQ_CONVERGENCE_S06` | استعمال المتتاليات المتجاورة لإثبات التقارب وتحديد النهاية المشتركة | Use adjacent sequences to establish convergence and identify their common limit | Use adjacent sequences under the standard sufficient conditions (one sequence increasing, one decreasing, appropriate ordering, and difference tending to zero) to establish convergence and identify the common limit; the exact curriculum scope remains OPEN. | Verify the stated adjacent-sequence conditions, conclude convergence, and identify the common limit. | advanced | — | `SEQ_CONVERGENCE_S01` or `SEQ_CONVERGENCE_S04` if monotonicity or the common limit is not supplied | D/I — adjacent sequences are supplied; the standard sufficient formulation is interpretive and the exact curriculum scope remains OPEN. |

### 6.4 `SEQ_RECURSIVE` — 4 skills

| Code | Arabic title proposal | English title | Mathematical description | Assessable outcome | Difficulty | Hard prerequisite | Conditional prerequisite — documentation only | Basis and justification |
|---|---|---|---|---|---|---|---|---|
| `SEQ_RECURSIVE_S01` | حساب حدود متتالية معرّفة بعلاقة تراجعية | Calculate terms from a recursively defined sequence | Execute a supplied recursive definition by substituting successive indices and the stated initial value or values to calculate requested terms; this skill does not assess explaining the structure of the definition beyond what is needed to execute it. | Produce the requested terms correctly from the supplied initial value or values and recurrence relation, showing the substitution steps. | beginner | — | `SEQ_BASICS_S01` if notation is not supplied; `SEQ_RECURSIVE_S02` if the supplied definition must first be interpreted | D — recursive definitions are supplied; the term-calculation boundary is inferred. |
| `SEQ_RECURSIVE_S02` | تفسير تعريف تراجعي بما فيه القيمة الابتدائية وعلاقة التراجع | Interpret a recursive definition, including its initial value and recurrence relation | Interpret the structure and meaning of a recursive definition by identifying the initial value or values, the recurrence relation, the index domain, and the sequence it determines; distinguish the definition from a closed form without requiring the calculation of a long list of terms. | Explain the role of the initial value or values, the recurrence relation, and the index domain, and identify the data needed to generate the sequence. | intermediate | — | `SEQ_BASICS_S01` if notation is not supplied | D/I — recursive definitions are supplied; interpretation is an educational formulation. |
| `SEQ_RECURSIVE_S03` | بناء واستعمال متتاليات مساعدة | Construct and use auxiliary sequences when studying a sequence | Construct and use an auxiliary sequence when the exercise or source indicates one, using it to study a requested property; the specific auxiliary transformation is not fixed by this document. | Define a valid auxiliary sequence and use it to establish the requested property under the supplied guidance. | advanced | — | `SEQ_RECURSIVE_S02` if the recursive definition must be interpreted; `SEQ_CONVERGENCE_S01` or `SEQ_CONVERGENCE_S04` if the target property is not supplied | D/I — auxiliary sequences are supplied; the specific construction is OPEN. |
| `SEQ_RECURSIVE_S04` | تفسير متتالية تراجعية بيانياً | Interpret recursively defined sequences graphically | Interpret a supplied graphical representation of a recursively defined sequence and relate successive terms to the recurrence; do not assume a specific construction method unless it is supplied. | Read and explain the sequence behavior from the supplied graph or diagram. | advanced | — | `SEQ_BASICS_S01` if notation is not supplied; `SEQ_RECURSIVE_S02` if the recurrence must be interpreted | D/I — graphical interpretation is supplied; the graphical method is OPEN. |

### 6.5 `SEQ_APPLICATIONS` — 2 skills

| Code | Arabic title proposal | English title | Mathematical description | Assessable outcome | Difficulty | Hard prerequisite | Conditional prerequisite — documentation only | Basis and justification |
|---|---|---|---|---|---|---|---|---|
| `SEQ_APPLICATIONS_S01` | ترجمة وضعية نمو أو استثمار إلى نموذج متتالية | Translate a growth or investment situation into a sequence model | Translate a supplied growth or investment situation into a sequence model by identifying the initial value, the rule linking successive terms, and the meaning of the terms; use arithmetic or geometric structure only when justified by the situation. | Define a sequence model and explain what each component represents. | intermediate | — | `SEQ_BASICS_S01` if notation is not supplied; `SEQ_BASICS_S02` or `SEQ_BASICS_S05` if the arithmetic or geometric classification is not supplied; `SEQ_RECURSIVE_S02` if a recursive model must be interpreted | D/I — applications are supplied; the modelling formulation is interpretive. |
| `SEQ_APPLICATIONS_S02` | حل مسائل النمو والاستثمار باستعمال خصائص المتتاليات أو حدودها أو مجاميعها | Solve growth and investment problems using sequence properties, terms, or sums | Solve a supplied growth or investment problem using sequence terms, finite sums, or sequence properties; do not introduce financial formulas or models beyond the supplied situation. | Compute the requested term or sum, interpret it in context, and state the assumptions used. | advanced | — | `SEQ_APPLICATIONS_S01` if the model is not supplied; `SEQ_BASICS_S03`, `SEQ_BASICS_S04`, `SEQ_BASICS_S06`, or `SEQ_BASICS_S07` if the relevant general term or sum is not supplied | D/I — applications are supplied; the solution method is interpretive. |

## 7. Topic-to-skill mapping

| Topic | Skill codes | Count |
|---|---|---|
| `SEQ_BASICS` | `SEQ_BASICS_S01`–`SEQ_BASICS_S07` | 7 |
| `SEQ_INDUCTION` | `SEQ_INDUCTION_S01` | 1 |
| `SEQ_CONVERGENCE` | `SEQ_CONVERGENCE_S01`–`SEQ_CONVERGENCE_S06` | 6 |
| `SEQ_RECURSIVE` | `SEQ_RECURSIVE_S01`–`SEQ_RECURSIVE_S04` | 4 |
| `SEQ_APPLICATIONS` | `SEQ_APPLICATIONS_S01`–`SEQ_APPLICATIONS_S02` | 2 |

**Total:** 20 skills.

No skill belongs to more than one topic. No skill is assigned to U01, U03–U11, or the conditional U02 topics that do not exist in the supplied baseline.

## 8. Prerequisite graph

### 8.1 Hard prerequisites

No hard prerequisite edges are proposed. The former sequence-notation dependencies are conditional guidance only, because an exercise may supply the sequence terms directly and allow arithmetic or geometric classification without prior mastery of sequence notation as a separate skill.

### 8.2 Conditional prerequisites — documentation only

Conditional prerequisites are listed in the skill tables. They are not database edges and must not be seeded into `skill_prerequisites`.

The conditional dependency groups are:

- `SEQ_BASICS_S01` → `SEQ_BASICS_S02`
- `SEQ_BASICS_S02` → `SEQ_BASICS_S03`
- `SEQ_BASICS_S02` or `SEQ_BASICS_S03` → `SEQ_BASICS_S04`
- `SEQ_BASICS_S01` → `SEQ_BASICS_S05`
- `SEQ_BASICS_S05` → `SEQ_BASICS_S06`
- `SEQ_BASICS_S05` or `SEQ_BASICS_S06` → `SEQ_BASICS_S07`
- `SEQ_BASICS_S01` → `SEQ_INDUCTION_S01`
- `SEQ_BASICS_S01` → `SEQ_CONVERGENCE_S01`
- `SEQ_BASICS_S01` → `SEQ_CONVERGENCE_S02`
- `SEQ_CONVERGENCE_S01` and `SEQ_CONVERGENCE_S02` → `SEQ_CONVERGENCE_S03`
- `SEQ_BASICS_S03` or `SEQ_BASICS_S06` → `SEQ_CONVERGENCE_S04`
- `SEQ_RECURSIVE_S02` → `SEQ_CONVERGENCE_S04`
- `SEQ_CONVERGENCE_S03` → `SEQ_CONVERGENCE_S04`
- `SEQ_CONVERGENCE_S02` → `SEQ_CONVERGENCE_S05`
- `SEQ_CONVERGENCE_S04` → `SEQ_CONVERGENCE_S05`
- `SEQ_CONVERGENCE_S01` or `SEQ_CONVERGENCE_S04` → `SEQ_CONVERGENCE_S06`
- `SEQ_BASICS_S01` or `SEQ_RECURSIVE_S02` → `SEQ_RECURSIVE_S01`
- `SEQ_BASICS_S01` → `SEQ_RECURSIVE_S02`
- `SEQ_RECURSIVE_S02` → `SEQ_RECURSIVE_S03`
- `SEQ_CONVERGENCE_S01` or `SEQ_CONVERGENCE_S04` → `SEQ_RECURSIVE_S03`
- `SEQ_BASICS_S01` → `SEQ_RECURSIVE_S04`
- `SEQ_RECURSIVE_S02` → `SEQ_RECURSIVE_S04`
- `SEQ_BASICS_S01` → `SEQ_APPLICATIONS_S01`
- `SEQ_BASICS_S02` or `SEQ_BASICS_S05` → `SEQ_APPLICATIONS_S01`
- `SEQ_RECURSIVE_S02` → `SEQ_APPLICATIONS_S01`
- `SEQ_APPLICATIONS_S01` → `SEQ_APPLICATIONS_S02`
- `SEQ_BASICS_S03`, `SEQ_BASICS_S04`, `SEQ_BASICS_S06`, or `SEQ_BASICS_S07` → `SEQ_APPLICATIONS_S02`

An “or” dependency means the exercise may supply one of the alternatives; it does not create multiple hard prerequisites.

### 8.3 Graph verification rules

- The hard graph contains zero edges and is acyclic.
- The conditional graph contains 38 documented guidance references, uses only forward dependencies, and is acyclic.
- Conditional prerequisite information in Section 6 agrees with Section 8.2.
- Every listed prerequisite reference points to an existing proposed skill.
- No skill references itself.
- No cross-unit prerequisite is proposed.

## 9. Composite assessments

A multi-step sequence study that combines monotonicity, boundedness, and convergence is a composite assessment, not a single mastery skill. Evidence must be attributed to the component skills actually assessed.

The following are not separate mastery skills in this proposal:

- a complete sequence study combining several `SEQ_CONVERGENCE` skills;
- an induction proof whose proposition additionally requires independently deriving an unsupplied general term or finite sum;
- a multi-step growth or investment problem combining modelling and several calculation skills.

Composite exercises must not update a single “complete sequence study” mastery skill. No composite skill code is created by this document.

## 10. Mathematical review notes

### 10.1 Indexing conventions

The supplied curriculum does not settle a global `u_0` versus `u_1` convention. This document imposes neither convention. Every exercise must state its indexing convention, and all general-term and finite-sum work must follow that convention consistently.

For review only, the convention-dependent formulas are:

- Arithmetic sequence: `u_n = u_0 + n r` when indices start at `0`; `u_n = u_1 + (n - 1) r` when indices start at `1`.
- Arithmetic finite sum: `u_0 + ... + u_n = (n + 1)(u_0 + u_n) / 2`; `u_1 + ... + u_n = n(u_1 + u_n) / 2`.
- Geometric sequence: the general characterization is `u(n + 1) = q * u(n)` for a constant `q`. When indices start at `0`, `u_n = u_0 q^n`; when indices start at `1`, `u_n = u_1 q^(n - 1)`.
- Geometric finite sum: for `q != 1`, `u_0 + ... + u_n = u_0(1 - q^(n + 1)) / (1 - q)`, or `u_1 + ... + u_n = u_1(1 - q^n) / (1 - q)`.
- For `q = 1`, the geometric sum is the number of terms multiplied by the repeated term; the term count must follow the exercise's indexing convention.

The ratio form `u(n + 1) / u(n) = q` is valid only when the relevant term `u(n)` is defined and nonzero. Division by zero must not be treated as a valid ratio test.

For every finite sum, the number of terms must be counted consistently with the stated index range and indexing convention. For example, a sum from index `p` to index `n` inclusive, with integer indices and `p <= n`, contains `n - p + 1` terms.

These formulas are convention checks, not additional curriculum content. The exact formula set and term-count wording remain OPEN for curriculum review.

### 10.2 Monotonicity and boundedness

Monotonicity and boundedness are independent properties. A monotone sequence need not be bounded, and a bounded sequence need not be monotone. The skills `SEQ_CONVERGENCE_S01` and `SEQ_CONVERGENCE_S02` therefore assess separate properties and must not be merged.

### 10.3 Monotone-bounded convergence theorem

The theorem requires both a monotonicity hypothesis and the corresponding boundedness hypothesis:

- increasing and bounded above; or
- decreasing and bounded below.

Monotonicity alone or boundedness alone is insufficient. The theorem establishes convergence; it does not by itself determine the limit value.

### 10.4 Limits versus convergence

Determining a candidate limit is not the same as proving convergence. A sequence may have a candidate limit obtained from an expression or recurrence while convergence still requires a theorem, a comparison argument, or adjacent sequences. `SEQ_CONVERGENCE_S04` must therefore distinguish limit determination from convergence proof.

### 10.5 Comparison results

The supplied inventory says “comparison” but does not enumerate the exact comparison theorem or its hypotheses. This document does not assume a squeeze theorem, a specific inequality direction, or eventual conditions beyond what the exercise supplies. The exact comparison scope remains OPEN.

### 10.6 Adjacent sequences

The supplied inventory names adjacent sequences but does not state their exact hypotheses. A standard sufficient formulation is: one sequence is increasing, the other is decreasing, their terms are ordered appropriately (for example, `u_n <= v_n` for the relevant indices), and their difference tends to zero. Under these conditions both sequences converge to a common limit. These conditions already supply the boundedness needed for the conclusion, so independent mastery of `SEQ_CONVERGENCE_S02` is not a separate conditional prerequisite for `SEQ_CONVERGENCE_S06`.

This is a standard sufficient formulation, not a claim that every possible curriculum formulation has been officially verified. The exact curriculum scope remains OPEN, and each exercise must state the hypotheses it intends to use.

### 10.7 Recursive sequences and graphical interpretation

A recursive definition, the calculation of its terms, and the graphical interpretation of the sequence are separate abilities in this proposal:

- `SEQ_RECURSIVE_S02` interprets the definition and explains its structure;
- `SEQ_RECURSIVE_S01` executes the definition to calculate requested terms;
- `SEQ_RECURSIVE_S04` interprets a supplied graph or diagram.

`SEQ_RECURSIVE_S02` does not require calculating a long list of terms, and `SEQ_RECURSIVE_S01` does not require explaining the definition's structure beyond what is needed to execute it. No specific graphical construction is assumed. Cobweb or staircase constructions are not prescribed unless the exercise supplies them.

### 10.8 Auxiliary sequences

The inventory names auxiliary sequences but does not prescribe a specific transformation. This document does not assume a difference sequence, a ratio sequence, a fixed-point transformation, or any other technique. The exercise or source must indicate the auxiliary sequence or the construction to use.

### 10.9 Growth and investment applications

The supplied content names growth and investment applications but does not prescribe a financial model, interest convention, or formula. This document does not introduce compound-interest, depreciation, or investment formulas beyond the sequence model supplied by the exercise.

### 10.10 Mathematical induction

`SEQ_INDUCTION_S01` assesses a proof of a proposition supplied by the exercise. The proposition may concern an arithmetic or geometric general term or finite sum, but the corresponding `SEQ_BASICS` skills are not inherent prerequisites: the exercise may supply the statement or formula to be proved. The only retained conditional guidance is `SEQ_BASICS_S01` when the supplied proposition uses sequence notation that has not been supplied. The exact induction variant remains OPEN; this proposal requires the stated initial case, hypothesis, step, and conclusion and does not require strong induction.

## 11. User-supplied content versus educational interpretation

### 11.1 Directly represented in the user-supplied U02 content

- sequence definitions and notation;
- arithmetic and geometric sequences;
- general terms and finite sums;
- mathematical induction;
- monotonicity and boundedness;
- limits and convergence;
- monotone-bounded sequence theorems;
- comparison and adjacent sequences;
- recursive sequences of the form `u(n+1) = f(u(n))`;
- auxiliary sequences;
- graphical interpretation;
- growth and investment applications.

### 11.2 Educational interpretations in this proposal

- The 20 exact skill boundaries, titles, descriptions, and outcomes.
- The hard-versus-conditional prerequisite classification.
- The absence of hard prerequisite edges; sequence-notation dependencies are conditional guidance.
- The selection of the exercise's indexing convention as an explicit requirement.
- The convention-dependent formula descriptions in Section 10.1.
- The separation of recursive-definition interpretation, term calculation, and graphical interpretation.
- The separation of limit determination from convergence proof.
- The decision not to assume a specific comparison theorem, adjacent-sequence construction, auxiliary-sequence transformation, or financial model.

### 11.3 Not added

- No new sequence types.
- No series or power-series content.
- No strong-induction requirement.
- No specific comparison or squeeze theorem beyond the supplied comparison content.
- No specific auxiliary-sequence technique.
- No specific graphical construction.
- No specific financial or interest formula.
- No U01, U03–U11 content.
- No official Arabic curriculum wording.
- No exercises, grading logic, or database records.

## 12. Unit boundaries and cross-unit notes

- Sequence limits in U02 are distinct from function limits in U01. No U01 prerequisite is proposed.
- Graphical interpretation in U02 is limited to supplied recursive-sequence graphs. U05 graphical transformations are not assumed.
- Growth and investment applications in U02 do not assume exponential or logarithmic content from U03 or U04.
- No cross-unit prerequisite is proposed.
- Potential overlaps with U01 or U05 remain OPEN and must not be silently imported into U02 mastery skills.

## 13. Arabic terminology status

- The U02 Arabic title supplied in the implementation request is `المتتاليات العددية`.
- This title is provisional and not officially verified.
- All Arabic skill titles are provisional proposals.
- Terms requiring mathematics and curriculum review include `البرهان بالتراجع`, `المتتاليات المتجاورة`, `متتالية مساعدة`, `التفسير البياني`, `أساس المتتالية الحسابية`, and `نسبة المتتالية الهندسية`.

## 14. Ambiguities and review items

| ID | Item | Status |
|---|---|---|
| A-01 | U02 Arabic title and official wording | OPEN |
| A-02 | Arabic skill titles and descriptions | PROVISIONAL |
| A-03 | Global `u_0` versus `u_1` indexing convention | OPEN; each exercise must state its convention |
| A-04 | Exact scope of “definitions” in `SEQ_BASICS_S01` | OPEN |
| A-05 | Exact arithmetic and geometric sum formula set, term-count wording, and conditions | OPEN |
| A-06 | Induction variant and exact statement form | OPEN; initial case, hypothesis, step, and conclusion are required, but strong induction is not assumed |
| A-07 | Exact comparison theorem and hypotheses in `SEQ_CONVERGENCE_S05` | OPEN; squeeze is not assumed |
| A-08 | Exact adjacent-sequence hypotheses and construction | OPEN; the standard sufficient formulation in Section 10.6 is not an official verification |
| A-09 | Specific auxiliary-sequence transformation | OPEN; no fixed technique is assumed |
| A-10 | Specific recursive graphical construction | OPEN; cobweb or staircase is not assumed |
| A-11 | Specific growth or investment model and financial formulas | OPEN; no model is assumed beyond the exercise |
| A-12 | Distinction between determining a limit and proving convergence | PROVISIONAL assessment boundary; exact grading policy OPEN |
| A-13 | Difficulty scale mapping | PROVISIONAL |
| A-14 | Final teaching order | OPEN |
| A-15 | Official curriculum verification | OPEN |
| A-16 | Cross-unit overlap with U01 or U05 | OPEN |

## 15. Provenance register

### 15.1 Topic provenance

| Topic | Topic label | Provenance | Basis |
|---|---|---|---|
| `SEQ_BASICS` | Definitions, arithmetic and geometric sequences | `user_supplied_provisional` | Direct user-supplied provisional content |
| `SEQ_INDUCTION` | Mathematical induction | `user_supplied_provisional` | Direct user-supplied provisional content |
| `SEQ_CONVERGENCE` | Monotonicity, boundedness and convergence | `user_supplied_provisional` | Direct user-supplied provisional content |
| `SEQ_RECURSIVE` | Recursive sequences | `user_supplied_provisional` | Direct user-supplied provisional content |
| `SEQ_APPLICATIONS` | Growth and investment applications | `user_supplied_provisional` | Direct user-supplied provisional content |

### 15.2 Skill provenance

Every skill below has provenance `proposed_inferred_from_user_supplied_provisional`. The justification is educational decomposition of the corresponding user-supplied topic, not a claim that the exact skill boundary is official curriculum content.

| Skill code | Topic | Provenance |
|---|---|---|
| `SEQ_BASICS_S01` | `SEQ_BASICS` | `proposed_inferred_from_user_supplied_provisional` |
| `SEQ_BASICS_S02` | `SEQ_BASICS` | `proposed_inferred_from_user_supplied_provisional` |
| `SEQ_BASICS_S03` | `SEQ_BASICS` | `proposed_inferred_from_user_supplied_provisional` |
| `SEQ_BASICS_S04` | `SEQ_BASICS` | `proposed_inferred_from_user_supplied_provisional` |
| `SEQ_BASICS_S05` | `SEQ_BASICS` | `proposed_inferred_from_user_supplied_provisional` |
| `SEQ_BASICS_S06` | `SEQ_BASICS` | `proposed_inferred_from_user_supplied_provisional` |
| `SEQ_BASICS_S07` | `SEQ_BASICS` | `proposed_inferred_from_user_supplied_provisional` |
| `SEQ_INDUCTION_S01` | `SEQ_INDUCTION` | `proposed_inferred_from_user_supplied_provisional` |
| `SEQ_CONVERGENCE_S01` | `SEQ_CONVERGENCE` | `proposed_inferred_from_user_supplied_provisional` |
| `SEQ_CONVERGENCE_S02` | `SEQ_CONVERGENCE` | `proposed_inferred_from_user_supplied_provisional` |
| `SEQ_CONVERGENCE_S03` | `SEQ_CONVERGENCE` | `proposed_inferred_from_user_supplied_provisional` |
| `SEQ_CONVERGENCE_S04` | `SEQ_CONVERGENCE` | `proposed_inferred_from_user_supplied_provisional` |
| `SEQ_CONVERGENCE_S05` | `SEQ_CONVERGENCE` | `proposed_inferred_from_user_supplied_provisional` |
| `SEQ_CONVERGENCE_S06` | `SEQ_CONVERGENCE` | `proposed_inferred_from_user_supplied_provisional` |
| `SEQ_RECURSIVE_S01` | `SEQ_RECURSIVE` | `proposed_inferred_from_user_supplied_provisional` |
| `SEQ_RECURSIVE_S02` | `SEQ_RECURSIVE` | `proposed_inferred_from_user_supplied_provisional` |
| `SEQ_RECURSIVE_S03` | `SEQ_RECURSIVE` | `proposed_inferred_from_user_supplied_provisional` |
| `SEQ_RECURSIVE_S04` | `SEQ_RECURSIVE` | `proposed_inferred_from_user_supplied_provisional` |
| `SEQ_APPLICATIONS_S01` | `SEQ_APPLICATIONS` | `proposed_inferred_from_user_supplied_provisional` |
| `SEQ_APPLICATIONS_S02` | `SEQ_APPLICATIONS` | `proposed_inferred_from_user_supplied_provisional` |

## 16. What this document does not authorize

This document does not authorize:

- creating database skill rows;
- creating `topic_skills` rows;
- creating `skill_prerequisites` rows;
- creating seed data;
- changing migrations or schema;
- changing backend, frontend, APIs, or grading logic;
- creating exercises or mastery calculations;
- beginning U01, U03–U11, or any other unit;
- publishing curriculum content;
- claiming official curriculum verification.

The next step requires separate approval.

## 17. Change log

| Date | Change |
|---|---|
| 2026-11-13 | Created the initial U02 provisional skill decomposition proposal with 20 skills across five user-supplied topics. |
| 2026-11-13 | Recorded topic provenance as `user_supplied_provisional` and skill provenance as `proposed_inferred_from_user_supplied_provisional`. |
| 2026-11-13 | Added inferred hard prerequisites, conditional guidance, mathematical review notes, and OPEN curriculum questions. |
| 2026-11-13 | Mathematical-review revision: reduced hard prerequisites to two, moved general-term characterization dependencies to conditional guidance, clarified geometric ratios and finite-sum term counts, narrowed induction conditionals, clarified adjacent-sequence sufficient conditions, and separated recursive interpretation from term execution. |
| 2026-11-14 | Prerequisite correction: moved both remaining sequence-notation dependencies to conditional guidance, leaving zero hard prerequisite edges; removed boundedness from the conditional prerequisites of `SEQ_CONVERGENCE_S06`. |
| 2026-11-14 | Owner approved the U02 skill decomposition as APPROVED — PROVISIONAL; official verification, Arabic terminology, and database authorization remain unresolved. |
