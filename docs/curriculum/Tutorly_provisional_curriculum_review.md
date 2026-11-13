# Tutorly — Provisional Curriculum Review Baseline

- **Status:** Owner-accepted provisional curriculum baseline
- **Official verification:** OPEN — not independently verified as an official syllabus
- **Arabic titles:** OPEN — pending supplied or approved titles
- **Final teaching order:** OPEN
- **Provenance:** `user_supplied_provisional` for all units and topics
- **Skill decomposition:** NOT STARTED
- **Database changes / seed data:** NOT AUTHORIZED

## 1. Purpose and source relationship

This document records the owner decisions on the curriculum units and topics reviewed from:

- `docs/curriculum/Tutorly_provisional_curriculum_inventory.md`

The source inventory remains the user-supplied provisional baseline. This review document does not replace it, does not add curriculum content, and does not convert any supplied or conditional item into officially verified content.

The 11-unit structure is accepted as a **temporary navigation baseline**, not an official teaching order.

## 2. Owner decision record

| ID | Decision | Status |
|---|---|---|
| DEC-01 | Keep all 11 units and their candidate codes | CONFIRMED |
| DEC-02 | Keep U01 and U05 separate; preserve their overlap explicitly | CONFIRMED |
| DEC-03 | Keep direct similarities under U06 for now | CONFIRMED |
| DEC-04 | Preserve all D1–D9 differences and conditional topics; do not delete or silently promote them to confirmed content | CONFIRMED |
| DEC-05 | Keep Arabic titles pending | CONFIRMED |
| DEC-06 | Do not claim official verification or finalize the teaching order | CONFIRMED |
| DEC-07 | Keep all provenance marked as `user_supplied_provisional` | CONFIRMED |

## 3. Scope and status conventions

**Included**
- Candidate unit codes and working English labels.
- Proposed topic groupings derived from the inventory.
- Explicit D1–D9 difference flags.
- Conditional and progression-dependent topics.
- Alternative-organization mapping.
- Open review questions.

**Not included or authorized**
- Skill creation or skill decomposition.
- Prerequisite graph design.
- Database migrations or schema changes.
- Seed data or production curriculum import.
- Invented Arabic titles.
- Official syllabus verification.
- Final unit or topic teaching order.

**Status labels used below**

| Label | Meaning |
|---|---|
| `PROVISIONAL BASELINE` | Accepted as a provisional review structure; not official content |
| `CONDITIONAL` | Preserved in the review baseline, but inclusion or placement is OPEN |
| `OVERLAP` | Kept in more than one unit or referenced across units; no silent merge |
| `D1`–`D9` | Documented difference from inventory section 3 |
| `P` | Inventory says the item appears in one supplied progression; inclusion is OPEN |

No topic is confirmed as official curriculum content.

The current database schema has `code` on `skills` only. The unit and topic codes in this document are review identifiers, not a proposed schema change.

## 4. Baseline unit structure

All units retain the candidate codes accepted under DEC-01.

| # | Candidate code | Working English label | Arabic title | Review state |
|---|---|---|---|---|
| U01 | `FUN` | Functions, limits, continuity and differentiation | PENDING | PROVISIONAL BASELINE; overlap with U05 (D8) |
| U02 | `SEQ` | Numerical sequences | PENDING | PROVISIONAL BASELINE |
| U03 | `EXP` | Natural exponential function | PENDING | PROVISIONAL BASELINE; general-base content conditional (D7) |
| U04 | `LOG` | Natural logarithmic function | PENDING | PROVISIONAL BASELINE; general-base/real-power content conditional (D7) |
| U05 | `TRF` | Comprehensive function study and graphical transformations | PENDING | PROVISIONAL BASELINE; overlap with U01 (D8) |
| U06 | `CPX` | Complex numbers | PENDING | PROVISIONAL BASELINE; direct similarities retained here (D5) |
| U07 | `INT` | Integral calculus | PENDING | PROVISIONAL BASELINE; mean-value placement OPEN |
| U08 | `DEQ` | Differential equations | PENDING | PROVISIONAL BASELINE; second-order content conditional (D2) |
| U09 | `PRB` | Probability and statistics | PENDING | PROVISIONAL BASELINE; continuous and bivariate content conditional (D3, D4, D9) |
| U10 | `GEO` | Geometry in space | PENDING | PROVISIONAL BASELINE; cylinders/cones content conditional (D6) |
| U11 | `NTH` | Number theory / arithmetic | PENDING | PROVISIONAL BASELINE; only in the 11-unit list (D1) |

**Final teaching order:** OPEN. The numbering follows the temporary 11-unit inventory only.

## 5. Baseline topic structure

Every topic below is retained in the review baseline. Conditional topics remain explicitly conditional and are not approved for skill decomposition, seeding, or official content.

### 5.1 U01 — `FUN` — Functions, limits, continuity and differentiation

| Candidate code | Working English topic label | Coverage from inventory | Review state |
|---|---|---|---|
| `FUN_LIMITS` | Limits and asymptotes | Finite/infinite and one-sided limits; limits at endpoints and infinity; limit operations, indeterminate forms, comparison and squeeze theorems; horizontal, vertical and oblique asymptotes; relative position of a curve and asymptote | PROVISIONAL BASELINE |
| `FUN_CONTINUITY` | Continuity, IVT and inverse | Continuity at a point/interval; familiar functions and operations; Intermediate Value Theorem; existence/uniqueness of solutions to f(x)=k where justified; bisection; inverse of a continuous monotone function | PROVISIONAL BASELINE |
| `FUN_DIFFERENTIATION` | Differentiation and affine approximation | Derivative, tangent, one-sided differentiability, half-tangents, affine approximation, chain rule | PROVISIONAL BASELINE |
| `FUN_CALCULUS_STUDY` | Calculus-based function study | Monotonicity, extrema, inflection points, concavity/convexity, infinite branches, complete function study. The inventory bullet also lists even/odd functions, symmetry, relative positions and parameter-based graphical discussion; these are preserved with cross-reference to U05 | OVERLAP (D8) |

### 5.2 U02 — `SEQ` — Numerical sequences

| Candidate code | Working English topic label | Coverage from inventory | Review state |
|---|---|---|---|
| `SEQ_BASICS` | Definitions, arithmetic and geometric sequences | Definitions; arithmetic/geometric sequences; general terms and sums | PROVISIONAL BASELINE |
| `SEQ_INDUCTION` | Mathematical induction | Mathematical induction | PROVISIONAL BASELINE |
| `SEQ_CONVERGENCE` | Monotonicity, boundedness and convergence | Monotonicity, boundedness, limits and convergence; monotone bounded sequence theorems; comparison; adjacent sequences | PROVISIONAL BASELINE |
| `SEQ_RECURSIVE` | Recursive sequences | Recursive sequences u(n+1)=f(u(n)); auxiliary sequences; graphical interpretation | PROVISIONAL BASELINE |
| `SEQ_APPLICATIONS` | Growth and investment applications | Growth and investment applications | PROVISIONAL BASELINE |

### 5.3 U03 — `EXP` — Natural exponential function

| Candidate code | Working English topic label | Coverage from inventory | Review state |
|---|---|---|---|
| `EXP_DEFINITION` | Definition and properties | Definition and algebraic/analytical properties of exp(x)=e^x | PROVISIONAL BASELINE |
| `EXP_CALCULUS` | Exponential calculus | Derivative, monotonicity, limits and comparative growth | PROVISIONAL BASELINE |
| `EXP_COMPOSITE` | Exponential composite functions | Functions involving e^x and composite functions e^(u(x)) | PROVISIONAL BASELINE |
| `EXP_EQUATIONS` | Exponential equations and inequalities | Exponential equations and inequalities | PROVISIONAL BASELINE |
| `EXP_GENERAL_BASE` | General-base exponentials | General-base exponentials a^x appear in one supplied progression | CONDITIONAL (D7) |

### 5.4 U04 — `LOG` — Natural logarithmic function

| Candidate code | Working English topic label | Coverage from inventory | Review state |
|---|---|---|---|
| `LOG_DEFINITION` | Definition of the natural logarithm | Definition as inverse of the exponential; also described as the antiderivative of 1/x vanishing at 1 | PROVISIONAL BASELINE |
| `LOG_CALCULUS` | Logarithmic properties and calculus | Algebraic properties, limits, derivative and comparative growth | PROVISIONAL BASELINE |
| `LOG_COMPOSITE` | Logarithmic composite functions | Composite functions ln(u(x)) | PROVISIONAL BASELINE |
| `LOG_EQUATIONS` | Logarithmic equations and inequalities | Logarithmic equations and inequalities | PROVISIONAL BASELINE |
| `LOG_GENERAL_BASE` | Decimal/base-a logarithms and real powers | Decimal/base-a logarithms and real powers appear depending on progression | CONDITIONAL (D7) |

### 5.5 U05 — `TRF` — Comprehensive function study and graphical transformations

| Candidate code | Working English topic label | Coverage from inventory | Review state |
|---|---|---|---|
| `TRF_COMPOSITION` | Composition and monotonicity | Composition and monotonicity of composite functions | PROVISIONAL BASELINE |
| `TRF_SYMMETRY` | Symmetry centre/axis | Symmetry centre/axis | OVERLAP (D8) |
| `TRF_TRANSFORMATIONS` | Graphical transformations | Translation, symmetry, &#124;f(x)&#124; and f(&#124;x&#124;) | OVERLAP (D8) |
| `TRF_RELATIVE_POSITIONS` | Relative positions and graphical discussion | Relative positions of curves; horizontal, oblique and rotational graphical discussions | OVERLAP (D8) |
| `TRF_PARAMETERS` | Parameter-based graphical discussion | Parameter-based graphical discussion of equations and inequalities | OVERLAP (D8) |

### 5.6 U06 — `CPX` — Complex numbers

| Candidate code | Working English topic label | Coverage from inventory | Review state |
|---|---|---|---|
| `CPX_ALGEBRA` | Algebraic form and modulus | Algebraic form, real/imaginary parts, conjugate and modulus | PROVISIONAL BASELINE |
| `CPX_REPRESENTATION` | Complex-plane representation | Representation by point/vector; argument | PROVISIONAL BASELINE |
| `CPX_FORMS` | Trigonometric and exponential forms | Trigonometric/exponential forms; De Moivre and Euler formulas | PROVISIONAL BASELINE |
| `CPX_EQUATIONS` | Quadratic and higher-degree equations | Quadratic equations over C; higher-degree equations and roots appear in one progression | CONDITIONAL (P) |
| `CPX_ROOTS` | Roots and roots of unity | Roots of complex numbers and roots of unity appear in one progression | CONDITIONAL (P) |
| `CPX_GEOMETRY` | Distances, angles and loci | Geometric distances/angles and loci: lines, circles and other curves | PROVISIONAL BASELINE |
| `CPX_TRANSFORMATIONS` | Complex transformations and direct similarities | Translation, homothety, symmetry, rotation and direct similarities using complex notation | PROVISIONAL BASELINE; direct similarities retained under U06 for now (D5) |

### 5.7 U07 — `INT` — Integral calculus

| Candidate code | Working English topic label | Coverage from inventory | Review state |
|---|---|---|---|
| `INT_ANTIDERIVATIVES` | Antiderivatives and composite forms | Antiderivatives and table of familiar antiderivatives; composite forms u′·u^n, u′/u and u′·e^u | PROVISIONAL BASELINE |
| `INT_DEFINITE` | Definite integral and FTC | Definite integral and fundamental theorem of calculus | PROVISIONAL BASELINE |
| `INT_PROPERTIES` | Integral properties and mean value | Linearity, Chasles relation, comparison and mean value properties | PROVISIONAL BASELINE; mean-value placement OPEN |
| `INT_PARTS` | Integration by parts | Integration by parts | PROVISIONAL BASELINE |
| `INT_APPLICATIONS` | Areas, volumes and mean value | Areas between curves, volumes of solids of revolution and mean value | PROVISIONAL BASELINE; mean-value placement OPEN |

### 5.8 U08 — `DEQ` — Differential equations

| Candidate code | Working English topic label | Coverage from inventory | Review state |
|---|---|---|---|
| `DEQ_FIRST_ORDER` | First-order equations | First-order equations y′=ay+b and y′=ay | PROVISIONAL BASELINE |
| `DEQ_SECOND_ORDER` | Second-order equation | Second-order equation y″+ay′+by=0 appears in one supplied list | CONDITIONAL (D2) |
| `DEQ_INITIAL_CONDITIONS` | Particular solutions from initial conditions | Particular solutions from initial conditions | PROVISIONAL BASELINE |
| `DEQ_APPLICATIONS` | Physical applications | Decay and charging/discharging appear in one progression | CONDITIONAL (P) |

### 5.9 U09 — `PRB` — Probability and statistics

| Candidate code | Working English topic label | Coverage from inventory | Review state |
|---|---|---|---|
| `PRB_COUNTING` | Counting | Counting principles, arrangements/permutations and combinations | CONDITIONAL (D9) |
| `PRB_PROBABILITY` | Probability | Probability, conditional probability, independence, total probability and probability trees | CONDITIONAL (D9) |
| `PRB_RANDOM_VARIABLES` | Random variables | Random variables and distributions; expectation E(X), variance V(X), standard deviation σ(X) | PROVISIONAL BASELINE |
| `PRB_BINOMIAL` | Bernoulli trials and binomial distribution | Bernoulli trials and binomial distribution | PROVISIONAL BASELINE |
| `PRB_CONTINUOUS` | Continuous probability | Continuous probability: density/distribution functions | CONDITIONAL (D3) |
| `PRB_BIVARIATE` | Bivariate statistics | Bivariate statistics, linear correlation and regression | CONDITIONAL (D4) |

### 5.10 U10 — `GEO` — Geometry in space

| Candidate code | Working English topic label | Coverage from inventory | Review state |
|---|---|---|---|
| `GEO_SCALAR` | Scalar product, orthogonality and distance | Scalar product, orthogonality and distance | PROVISIONAL BASELINE |
| `GEO_LINES_PLANES` | Lines and planes | Parametric line representation; Cartesian plane equation | PROVISIONAL BASELINE |
| `GEO_POSITIONS` | Relative positions | Line/line, plane/plane and line/plane relative positions | PROVISIONAL BASELINE |
| `GEO_DISTANCES` | Point-to-line/plane distance | Distance from a point to a line/plane | PROVISIONAL BASELINE |
| `GEO_SPHERE` | Sphere | Sphere equation and intersections with planes/lines | PROVISIONAL BASELINE |
| `GEO_REVOLUTION` | Cylinders, cones and plane sections | Cylinders/cones of revolution and plane sections | CONDITIONAL (D6) |

### 5.11 U11 — `NTH` — Number theory / arithmetic

| Candidate code | Working English topic label | Coverage from inventory | Review state |
|---|---|---|---|
| `NTH_DIVISIBILITY` | Divisibility and Euclidean division | Divisors and multiples in Z; Euclidean division | CONDITIONAL (D1) |
| `NTH_CONGRUENCES` | Congruences | Congruences and arithmetic with congruences | CONDITIONAL (D1) |
| `NTH_PRIMES` | Primes and theorems | Prime numbers, Gauss theorem and Fermat’s little theorem | CONDITIONAL (D1) |
| `NTH_POWERS` | Remainders of powers | Remainders of powers | CONDITIONAL (D1) |
| `NTH_DIOPHANTINE` | Diophantine equations | Diophantine equations ax+by=c | CONDITIONAL (D1) |

## 6. Explicit U01/U05 overlap

U01 and U05 remain separate under DEC-02.

The overlap is preserved rather than deleted or silently merged:

- U01 retains calculus-based function study: monotonicity, extrema, inflection, concavity/convexity, infinite branches and complete function study.
- U05 retains comprehensive function study and graphical transformations.
- The inventory also lists even/odd functions, symmetry, relative positions and parameter-based graphical discussion in U01 while U05 contains related transformation and graphical-discussion content.
- These items remain visible in both review contexts.

**OPEN:** The canonical placement of overlapping items is deferred. No skills are created now, and no duplicate skills are approved.

## 7. Direct similarities placement

Under DEC-03, direct similarities remain inside U06 as `CPX_TRANSFORMATIONS`.

The documented alternative — direct similarities as a separate trimester axis — remains preserved as D5. This placement may be revisited later, but it is not changed in this baseline.

## 8. Preserved differences D1–D9

| ID | Documented difference | Preservation in this baseline |
|---|---|---|
| D1 | Arithmetic/number theory is a separate unit in the 11-unit list but absent from the other two structures | U11 remains a full unit; all U11 topics are marked CONDITIONAL |
| D2 | Second-order differential equations appear only in the 11-unit list | `DEQ_SECOND_ORDER` remains CONDITIONAL |
| D3 | Continuous probability appears in the 11-unit list but not the 10-axis annual list | `PRB_CONTINUOUS` remains CONDITIONAL |
| D4 | Bivariate statistics appears in the trimester outline | `PRB_BIVARIATE` remains CONDITIONAL |
| D5 | Direct similarities are inside complex-number transformations in one list but a separate trimester axis in another | `CPX_TRANSFORMATIONS` remains under U06 for now; alternative placement remains OPEN |
| D6 | Cylinders and cones appear in the trimester outline | `GEO_REVOLUTION` remains CONDITIONAL |
| D7 | General-base exponentials/logarithms and real powers vary between lists | `EXP_GENERAL_BASE` and `LOG_GENERAL_BASE` remain CONDITIONAL |
| D8 | Function-study scope/order, graphical transformations and parameter discussions vary | U01 and U05 remain separate; overlapping topics are marked OVERLAP |
| D9 | Some counting and probability content depends on the adopted progression | `PRB_COUNTING` and `PRB_PROBABILITY` remain CONDITIONAL |

Additional progression-dependent items:

- `CPX_EQUATIONS` — higher-degree equations and roots appear in one progression.
- `CPX_ROOTS` — roots of complex numbers and roots of unity appear in one progression.
- `DEQ_APPLICATIONS` — physical applications appear in one progression.

These remain CONDITIONAL under the `P` flag.

## 9. Conditional topic register

The following topics are preserved but are not confirmed content:

- D1: `NTH_DIVISIBILITY`, `NTH_CONGRUENCES`, `NTH_PRIMES`, `NTH_POWERS`, `NTH_DIOPHANTINE`
- D2: `DEQ_SECOND_ORDER`
- D3: `PRB_CONTINUOUS`
- D4: `PRB_BIVARIATE`
- D6: `GEO_REVOLUTION`
- D7: `EXP_GENERAL_BASE`, `LOG_GENERAL_BASE`
- D9: `PRB_COUNTING`, `PRB_PROBABILITY`
- P: `CPX_EQUATIONS`, `CPX_ROOTS`, `DEQ_APPLICATIONS`

Overlap topics preserved without merge:

- `FUN_CALCULUS_STUDY`
- `TRF_SYMMETRY`
- `TRF_TRANSFORMATIONS`
- `TRF_RELATIVE_POSITIONS`
- `TRF_PARAMETERS`

Mean-value placement remains OPEN for:

- `INT_PROPERTIES`
- `INT_APPLICATIONS`

No conditional or overlap topic is approved for database seeding or official publication.

## 10. Alternative-organization mapping

### A. 11-unit organization

The baseline U01–U11 structure follows the supplied 11-unit organization. U01 and U05 remain separate, and U11 remains separate. D1–D9 remain visible.

### B. 10-axis annual organization

| Supplied axis | Baseline mapping |
|---|---|
| 1. Numerical functions: limits and continuity | U01 `FUN_LIMITS`, `FUN_CONTINUITY` |
| 2. Differentiability and function study | U01 `FUN_DIFFERENTIATION`, `FUN_CALCULUS_STUDY`; U05 |
| 3. Exponential function | U03 |
| 4. Logarithmic function | U04 |
| 5. Numerical sequences | U02 |
| 6. Antiderivatives and integral calculus | U07 |
| 7. Differential equations | U08 |
| 8. Complex numbers | U06 |
| 9. Geometry in space | U10 |
| 10. Probability | U09 |

Not represented as a separate axis in B: U11 arithmetic/number theory. Conditional and varying items remain governed by D1–D9.

### C. Trimester organization

| Supplied trimester content | Baseline mapping |
|---|---|
| Limits and continuity | U01 |
| Differentiability | U01 |
| Function study/graphical discussion | U01 and U05 |
| Sequences | U02 |
| Exponential function | U03 |
| Logarithmic function | U04 |
| Antiderivatives; integral calculus | U07 |
| Complex numbers | U06 |
| Direct similarities | U06 `CPX_TRANSFORMATIONS`, with separate-axis alternative preserved as D5 |
| Geometry in space | U10 |
| Plane sections of surfaces | U10 `GEO_REVOLUTION` |
| Statistics and probability | U09, including `PRB_BIVARIATE` |

Not explicitly represented in C: U08 differential equations and U11 arithmetic/number theory.

## 11. Arabic titles and provenance

- No Arabic unit or topic titles were supplied in the inventory.
- All Arabic titles remain `PENDING` under DEC-05.
- No Arabic wording has been invented or inferred.
- All units and topics remain `user_supplied_provisional` under DEC-07.
- No official issuer, document version, date, or page-number provenance is available yet.
- Official source verification remains OPEN under DEC-06.

## 12. Remaining open decisions

| ID | Open item | Status |
|---|---|---|
| O-01 | Official source verification and acquisition | OPEN |
| O-02 | Final unit and topic teaching order | OPEN |
| O-03 | Supplied/approved Arabic titles for all units and topics | OPEN |
| O-04 | Inclusion or deferral of each conditional topic | OPEN |
| O-05 | Canonical placement of U01/U05 overlapping content | OPEN |
| O-06 | Final placement of direct similarities | OPEN; retained under U06 for now |
| O-07 | Canonical placement of mean value in U07 | OPEN |
| O-08 | Skill decomposition and prerequisite graph | NOT STARTED |
| O-09 | Database seeding and publication | NOT AUTHORIZED |

## 13. Next step

The next permitted planning step, after approval of this document, is a separate skill-decomposition proposal.

This document does not create skills and does not authorize migrations, application-code changes, seed data, or curriculum publication.
