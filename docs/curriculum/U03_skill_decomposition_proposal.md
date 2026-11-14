# U03 Skill Decomposition Proposal

## 1. Document status

- **Status:**APPROVED — PROVISIONAL skill decomposition — documentation only
- **Unit:** U03 — الدالة الأسية الطبيعية — provisional Arabic title, official title OPEN
- **Scope:** U03 only
- **Topic provenance:** `user_supplied_provisional`
- **Skill provenance:** `proposed_inferred_from_user_supplied_provisional`
- **Official verification:** OPEN — not independently verified as an official syllabus
- **Arabic terminology:** PROVISIONAL — pending curriculum terminology review
- **D7:** OPEN — inclusion and placement of `EXP_GENERAL_BASE` remain conditional
- **Database seeding:** NOT AUTHORIZED
- **Skill prerequisite edges:** NOT CREATED in the database
- **U01, U02, U04 and later units:** NOT MODIFIED

This document proposes a provisional decomposition of U03 into 19 skills. It does not create skills, seed data, database rows, prerequisite edges, APIs, grading logic, or exercises. It is not approved as official curriculum content.

## 2. Sources and scope

Source documents:

- `docs/curriculum/Tutorly_provisional_curriculum_inventory.md`
- `docs/curriculum/Tutorly_provisional_curriculum_review.md`

Included topics:

- `EXP_DEFINITION`
- `EXP_CALCULUS`
- `EXP_COMPOSITE`
- `EXP_EQUATIONS`
- `EXP_GENERAL_BASE` — CONDITIONAL under D7; inclusion and placement remain OPEN

Excluded:

- U01, U02, U04–U11.
- Official Arabic curriculum wording.
- Database seeds and migration changes.
- Exercise, grading, and mastery implementation.
- Logarithmic functions, logarithmic equations, and logarithmic inequalities.
- General real powers outside the supplied conditional general-base topic.
- Power series, integrals, differential equations, complex exponential forms, and probability applications.
- An official decision on whether `EXP_GENERAL_BASE` belongs in U03 or elsewhere.

## 3. Status, provenance, and D7 boundary

The five U03 topics are part of the owner-accepted provisional curriculum baseline. They are not officially verified syllabus content.

This document is a **PROPOSED — PROVISIONAL** skill decomposition. The 19 skill codes, titles, descriptions, outcomes, evidence requirements, and prerequisite relationships require owner and mathematics review.

The only direct curriculum provenance in this document is the topic-level provenance `user_supplied_provisional`. Skill boundaries and prerequisites are educational decomposition and are marked as inferred. No prerequisite is presented as a direct statement from the supplied curriculum.

### 3.1 D7 — general-base exponentials

`EXP_GENERAL_BASE` is retained as a conditional topic under discrepancy D7. The inventory says only that general-base exponentials `a^x` appear in one supplied progression. It does not establish that `EXP_GENERAL_BASE` is part of every progression, nor where it should be taught.

This document therefore:

- proposes conditional skills for the topic only to show a possible decomposition;
- does not treat `EXP_GENERAL_BASE` as confirmed curriculum content;
- does not resolve its placement in U03, U04, or another unit;
- does not assume logarithmic conversion `a^x = e^{x ln a}` as U03 content;
- does not assess general-base derivatives, limits, equations, or inequalities;
- does not authorize database representation or seeding.

D7 remains OPEN.

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
| `D` | Directly represented in the user-supplied U03 topic content |
| `I` | Educational interpretation required to make the ability observable and assessable |
| `D/I` | User-supplied ability with an interpretive formulation or method |

### 4.3 Prerequisite classifications

| Classification | Meaning | Database treatment |
|---|---|---|
| Hard prerequisite | The student must demonstrate the prerequisite ability to perform the dependent skill as defined | Candidate for a future reviewed `skill_prerequisites` edge; not created in this task |
| Conditional prerequisite | Needed only when the exercise does not supply the required result or data | Documentation only; must not be represented as a database prerequisite edge |
| May be supplied | The exercise may provide the definition, identity, derivative, monotonicity, limit, comparison, equation, inequality, base, or domain data | Not a prerequisite |

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
- belongs to exactly one U03 topic;
- has a proposed difficulty label;
- has the required provenance.

The topic association is the section heading. No skill belongs to more than one topic.

## 6. Proposed skill decomposition

### 6.1 `EXP_DEFINITION` — 4 skills

| Code | Arabic title proposal | English title | Mathematical description | Observable learning outcome | Assessment evidence | Difficulty | Hard prerequisite | Conditional prerequisite — documentation only | Basis and justification |
|---|---|---|---|---|---|---|---|---|---|
| `EXP_DEFINITION_S01` | تفسير تعريف الدالة الأسية الطبيعية وترميزها | Interpret the definition and notation of the natural exponential function | Interpret the supplied definition of `exp` and the notation `exp(x) = e^x`; distinguish the function from a polynomial power and from a general-base exponential `a^x`. | Explain what `exp(x)` and `e^x` denote under the supplied definition and use both notations correctly. | Correctly translate between `exp(x)` and `e^x`, identify the input and value, and distinguish the constant `e` from the variable exponent. | beginner | — | — | D/I — definition and notation are supplied; the notation distinction is interpretive. |
| `EXP_DEFINITION_S02` | تحديد مجال الدالة الأسية ومداها وإشارتها وقيمها الخاصة | Determine the domain, range, sign, and special values of the natural exponential function | Determine that `exp` is defined on `R`, is positive everywhere, has range `(0, +infinity)`, and satisfies the supplied special values such as `e^0 = 1` and `e^1 = e`; use positivity to reject impossible values. | State the domain, range, sign, and supplied special values, and use them to reject impossible exponential values. | Identify the domain and range, state that `e^x > 0`, evaluate supplied special values, and reject statements such as `e^x <= 0`. | beginner | — | `EXP_DEFINITION_S01` if the definition or notation is not supplied | D/I — properties are supplied; their assessment formulation is interpretive. |
| `EXP_DEFINITION_S03` | تطبيق علاقات الجمع والطرح للدالة الأسية | Apply addition and subtraction identities for the natural exponential function | Apply the identities `e^(x + y) = e^x e^y`, `e^(x - y) = e^x / e^y`, and `e^0 = 1` to combine, simplify, and verify exponential expressions. | Transform exponential expressions using the addition and subtraction identities correctly. | Simplify products, quotients, and combined expressions; verify an identity by valid application of the stated rules. | intermediate | — | `EXP_DEFINITION_S01` if the definition or notation is not supplied | D/I — the identities are supplied; their use in assessment is interpretive. |
| `EXP_DEFINITION_S04` | تطبيق علاقات القوى والمقلوب للدالة الأسية | Apply power and reciprocal identities for the natural exponential function | Apply `e^(n x) = (e^x)^n` for integer `n` and `e^(-x) = 1 / e^x`; do not extend these rules to arbitrary real powers without an approved treatment of real powers. | Rewrite integer powers and reciprocals of exponential expressions correctly. | Simplify expressions such as `e^(3x)`, `e^(-2x)`, and `(e^x)^4`, showing the identity used. | intermediate | — | `EXP_DEFINITION_S03` if the addition and subtraction identities are not supplied; `EXP_DEFINITION_S01` if notation is not supplied | D/I — power and reciprocal identities are supplied; the integer-power boundary is interpretive. |

### 6.2 `EXP_CALCULUS` — 4 skills

| Code | Arabic title proposal | English title | Mathematical description | Observable learning outcome | Assessment evidence | Difficulty | Hard prerequisite | Conditional prerequisite — documentation only | Basis and justification |
|---|---|---|---|---|---|---|---|---|---|
| `EXP_CALCULUS_S01` | حساب مشتقة الدالة الأسية الطبيعية | Differentiate the natural exponential function | Differentiate `e^x` and simple constant multiples or finite sums of `e^x`, using the derivative rule `(e^x)' = e^x`; composite exponentials are excluded from this skill. | Compute the derivative of `e^x` and simple expressions built from it. | Produce correct derivatives, including the derivative of a constant multiple or finite sum, without omitting the exponential factor. | beginner | — | `EXP_DEFINITION_S01` if the exponential notation is not supplied | D — the derivative rule is supplied; the assessment boundary is inferred. |
| `EXP_CALCULUS_S02` | إثبات الرتابة الصارمة للدالة الأسية ومقارنة قيمها | Establish strict monotonicity of the natural exponential function and compare its values | Establish that `exp` is strictly increasing from its derivative sign or supplied monotonicity, and use strict monotonicity or injectivity to compare `e^a` and `e^b`. | Justify that `exp` is strictly increasing and compare exponential values correctly. | Show that `e^x` is strictly increasing, conclude `e^a < e^b` exactly when `a < b`, and justify the comparison. | intermediate | — | `EXP_CALCULUS_S01` if the derivative or its sign is not supplied | D/I — monotonicity is supplied; the comparison formulation is interpretive. |
| `EXP_CALCULUS_S03` | تحديد نهايات الدالة الأسية عند اللانهاية | Determine limits of the natural exponential function at infinity | Determine `lim_(x -> +infinity) e^x = +infinity` and `lim_(x -> -infinity) e^x = 0`; do not treat infinity as a real input value. | State and justify the two basic limits of `e^x` at infinity. | Compute both limits, identify the correct direction of approach, and avoid substituting infinity as a number. | intermediate | — | — | D — the limits are supplied; the assessment formulation is interpretive. |
| `EXP_CALCULUS_S04` | تطبيق النمو المقارن بين الدالة الأسية ودوال القوة | Apply comparative growth between the natural exponential function and power functions | Apply the standard comparative growth statement as `x -> +infinity`, with `n` a fixed real number and `x` sufficiently large and positive: on that domain, `e^x / x^n -> +infinity` and `x^n / e^x -> 0`; preserve the direction of the comparison. | Select and apply the correct comparative growth statement for an exponential-versus-power limit as `x -> +infinity`, with fixed real `n` and sufficiently large positive `x`. | Compute the requested ratio limit, state that `n` is fixed, `x -> +infinity`, and `x` is sufficiently large and positive, and avoid reversing the dominant term. | advanced | — | `EXP_CALCULUS_S03` if the basic exponential limits are not supplied | D/I — comparative growth is supplied; the exact exponent conditions, domain condition, and official formulation remain OPEN. |

### 6.3 `EXP_COMPOSITE` — 4 skills

| Code | Arabic title proposal | English title | Mathematical description | Observable learning outcome | Assessment evidence | Difficulty | Hard prerequisite | Conditional prerequisite — documentation only | Basis and justification |
|---|---|---|---|---|---|---|---|---|---|
| `EXP_COMPOSITE_S01` | تحديد مجال ومدى دالة من الشكل e^{u(x)} | Determine the domain and range of a function of the form e^{u(x)} | Determine the domain of `e^(u(x))` from the domain of `u`, state that the function is positive, and determine its range when the range of `u` is supplied or readily available. | State the domain correctly, use positivity, and determine the range when the required range of `u` is supplied. | Identify excluded inputs, explain why `e^(u(x)) > 0`, and derive the range from a supplied range of `u`. | intermediate | — | `EXP_DEFINITION_S02` if the domain, range, or positivity of `exp` is not supplied; `EXP_DEFINITION_S01` if notation is not supplied | D/I — composite functions are supplied; domain and range handling is interpretive. |
| `EXP_COMPOSITE_S02` | اشتقاق دالة من الشكل e^{u(x)} بقاعدة السلسلة | Differentiate a function of the form e^{u(x)} using the chain rule | Apply the chain-rule formula `(e^(u(x)))' = u'(x) e^(u(x))` to compute the derivative, including the inner derivative; the chain-rule procedure and the outer derivative rule are assumed from prior study or supplied in the exercise. | Compute the derivative of `e^(u(x))` correctly, including the factor `u'(x)`. | Differentiate composite exponential expressions, show the inner derivative, and identify an omitted chain-rule factor. | intermediate | — | `EXP_CALCULUS_S01` if the outer derivative rule `(e^x)' = e^x` is not supplied; `FUN_DIFFERENTIATION_S06` if the chain-rule procedure is not supplied or already established; cross-unit treatment remains OPEN | D/I — composite exponential functions are supplied; the chain-rule application is interpretive. |
| `EXP_COMPOSITE_S03` | تحديد رتابة دالة من الشكل e^{u(x)} | Determine the monotonicity of a function of the form e^{u(x)} | Use the strict monotonicity of `exp` to transfer supplied monotonicity of `u` to `e^(u(x))`: on a relevant interval, `e^(u(x))` is increasing when `u` is increasing, decreasing when `u` is decreasing, and constant when `u` is constant. | State the monotonicity of `e^(u(x))` correctly from supplied monotonicity of `u`. | Classify the monotonicity of the composite function and justify the conclusion using the strict monotonicity of `exp`. | intermediate | — | `EXP_CALCULUS_S02` if strict monotonicity of `exp` is not supplied | D/I — monotonicity and composition are supplied; the transfer rule is interpretive. |
| `EXP_COMPOSITE_S04` | تحديد نهايات دالة من الشكل e^{u(x)} | Determine limits of a function of the form e^{u(x)} | Determine limits of `e^(u(x))` from a supplied limit of `u`: a finite limit `L` gives `e^L`, a limit `+infinity` gives `+infinity`, and a limit `-infinity` gives `0`. | Evaluate supported composite exponential limits from the limiting behavior of the inner function. | Compute the limit, identify which case applies, and justify the result using continuity or the basic exponential limits. | advanced | — | `EXP_CALCULUS_S03` if the basic exponential limits are not supplied | D/I — composite limits are supplied; the case analysis is interpretive. |

### 6.4 `EXP_EQUATIONS` — 4 skills

| Code | Arabic title proposal | English title | Mathematical description | Observable learning outcome | Assessment evidence | Difficulty | Hard prerequisite | Conditional prerequisite — documentation only | Basis and justification |
|---|---|---|---|---|---|---|---|---|---|
| `EXP_EQUATIONS_S01` | حل معادلات أسية بمطابقة الأسس | Solve exponential equations by equating exponents | Solve equations of the form `e^(u(x)) = e^(v(x))` or `e^(u(x)) = e^a` by using the strict monotonicity of `exp` to conclude `u(x) = v(x)` or `u(x) = a`; for `e^(u(x)) = c` with `c <= 0`, conclude that there is no solution. | Solve supported exponential equations by valid exponent comparison and handle nonpositive right-hand sides correctly. | Produce the complete solution set, state the equivalence used, and reject nonpositive values of `c` in supported cases. | intermediate | — | `EXP_CALCULUS_S02` if strict monotonicity or injectivity is not supplied | D/I — equations are supplied; the equivalence formulation is interpretive. |
| `EXP_EQUATIONS_S02` | حل متراجحات أسية بمقارنة الأسس | Solve exponential inequalities by comparing exponents | Solve inequalities such as `e^(u(x)) < e^(v(x))`, `e^(u(x)) <= e^a`, and their reverse forms by using the strict increase of `exp`, which preserves the inequality direction; handle nonpositive constants and the positivity of `exp`. | Solve supported exponential inequalities with the correct inequality direction and boundary handling. | Produce the solution set, justify direction preservation, and handle cases such as `e^(u(x)) > c` with `c <= 0`. | intermediate | — | `EXP_CALCULUS_S02` if strict monotonicity is not supplied | D/I — inequalities are supplied; the equivalence and boundary treatment are interpretive. |
| `EXP_EQUATIONS_S03` | حل معادلات أسية قابلة للاختزال بالتعويض | Solve exponential equations reducible by substitution | Use a substitution such as `t = e^x` or `t = e^(u(x))`, with the restriction `t > 0`, to reduce a supported equation to a polynomial or quadratic equation, reject nonpositive or extraneous values of `t`, and solve the resulting exponent equation. Scope is restricted to cases where every accepted positive root can be converted back to the original variable without an unapproved logarithm — for example `t = 1` giving `x = 0`, `t = e^a` with `a` supplied, or a residual equation already of the form `e^(u(x)) = e^(v(x))`. Arbitrary positive roots such as `t = 2` requiring `x = ln 2`, and roots requiring `x` expressed through a logarithm, are outside assessed U03 scope and remain OPEN for U04. | Reduce a supported exponential equation by a valid substitution, enforce `t > 0`, complete the solution set when every accepted root converts back without an unapproved logarithm, and otherwise report the equation as outside assessed scope. | Show the substitution, solve the reduced equation, reject invalid `t` values, state why each accepted root is or is not convertible without logarithms, and return to the original variable with a domain check. | advanced | — | `EXP_DEFINITION_S04` if power identities are not supplied; `EXP_EQUATIONS_S01` if basic exponent comparison is not supplied | D/I — reducible equations are supplied; the substitution method, rejection rule, and logarithm-free conversion boundary are interpretive. |
| `EXP_EQUATIONS_S04` | حل متراجحات أسية قابلة للاختزال بالتعويض | Solve exponential inequalities reducible by substitution | Use a substitution such as `t = e^x` with `t > 0` to reduce a supported exponential inequality to a polynomial inequality, solve it under the positive-domain restriction, and translate the result back using the strict monotonicity of `exp`. Scope is restricted to cases where every interval boundary in `t` can be translated back without an unapproved logarithm, or where the necessary logarithmic values are explicitly supplied in the exercise. General logarithm-dependent boundaries remain outside assessed U03 scope and OPEN. | Reduce a supported exponential inequality, solve the restricted polynomial inequality, translate every boundary correctly when no unapproved logarithm is required or when the logarithmic values are supplied, and otherwise report the case as outside assessed scope. | Show the substitution, solve and intersect with `t > 0`, translate each boundary with justification, cite any supplied logarithmic values used, and check the original domain. | advanced | — | `EXP_DEFINITION_S04` if power identities are not supplied; `EXP_EQUATIONS_S02` if basic inequality comparison is not supplied | D/I — reducible inequalities are supplied; the substitution, translation, and logarithm-free or logarithm-supplied boundary rule are interpretive. |

### 6.5 `EXP_GENERAL_BASE` — 3 skills — CONDITIONAL under D7

| Code | Arabic title proposal | English title | Mathematical description | Observable learning outcome | Assessment evidence | Difficulty | Hard prerequisite | Conditional prerequisite — documentation only | Basis and justification |
|---|---|---|---|---|---|---|---|---|---|
| `EXP_GENERAL_BASE_S01` | تفسير تعريف الدالة الأسية ذات الأساس العام a^x | Interpret the definition of the general-base exponential function a^x | Interpret `a^x` under the exercise's stated base conditions, including `a > 0` and `a != 1` for a nonconstant exponential, and identify its domain and positive range; treat `a = 1` as a supplied constant case if it appears. The conversion `a^x = e^(x ln a)` is not assessed in U03. | Explain what `a^x` denotes, state the required base conditions, and identify its domain and range under the supplied definition. | Identify valid and invalid bases, state the domain and positive range, and distinguish the constant case `a = 1` when supplied. | beginner | — | — | D/I — general-base exponentials are conditionally supplied; base and domain formulation is interpretive. D7 OPEN. |
| `EXP_GENERAL_BASE_S02` | تطبيق الخصائص الجبرية للدالة الأسية ذات الأساس العام | Apply algebraic properties of the general-base exponential function | Apply `a^(x + y) = a^x a^y`, `a^(x - y) = a^x / a^y`, `a^0 = 1`, `a^(-x) = 1 / a^x`, and `a^(n x) = (a^x)^n` for integer `n`, under the stated base conditions. | Transform general-base exponential expressions using the stated algebraic properties. | Simplify and verify expressions, respecting the base conditions and the integer-power boundary. | intermediate | — | `EXP_GENERAL_BASE_S01` if the definition or base conditions are not supplied | D/I — general-base properties are conditionally supplied; the assessment formulation is interpretive. D7 OPEN. |
| `EXP_GENERAL_BASE_S03` | تحديد رتابة الدالة الأسية ذات الأساس العام حسب الأساس | Determine the monotonicity of the general-base exponential function from its base | Determine that `a^x` is strictly increasing when `a > 1`, strictly decreasing when `0 < a < 1`, and constant when `a = 1`, using the supplied definition, graph, or monotonicity data; no derivative or logarithmic conversion is assumed. | Classify the monotonicity of `a^x` correctly from the base. | State and justify the monotonicity case, including the constant case, without introducing an unapproved logarithmic conversion. | intermediate | — | `EXP_GENERAL_BASE_S01` if the definition or base conditions are not supplied | I — the monotonicity classification is an educational interpretation of the conditional topic. D7 OPEN. |

## 7. Topic-to-skill mapping

| Topic | Skill codes | Count | Status |
|---|---|---|---|
| `EXP_DEFINITION` | `EXP_DEFINITION_S01`–`EXP_DEFINITION_S04` | 4 | PROVISIONAL BASELINE |
| `EXP_CALCULUS` | `EXP_CALCULUS_S01`–`EXP_CALCULUS_S04` | 4 | PROVISIONAL BASELINE |
| `EXP_COMPOSITE` | `EXP_COMPOSITE_S01`–`EXP_COMPOSITE_S04` | 4 | PROVISIONAL BASELINE |
| `EXP_EQUATIONS` | `EXP_EQUATIONS_S01`–`EXP_EQUATIONS_S04` | 4 | PROVISIONAL BASELINE |
| `EXP_GENERAL_BASE` | `EXP_GENERAL_BASE_S01`–`EXP_GENERAL_BASE_S03` | 3 | CONDITIONAL (D7) |

**Total:** 19 skills.

No skill belongs to more than one topic. No skill is assigned to U01, U02, U04–U11, or any topic outside the supplied U03 baseline.

## 8. Prerequisite graph

### 8.1 Hard prerequisites

| Prerequisite skill | Dependent skill | Rationale |
|---|---|---|
| — | — | No hard prerequisite edge is proposed. |

No hard prerequisite edge is proposed. The potential dependency `EXP_CALCULUS_S01 → EXP_COMPOSITE_S02` is classified as conditional, not hard, because `(e^x)' = e^x` can be supplied directly in the composite exercise without prior mastery evidence for `EXP_CALCULUS_S01`; no mathematically indispensable hard dependency was established on review. No hard prerequisite is created in the database by this document. The chain-rule procedure from U01 is also not represented as a U03 hard edge; its cross-unit treatment remains OPEN.

### 8.2 Conditional prerequisites — documentation only

Conditional prerequisites are listed in the skill tables. They are not database edges and must not be seeded into `skill_prerequisites`.

The conditional dependency groups are:

- `EXP_DEFINITION_S01` → `EXP_DEFINITION_S02`, `EXP_DEFINITION_S03`, `EXP_DEFINITION_S04`, `EXP_CALCULUS_S01`, `EXP_COMPOSITE_S01`
- `EXP_DEFINITION_S02` → `EXP_COMPOSITE_S01`
- `EXP_DEFINITION_S03` → `EXP_DEFINITION_S04`
- `EXP_CALCULUS_S01` → `EXP_CALCULUS_S02`, `EXP_COMPOSITE_S02`
- `EXP_CALCULUS_S02` → `EXP_COMPOSITE_S03`, `EXP_EQUATIONS_S01`, `EXP_EQUATIONS_S02`
- `EXP_CALCULUS_S03` → `EXP_CALCULUS_S04`, `EXP_COMPOSITE_S04`
- `FUN_DIFFERENTIATION_S06` → `EXP_COMPOSITE_S02`
- `EXP_DEFINITION_S04` → `EXP_EQUATIONS_S03`, `EXP_EQUATIONS_S04`
- `EXP_EQUATIONS_S01` → `EXP_EQUATIONS_S03`
- `EXP_EQUATIONS_S02` → `EXP_EQUATIONS_S04`
- `EXP_GENERAL_BASE_S01` → `EXP_GENERAL_BASE_S02`, `EXP_GENERAL_BASE_S03`

An “or” dependency means the exercise may supply one of the alternatives; it does not create multiple hard prerequisites.

The single U01 reference, `FUN_DIFFERENTIATION_S06`, is conditional and documentation-only. It does not create a cross-unit hard edge and does not resolve whether U01 chain-rule mastery should become a formal U03 prerequisite.

The `EXP_CALCULUS_S01 → EXP_COMPOSITE_S02` dependency is also conditional: the outer derivative rule may be supplied directly in the composite exercise.

### 8.3 Graph verification rules

- The hard graph contains zero edges and is therefore acyclic.
- The conditional graph contains 21 documented guidance references, uses only forward dependencies, and is acyclic.
- Conditional prerequisite information in Section 6 agrees with Section 8.2.
- Every listed prerequisite reference points to an existing proposed skill.
- No skill references itself.
- No cross-unit hard prerequisite is proposed.
- The reviewed `EXP_CALCULUS_S01 → EXP_COMPOSITE_S02` dependency is conditional, not hard.
- D7 remains OPEN; no conditional topic is treated as confirmed content.

## 9. Composite assessments

The following are composite assessments, not single mastery skills:

- a complete study of a function involving `e^x` that combines derivative calculation, monotonicity, limits, and comparative growth;
- a multi-step equation or inequality combining exponential identities, substitution, and a final sign or interval analysis;
- an exercise combining the natural exponential with logarithmic conversion or logarithmic solution;
- any general-base exercise that requires logarithmic conversion, general-base calculus, or a general-base equation or inequality.

Evidence from a composite exercise must be attributed to the component skills actually assessed. No composite skill code is created by this document.

## 10. Mathematical review notes

### 10.1 `exp(x)`, `e^x`, and `a^x`

`exp(x)` and `e^x` are treated as two notations for the same natural exponential function under the supplied definition. `e` is a constant; the exponent is the variable. This is distinct from a general-base exponential `a^x`, where the base is a supplied constant and may be conditional under D7.

This document does not assume that `a^x` may be rewritten as `e^(x ln a)` for assessment in U03. That conversion depends on logarithmic content from U04 and on the unresolved placement of general-base topics under D7.

### 10.2 Definition and algebraic properties

The supplied inventory names the definition and algebraic/analytical properties of `exp(x) = e^x` but does not select a particular definition. This proposal therefore assesses use of the supplied definition, not a preferred construction by power series, differential equation, or inverse logarithm.

The identities used in this proposal are:

- `e^(x + y) = e^x e^y`;
- `e^(x - y) = e^x / e^y`;
- `e^0 = 1`;
- `e^(-x) = 1 / e^x`;
- `e^(n x) = (e^x)^n` for integer `n`.

The extension of power identities to arbitrary real exponents is not assumed. Its placement relative to U04 and D7 remains OPEN.

### 10.3 Derivative and chain rule

The derivative rule assessed in `EXP_CALCULUS_S01` is `(e^x)' = e^x`. The composite derivative assessed in `EXP_COMPOSITE_S02` is:

`(e^(u(x)))' = u'(x) e^(u(x))`.

The inner derivative `u'(x)` is required and must not be omitted. The outer derivative rule `(e^x)' = e^x` may be supplied directly; when it is not supplied or already established, `EXP_CALCULUS_S01` is conditional guidance. The chain-rule procedure is likewise a prior U01 expectation or must be supplied by the exercise. Neither is a U03 hard prerequisite, and this document does not create a cross-unit hard edge for the chain rule.

No derivative rule for `a^x` is assessed. A general-base derivative would involve `ln a` and is deferred under D7 and U04.

### 10.4 Strict monotonicity, equations, and inequalities

The natural exponential function is strictly increasing. Consequently:

- `e^(u(x)) = e^(v(x))` is equivalent to `u(x) = v(x)` on the relevant domain;
- `e^(u(x)) < e^(v(x))` is equivalent to `u(x) < v(x)`;
- the direction of an inequality is preserved when the same strictly increasing exponential is applied to both sides.

The positivity of `exp` must be handled explicitly:

- `e^(u(x)) = c` with `c <= 0` has no solution;
- `e^(u(x)) < c` with `c <= 0` has no solution;
- `e^(u(x)) > c` with `c <= 0` holds throughout the domain of `u`;
- `e^(u(x)) <= c` with `c <= 0` has no solution.

This proposal assesses equations and inequalities that can be solved by equating or comparing exponents, or by substitution. Solving `e^x = c` for an arbitrary positive `c` generally requires a logarithm; that operation is not assumed in U03 and remains OPEN pending U04 and curriculum review.

For substitutions such as `t = e^x`, the restriction `t > 0` is mandatory. A nonpositive root of the reduced polynomial is not a valid exponential value and must be rejected. Domain restrictions of `u` must be checked after solving.

The substitution scope is bounded by the logarithm prohibition:

- In `EXP_EQUATIONS_S03`, an accepted positive root is in scope only when it converts back without an unapproved logarithm. Examples include `t = 1` (giving `x = 0`), `t = e^a` with `a` supplied, and a residual equation already of the form `e^(u(x)) = e^(v(x))`. A root such as `t = 2` requires `x = ln 2`; that and any solution expressed through a logarithm remain outside assessed U03 scope and OPEN for U04.
- In `EXP_EQUATIONS_S04`, every interval boundary produced by the reduced polynomial inequality must translate back without an unapproved logarithm, or the necessary logarithmic values must be explicitly supplied in the exercise. General logarithm-dependent boundaries remain outside assessed U03 scope and OPEN.

An exercise that would require an unapproved logarithm is not graded as incorrect; it is outside the assessed scope of these skills.

### 10.5 Limits and comparative growth

The basic limits are:

- `lim_(x -> +infinity) e^x = +infinity`;
- `lim_(x -> -infinity) e^x = 0`.

The comparative growth statement assessed by `EXP_CALCULUS_S04` is taken as `x -> +infinity`, with `n` a fixed real number and `x` sufficiently large and positive. On that domain, `e^x / x^n -> +infinity` and `x^n / e^x -> 0`. The direction of the ratio matters: `e^x` is the dominant term in the stated comparison, not the reverse. The fixed-`n`, positive-infinity, and large-positive-`x` conditions are part of the assessment statement; omitting any of them is an error.

This is a standard comparative growth formulation, not a claim that every possible curriculum statement, exponent restriction, or asymptotic direction has been officially verified. The official scope remains OPEN.

### 10.6 Composite exponentials and domain handling

For `e^(u(x))`:

- the domain is the domain of `u`;
- the value is always positive;
- the range is the exponential image of the range of `u` when that range is supplied or readily available;
- monotonicity is inherited from `u` because `exp` is strictly increasing;
- limits are determined from the limit of `u`, with the cases `L`, `+infinity`, and `-infinity` treated separately.

No general rule is assumed for cases where `u` has no limit or where the composite limit requires an indeterminate-form analysis beyond the supplied data.

### 10.7 General-base conditions under D7

For a nonconstant general-base exponential, the base conditions `a > 0` and `a != 1` are used. The case `a = 1` gives a constant function and is treated only when supplied. The topic remains conditional under D7. Its inclusion, placement, derivative, limits, equations, and inequalities are not resolved here.

## 11. User-supplied content versus educational interpretation

### 11.1 Directly represented in the user-supplied U03 content

- the definition and algebraic/analytical properties of `exp(x) = e^x`;
- derivative, monotonicity, limits, and comparative growth;
- functions involving `e^x` and composite functions `e^(u(x))`;
- exponential equations and inequalities;
- general-base exponentials `a^x`, conditionally under D7.

### 11.2 Educational interpretations in this proposal

- The 19 exact skill boundaries, titles, descriptions, outcomes, and evidence requirements.
- The hard-versus-conditional prerequisite classification.
- The classification of `EXP_CALCULUS_S01 → EXP_COMPOSITE_S02` as conditional, leaving zero hard prerequisite edges.
- The interpretation that arbitrary `e^x = c` solutions requiring logarithms are outside the assessed U03 scope.
- The restriction of substitution equations to positive roots convertible without an unapproved logarithm.
- The restriction of substitution inequalities to boundaries convertible without an unapproved logarithm, or to cases where logarithmic values are supplied.
- The use of integer-power identities only, with arbitrary real powers left OPEN.
- The conditional reference to the U01 chain-rule skill.
- The separation of the three conditional general-base skills under D7.
- The exact comparative growth formulation and its fixed-`n`, `+infinity`, and sufficiently-large-positive-`x` conditions.
- The treatment of `a = 1` as a supplied constant case.

### 11.3 Not added

- No logarithmic function, logarithmic equation, or logarithmic inequality.
- No assumption that `a^x = e^(x ln a)` is available in U03.
- No general-base derivative, limit, equation, or inequality.
- No power series, integral, differential equation, or complex exponential content.
- No new official Arabic wording.
- No exercises, grading logic, or database records.
- No resolution of D7.

## 12. Unit boundaries and cross-unit notes

- U01 provides prior differentiation and limit tools. Only `FUN_DIFFERENTIATION_S06` is referenced conditionally; no cross-unit hard edge is proposed.
- U02 sequences are not a prerequisite for U03.
- U04 logarithms are not assumed. Equations requiring logarithms, and the conversion `a^x = e^(x ln a)`, remain OPEN.
- U05 function-study and graphical-transformation content is not imported into U03 mastery skills.
- The general-base topic may interact with U04 and D7; its final placement remains OPEN.
- No cross-unit hard prerequisite and no database prerequisite row are created.

## 13. Arabic terminology status

- The U03 Arabic title `الدالة الأسية الطبيعية` is a provisional proposal. It is not officially verified.
- All Arabic skill titles are provisional proposals.
- Terms requiring mathematics and curriculum review include `الدالة الأسية الطبيعية`, `الأساس`, `الرتابة الصارمة`, `النمو المقارن`, `السلوك عند اللانهاية`, `المتراجحة الأسية`, and `التعويض الأسّي`.
- No official Arabic curriculum wording is claimed.

## 14. Ambiguities and review items

| ID | Item | Status |
|---|---|---|
| A-01 | U03 Arabic title, unit wording, and official terminology | OPEN |
| A-02 | Arabic skill titles and descriptions | PROVISIONAL |
| A-03 | Official curriculum verification | OPEN |
| A-04 | D7: inclusion and placement of `EXP_GENERAL_BASE` | OPEN |
| A-05 | Exact definition of `exp` used by the curriculum | OPEN |
| A-06 | Whether arbitrary real-power identities belong to U03 or U04 | OPEN |
| A-07 | Whether arbitrary `e^x = c` solutions requiring logarithms belong to U03 or U04, including substitution roots and interval boundaries that require logarithms | OPEN |
| A-08 | Scope of general-base derivatives, limits, equations, and inequalities | OPEN under D7 |
| A-09 | Cross-unit status of the U01 chain-rule skill | OPEN; conditional reference only |
| A-10 | Exact comparative growth statement, exponent conditions, and direction | OPEN; standard formulation proposed |
| A-11 | Treatment of `a = 1` in general-base work | OPEN; constant case treated only when supplied |
| A-12 | Difficulty-scale mapping | PROVISIONAL |
| A-13 | Final teaching order | OPEN |
| A-14 | Whether any composite function study should be a separate U03 skill | PROVISIONAL; composite assessments excluded from mastery skills |
| A-15 | Relationship between `a^x` and `e^(x ln a)` | OPEN under D7 and U04 |

## 15. Provenance register

### 15.1 Topic provenance

| Topic | Topic label | Provenance | Status |
|---|---|---|---|
| `EXP_DEFINITION` | Definition and properties | `user_supplied_provisional` | PROVISIONAL BASELINE |
| `EXP_CALCULUS` | Exponential calculus | `user_supplied_provisional` | PROVISIONAL BASELINE |
| `EXP_COMPOSITE` | Exponential composite functions | `user_supplied_provisional` | PROVISIONAL BASELINE |
| `EXP_EQUATIONS` | Exponential equations and inequalities | `user_supplied_provisional` | PROVISIONAL BASELINE |
| `EXP_GENERAL_BASE` | General-base exponentials | `user_supplied_provisional` | CONDITIONAL (D7) |

### 15.2 Skill provenance

Every skill below has provenance `proposed_inferred_from_user_supplied_provisional`.

| Skill code | Topic | Provenance |
|---|---|---|
| `EXP_DEFINITION_S01` | `EXP_DEFINITION` | `proposed_inferred_from_user_supplied_provisional` |
| `EXP_DEFINITION_S02` | `EXP_DEFINITION` | `proposed_inferred_from_user_supplied_provisional` |
| `EXP_DEFINITION_S03` | `EXP_DEFINITION` | `proposed_inferred_from_user_supplied_provisional` |
| `EXP_DEFINITION_S04` | `EXP_DEFINITION` | `proposed_inferred_from_user_supplied_provisional` |
| `EXP_CALCULUS_S01` | `EXP_CALCULUS` | `proposed_inferred_from_user_supplied_provisional` |
| `EXP_CALCULUS_S02` | `EXP_CALCULUS` | `proposed_inferred_from_user_supplied_provisional` |
| `EXP_CALCULUS_S03` | `EXP_CALCULUS` | `proposed_inferred_from_user_supplied_provisional` |
| `EXP_CALCULUS_S04` | `EXP_CALCULUS` | `proposed_inferred_from_user_supplied_provisional` |
| `EXP_COMPOSITE_S01` | `EXP_COMPOSITE` | `proposed_inferred_from_user_supplied_provisional` |
| `EXP_COMPOSITE_S02` | `EXP_COMPOSITE` | `proposed_inferred_from_user_supplied_provisional` |
| `EXP_COMPOSITE_S03` | `EXP_COMPOSITE` | `proposed_inferred_from_user_supplied_provisional` |
| `EXP_COMPOSITE_S04` | `EXP_COMPOSITE` | `proposed_inferred_from_user_supplied_provisional` |
| `EXP_EQUATIONS_S01` | `EXP_EQUATIONS` | `proposed_inferred_from_user_supplied_provisional` |
| `EXP_EQUATIONS_S02` | `EXP_EQUATIONS` | `proposed_inferred_from_user_supplied_provisional` |
| `EXP_EQUATIONS_S03` | `EXP_EQUATIONS` | `proposed_inferred_from_user_supplied_provisional` |
| `EXP_EQUATIONS_S04` | `EXP_EQUATIONS` | `proposed_inferred_from_user_supplied_provisional` |
| `EXP_GENERAL_BASE_S01` | `EXP_GENERAL_BASE` | `proposed_inferred_from_user_supplied_provisional` |
| `EXP_GENERAL_BASE_S02` | `EXP_GENERAL_BASE` | `proposed_inferred_from_user_supplied_provisional` |
| `EXP_GENERAL_BASE_S03` | `EXP_GENERAL_BASE` | `proposed_inferred_from_user_supplied_provisional` |

## 16. What this document does not authorize

This document does not authorize:

- creating database skill rows;
- creating `topic_skills` rows;
- creating `skill_prerequisites` rows;
- creating seed data;
- changing migrations or schema;
- changing backend, frontend, APIs, or grading logic;
- creating exercises or mastery calculations;
- beginning U01, U02, U04–U11, or any other unit;
- publishing curriculum content;
- claiming official curriculum verification;
- resolving D7;
- treating `EXP_GENERAL_BASE` as confirmed curriculum content.

The next step requires separate approval.

## 17. Change log

| Date | Change |
|---|---|
| 2026-11-14 | Created the initial U03 provisional skill decomposition proposal with 19 skills across four provisional topics and one D7-conditional topic. |
| 2026-11-14 | Recorded topic provenance as `user_supplied_provisional` and skill provenance as `proposed_inferred_from_user_supplied_provisional`. |
| 2026-11-14 | Preserved D7 as OPEN for `EXP_GENERAL_BASE`; excluded logarithmic conversion, general-base calculus, and general-base equations from assessed scope. |
| 2026-11-14 | Added one hard prerequisite, conditional guidance, mathematical review notes, composite-assessment boundaries, and OPEN review items. |
| 2026-11-14 | Mathematics-review revision: restricted `EXP_EQUATIONS_S03` to positive roots convertible without an unapproved logarithm and `EXP_EQUATIONS_S04` to boundaries convertible without logarithms or supplied logarithmic values; both preserve general logarithm-dependent cases as OPEN. |
| 2026-11-14 | Reclassified `EXP_CALCULUS_S01 → EXP_COMPOSITE_S02` from hard to conditional because the outer derivative rule may be supplied directly; the hard graph now has zero edges and the conditional graph has 21 references. |
| 2026-11-14 | Made the `EXP_CALCULUS_S04` conditions explicit: fixed real `n`, `x -> +infinity`, and sufficiently large positive `x`; official scope remains OPEN. |
