# U01 Skill Decomposition Proposal

## 1. Document status

- **Status:** Owner-approved provisional skill decomposition — documentation only
- **Unit:** U01 — عموميات على الدوال والنهايات
- **Scope:** U01 only
- **Official verification:** OPEN — not independently verified as an official syllabus
- **Arabic titles:** PROVISIONAL — pending curriculum terminology review
- **Provenance:** `proposed_inferred_from_user_supplied_provisional` for every skill
- **Database seeding:** NOT AUTHORIZED
- **Skill prerequisite edges:** NOT CREATED in the database
- **U02 and later units:** NOT STARTED

This document records the approved provisional decomposition of U01 into 30 skills. It does not create skills, seed data, database rows, prerequisite edges, APIs, grading logic, or exercises.

## 2. Sources and scope

Source documents:

- `docs/curriculum/Tutorly_provisional_curriculum_inventory.md`
- `docs/curriculum/Tutorly_provisional_curriculum_review.md`

Included topics:

- `FUN_LIMITS`
- `FUN_CONTINUITY`
- `FUN_DIFFERENTIATION`
- `FUN_CALCULUS_STUDY`

Excluded:

- U02–U11.
- U05 skill decomposition.
- Conditional curriculum topics.
- Official Arabic curriculum wording.
- Database seeds and migration changes.
- Exercise, grading, and mastery implementation.

## 3. Approved review decisions

| ID | Decision | Status |
|---|---|---|
| DEC-01 | Accept the 30 proposed skills as a provisional decomposition | CONFIRMED |
| DEC-02 | Keep all four U01 topics and their proposed skill codes | CONFIRMED |
| DEC-03 | Keep one-sided limit calculation separate from determining limit existence | CONFIRMED |
| DEC-04 | Keep comparison and squeeze theorems separate | CONFIRMED |
| DEC-05 | Keep horizontal and vertical asymptotes separate | CONFIRMED |
| DEC-06 | Keep concavity and inflection points separate | CONFIRMED |
| DEC-07 | Keep `FUN_DIFFERENTIATION_S01` as one skill until an approved function-family list exists | CONFIRMED |
| DEC-08 | Treat comprehensive function-study and variation-table exercises as composite assessments, not individual mastery skills | CONFIRMED |
| DEC-09 | Preserve the distinction between hard and conditional prerequisites | CONFIRMED |
| DEC-10 | Conditional prerequisites are documentation only and must not become database prerequisite edges | CONFIRMED |
| DEC-11 | Do not present composition of continuous functions as confirmed curriculum content in `FUN_CONTINUITY_S03` unless explicitly supported; mark it for review | CONFIRMED |
| DEC-12 | Keep Arabic titles and descriptions provisional | CONFIRMED |
| DEC-13 | Preserve all U01/U05 ambiguities | CONFIRMED |
| DEC-14 | Keep provenance as `proposed_inferred_from_user_supplied_provisional` | CONFIRMED |

## 4. Status conventions

### 4.1 Provenance

Every proposed skill has provenance:

`proposed_inferred_from_user_supplied_provisional`

### 4.2 Basis labels

| Label | Meaning |
|---|---|
| `D` | Directly documented in the provisional U01 curriculum content |
| `I` | Educational interpretation required to make the ability observable and assessable |
| `D/I` | Documented ability with an interpretive formulation or method |

### 4.3 Prerequisite classifications

| Classification | Meaning | Database treatment |
|---|---|---|
| Hard prerequisite | The student must demonstrate the prerequisite ability | Candidate for a future reviewed `skill_prerequisites` edge; not created in this task |
| Conditional prerequisite | Needed only when the exercise does not supply the required result | Documentation only; must not be represented as a database prerequisite edge |
| May be supplied | The exercise may provide the limit, derivative, monotonicity, continuity, or asymptote data | Not a prerequisite |

No prerequisite edge of either kind is created by this document.

## 5. Skill design rules

Each skill:

- represents one specific observable ability;
- is independently assessable;
- is small enough for separate mastery evidence;
- uses one action verb;
- does not combine unrelated abilities;
- belongs to exactly one U01 topic;
- has a proposed difficulty label;
- has the required provenance.

Difficulty labels are `beginner`, `intermediate`, or `advanced`. They are proposed pedagogical judgments and are not mapped to the provisional numeric database scale in this document.

## 6. Revised skill decomposition

### 6.1 `FUN_LIMITS` — 12 skills

| Code | Arabic skill title proposal | Arabic description proposal | Difficulty | Hard prerequisite | Conditional prerequisite — documentation only | Basis |
|---|---|---|---|---|---|---|
| `FUN_LIMITS_S01` | حساب نهاية منتهية عند نقطة | أن يحسب التلميذ نهاية منتهية لدالة مألوفة عند نقطة باستعمال عمليات النهايات. | beginner | — | — | D |
| `FUN_LIMITS_S02` | حساب النهايات الجانبية عند نقطة أو طرف مجال | أن يحسب النهاية من اليمين والنهاية من اليسار عند نقطة أو عند طرف مجال. | beginner | — | — | D |
| `FUN_LIMITS_S03` | استنتاج وجود النهاية من النهايات الجانبية | أن يستنتج وجود النهاية عند نقطة أو عدم وجودها من تساوي النهايات الجانبية أو اختلافها. | intermediate | — | `FUN_LIMITS_S02` if one-sided limits are not supplied | D/I |
| `FUN_LIMITS_S04` | حساب النهاية عند اللانهاية | أن يحسب نهاية دالة عند اللانهاية. | intermediate | — | — | D |
| `FUN_LIMITS_S05` | تحديد النهاية اللانهائية عند نقطة | أن يحدد أن نهاية دالة عند نقطة أو طرف مجال لا نهائية، مع تحديد الإشارة عند الاقتضاء. | intermediate | — | `FUN_LIMITS_S02` if a one-sided analysis is required and not supplied | D |
| `FUN_LIMITS_S06` | رفع حالات عدم التعيين | أن يستعمل تحويلات جبرية مناسبة لرفع حالة عدم التعيين ثم يحسب النهاية. | intermediate | — | `FUN_LIMITS_S01` or `FUN_LIMITS_S04` depending on the limit location | D |
| `FUN_LIMITS_S07` | استعمال مبرهنة المقارنة لتبرير نهاية | أن يستعمل مبرهنة المقارنة لتبرير وجود نهاية أو حسابها. | advanced | — | `FUN_LIMITS_S01` or `FUN_LIMITS_S04` if the limits are not supplied | D |
| `FUN_LIMITS_S08` | استعمال مبرهنة الحصر لتبرير نهاية | أن يستعمل مبرهنة الحصر لتبرير وجود نهاية أو حسابها. | advanced | — | `FUN_LIMITS_S01` or `FUN_LIMITS_S04` if the limits are not supplied | D |
| `FUN_LIMITS_S09` | تحديد المستقيم المقارب الأفقي | أن يستنتج وجود مستقيم مقارب أفقي ومعادلته من نهاية الدالة عند اللانهاية. | intermediate | — | `FUN_LIMITS_S04` if the limit is not supplied | D |
| `FUN_LIMITS_S10` | تحديد المستقيم المقارب العمودي | أن يستنتج وجود مستقيم مقارب عمودي ومعادلته من نهاية لانهائية عند نقطة. | intermediate | — | `FUN_LIMITS_S05` if the infinite limit is not supplied | D |
| `FUN_LIMITS_S11` | تحديد المستقيم المقارب المائل | أن يحدد وجود مستقيم مقارب مائل ويحسب معادلته. | advanced | — | `FUN_LIMITS_S04` if the required limit is not supplied | D |
| `FUN_LIMITS_S12` | دراسة الوضع النسبي للمنحنى والمستقيم المقارب | أن يدرس إشارة الفرق بين الدالة والمستقيم المقارب لوصف وضع المنحنى بالنسبة إليه. | advanced | — | `FUN_LIMITS_S11` if the asymptote equation is not supplied | D/I |

### 6.2 `FUN_CONTINUITY` — 7 skills

| Code | Arabic skill title proposal | Arabic description proposal | Difficulty | Hard prerequisite | Conditional prerequisite — documentation only | Basis |
|---|---|---|---|---|---|---|
| `FUN_CONTINUITY_S01` | تحديد استمرارية دالة عند نقطة | أن يقارن نهاية دالة عند نقطة بقيمتها عندها، ويستنتج استمراريتها أو عدم استمراريتها. | beginner | — | `FUN_LIMITS_S01` or `FUN_LIMITS_S03` if the limit is not supplied | D |
| `FUN_CONTINUITY_S02` | تحديد استمرارية دالة على مجال | أن يدرس استمرارية دالة على مجال باستعمال الاستمرارية عند النقاط. | intermediate | `FUN_CONTINUITY_S01` | — | D |
| `FUN_CONTINUITY_S03` | تحديد استمرارية دالة ناتجة عن عمليات على دوال مستمرة | أن يستنتج استمرارية مجموع أو جداء أو خارج دوال مستمرة باستعمال عمليات الدوال المستمرة. | intermediate | — | `FUN_CONTINUITY_S01` or `FUN_CONTINUITY_S02` if component continuity is not supplied | D/I |
| `FUN_CONTINUITY_S04` | تطبيق مبرهنة القيم المتوسطة لإثبات وجود حل | أن يستعمل مبرهنة القيم المتوسطة لتبرير وجود حل لمعادلة من الشكل f(x)=k في مجال. | intermediate | — | `FUN_CONTINUITY_S02` if continuity on the interval is not supplied | D |
| `FUN_CONTINUITY_S05` | تبرير وحدانية حل باستعمال الرتابة | أن يستعمل رتابة دالة على مجال لتبرير وحدانية الحل. | advanced | — | `FUN_CALCULUS_STUDY_S01` if monotonicity is not supplied | D |
| `FUN_CONTINUITY_S06` | استعمال التنصيف لتقريب حل | أن يطبق خطوات التنصيف لتقريب حل معادلة انطلاقا من تغيير في الإشارة. | intermediate | — | `FUN_CONTINUITY_S04` if the sign-change justification is not supplied | D/I |
| `FUN_CONTINUITY_S07` | تحديد دالة عكسية لدالة مستمرة ورتيبة | أن يحدد وجود الدالة العكسية لدالة مستمرة ورتيبة على مجال، ويحدد خصائصها الأساسية. | advanced | — | `FUN_CONTINUITY_S02` and `FUN_CALCULUS_STUDY_S01` if continuity and monotonicity are not supplied | D |

**Review item — composition of continuous functions:** The inventory states “familiar functions and operations” but does not explicitly enumerate composition. `FUN_CONTINUITY_S03` therefore assesses sum, product, and quotient operations only. Composition of continuous functions is excluded from the confirmed description and remains OPEN for curriculum review. The exact operation set is also an educational interpretation of the documented term “operations.”

### 6.3 `FUN_DIFFERENTIATION` — 6 skills

| Code | Arabic skill title proposal | Arabic description proposal | Difficulty | Hard prerequisite | Conditional prerequisite — documentation only | Basis |
|---|---|---|---|---|---|---|
| `FUN_DIFFERENTIATION_S01` | حساب مشتقة دالة مألوفة | أن يحسب مشتقة دالة مألوفة باستعمال قواعد الاشتقاق. | beginner | — | — | D |
| `FUN_DIFFERENTIATION_S02` | تحديد معادلة المماس عند نقطة | أن يستعمل المشتقة لتحديد ميل المماس ومعادلته عند نقطة. | intermediate | — | `FUN_DIFFERENTIATION_S01` if the derivative is not supplied | D |
| `FUN_DIFFERENTIATION_S03` | حساب المشتقات الجانبية عند نقطة | أن يحسب المشتقة من اليمين والمشتقة من اليسار عند نقطة. | advanced | — | `FUN_DIFFERENTIATION_S01` if derivative expressions are not supplied, or `FUN_LIMITS_S02` if the definition is used | D |
| `FUN_DIFFERENTIATION_S04` | تحديد نصف المماس عند نقطة | أن يحدد نصف المماس من اليمين أو من اليسار عند نقطة انطلاقا من المشتقات الجانبية. | advanced | — | `FUN_DIFFERENTIATION_S03` if one-sided derivatives are not supplied | D |
| `FUN_DIFFERENTIATION_S05` | استعمال التقريب التآلفي | أن يستعمل التقريب التآلفي لدالة قرب نقطة لتقريب قيمة لها. | intermediate | — | `FUN_DIFFERENTIATION_S01` and `FUN_DIFFERENTIATION_S02` if derivative or tangent data are not supplied | D |
| `FUN_DIFFERENTIATION_S06` | اشتقاق دالة مركبة بقاعدة السلسلة | أن يطبق قاعدة السلسلة لحساب مشتقة دالة مركبة. | intermediate | `FUN_DIFFERENTIATION_S01` | — | D |

**Scope note for `FUN_DIFFERENTIATION_S01`:** This remains one foundational skill under DEC-07. It is limited to calculating one derivative for one familiar function per exercise. It is not split by function family because no approved function-family list exists.

### 6.4 `FUN_CALCULUS_STUDY` — 5 skills

| Code | Arabic skill title proposal | Arabic description proposal | Difficulty | Hard prerequisite | Conditional prerequisite — documentation only | Basis |
|---|---|---|---|---|---|---|
| `FUN_CALCULUS_STUDY_S01` | تحديد رتابة دالة على مجال | أن يستنتج اتجاه تغير دالة على مجال من إشارة مشتقتها. | intermediate | — | `FUN_DIFFERENTIATION_S01` if the derivative or its sign is not supplied | D |
| `FUN_CALCULUS_STUDY_S02` | تحديد القيم الحدية المحلية | أن يحدد القيم الحدية المحلية لدالة من تغير إشارة مشتقتها. | intermediate | — | `FUN_CALCULUS_STUDY_S01` or `FUN_DIFFERENTIATION_S01` if the sign table is not supplied | D |
| `FUN_CALCULUS_STUDY_S03` | تحديد اتجاه تقعر منحنى دالة | أن يحدد اتجاه تقعر منحنى دالة على مجال. | advanced | — | `FUN_DIFFERENTIATION_S01` if the required derivative data are not supplied | D/I |
| `FUN_CALCULUS_STUDY_S04` | تحديد نقاط انعطاف منحنى دالة | أن يحدد نقاط انعطاف منحنى دالة من تغير اتجاه التقعر. | advanced | `FUN_CALCULUS_STUDY_S03` | — | D/I |
| `FUN_CALCULUS_STUDY_S05` | تفسير الفروع اللانهائية والسلوك المقارب | أن يفسر الفروع اللانهائية وسلوك منحنى دالة عند حدود مجاله أو عند اللانهاية بالاعتماد على النهايات والمستقيمات المقاربة. | advanced | — | `FUN_LIMITS_S04`, `FUN_LIMITS_S05`, `FUN_LIMITS_S09`, `FUN_LIMITS_S10`, or `FUN_LIMITS_S11` if the relevant data are not supplied | D/I |

## 7. Topic-to-skill mapping

| Topic | Skill codes | Count |
|---|---|---|
| `FUN_LIMITS` | `FUN_LIMITS_S01`–`FUN_LIMITS_S12` | 12 |
| `FUN_CONTINUITY` | `FUN_CONTINUITY_S01`–`FUN_CONTINUITY_S07` | 7 |
| `FUN_DIFFERENTIATION` | `FUN_DIFFERENTIATION_S01`–`FUN_DIFFERENTIATION_S06` | 6 |
| `FUN_CALCULUS_STUDY` | `FUN_CALCULUS_STUDY_S01`–`FUN_CALCULUS_STUDY_S05` | 5 |

**Total:** 30 skills.

No skill belongs to more than one topic. No skill is assigned to U05 or any other unit.

## 8. Prerequisite graph

### 8.1 Hard prerequisites

| Prerequisite skill | Dependent skill | Rationale |
|---|---|---|
| `FUN_CONTINUITY_S01` | `FUN_CONTINUITY_S02` | Interval continuity is built from pointwise continuity |
| `FUN_DIFFERENTIATION_S01` | `FUN_DIFFERENTIATION_S06` | Applying the chain rule requires differentiating the component functions |
| `FUN_CALCULUS_STUDY_S03` | `FUN_CALCULUS_STUDY_S04` | An inflection point is identified through a change in concavity direction |

These three hard edges are the only proposed mastery prerequisites. They are not created in the database by this document.

### 8.2 Conditional prerequisites — documentation only

Conditional prerequisites are listed in the skill tables. They are not database edges and must not be seeded into `skill_prerequisites`.

The conditional dependency groups are:

- `FUN_LIMITS_S02` → `FUN_LIMITS_S03`, `FUN_LIMITS_S05`
- `FUN_LIMITS_S01` or `FUN_LIMITS_S04` → `FUN_LIMITS_S06`, `FUN_LIMITS_S07`, `FUN_LIMITS_S08`
- `FUN_LIMITS_S04` → `FUN_LIMITS_S09`, `FUN_LIMITS_S11`
- `FUN_LIMITS_S05` → `FUN_LIMITS_S10`
- `FUN_LIMITS_S11` → `FUN_LIMITS_S12`
- `FUN_LIMITS_S01` or `FUN_LIMITS_S03` → `FUN_CONTINUITY_S01`
- `FUN_CONTINUITY_S01` or `FUN_CONTINUITY_S02` → `FUN_CONTINUITY_S03`
- `FUN_CONTINUITY_S02` → `FUN_CONTINUITY_S04`, `FUN_CONTINUITY_S07`
- `FUN_CALCULUS_STUDY_S01` → `FUN_CONTINUITY_S05`, `FUN_CONTINUITY_S07`
- `FUN_CONTINUITY_S04` → `FUN_CONTINUITY_S06`
- `FUN_DIFFERENTIATION_S01` → `FUN_DIFFERENTIATION_S02`, `FUN_DIFFERENTIATION_S05`, `FUN_CALCULUS_STUDY_S01`, `FUN_CALCULUS_STUDY_S03`
- `FUN_DIFFERENTIATION_S01` or `FUN_LIMITS_S02` → `FUN_DIFFERENTIATION_S03`
- `FUN_DIFFERENTIATION_S03` → `FUN_DIFFERENTIATION_S04`
- `FUN_DIFFERENTIATION_S01` and `FUN_DIFFERENTIATION_S02` → `FUN_DIFFERENTIATION_S05`
- `FUN_CALCULUS_STUDY_S01` or `FUN_DIFFERENTIATION_S01` → `FUN_CALCULUS_STUDY_S02`
- `FUN_LIMITS_S04`, `FUN_LIMITS_S05`, `FUN_LIMITS_S09`, `FUN_LIMITS_S10`, or `FUN_LIMITS_S11` → `FUN_CALCULUS_STUDY_S05`

An “or” dependency means the exercise may supply one of the alternatives; it does not create multiple hard prerequisites.

### 8.3 Graph verification rules

- The hard graph contains three edges and is acyclic.
- The conditional graph contains only forward dependencies and is acyclic.
- Every listed prerequisite reference points to an existing proposed skill.
- No skill references itself.
- No cross-unit prerequisite is proposed.
- No U05 skill is referenced.

## 9. Composite assessments

Comprehensive function-study and variation-table exercises are composite assessments, not individual mastery skills.

A composite assessment may draw evidence from:

- `FUN_LIMITS_S04` — limits at infinity;
- `FUN_LIMITS_S05` — infinite limits at a finite point;
- `FUN_LIMITS_S09` — horizontal asymptotes;
- `FUN_LIMITS_S10` — vertical asymptotes;
- `FUN_LIMITS_S11` — oblique asymptotes;
- `FUN_CALCULUS_STUDY_S01` — monotonicity;
- `FUN_CALCULUS_STUDY_S02` — local extrema;
- `FUN_CALCULUS_STUDY_S03` — concavity;
- `FUN_CALCULUS_STUDY_S04` — inflection points;
- `FUN_CALCULUS_STUDY_S05` — infinite branches.

Rules:

- A composite exercise must not update a single “complete function study” mastery skill.
- Evidence must be attributed to the component skills actually assessed.
- No composite skill code is created by this document.
- Composite exercises must not assess U01/U05 overlapping content unless that overlap is separately approved.
- No database representation of composite assessments is authorized.

## 10. Documented content versus educational interpretation

### 10.1 Directly documented in U01

- finite and one-sided limits;
- limits at interval endpoints and infinity;
- infinite limits;
- limit operations and indeterminate forms;
- comparison and squeeze theorems;
- horizontal, vertical and oblique asymptotes;
- relative position of a curve and its asymptote;
- continuity at a point and on an interval;
- operations on continuous functions;
- Intermediate Value Theorem;
- existence and uniqueness of solutions where justified;
- bisection;
- inverse of a continuous monotone function;
- derivative and tangent;
- one-sided differentiability and half-tangents;
- affine approximation;
- chain rule;
- monotonicity and extrema;
- concavity/convexity and inflection points;
- infinite branches and complete function study.

### 10.2 Educational interpretations in this proposal

- Exact Arabic skill titles and descriptions.
- Atomic skill boundaries and granularity.
- Treating existence from one-sided limits as a separate skill.
- Using the sign of the difference to study relative position.
- Specifying bisection steps and sign-change procedure.
- Using derivative-sign and second-derivative reasoning for function study.
- Treating concavity and inflection as separate skills.
- Treating the variation table as a composite assessment.
- The hard-versus-conditional prerequisite classification.
- The exact sum/product/quotient operation set in `FUN_CONTINUITY_S03`.

### 10.3 Not added

- No new function families.
- No new theorems.
- No sequence content.
- No U05 skills.
- No conditional-topic skills.
- No official Arabic curriculum wording.
- No exercises, grading logic, or database records.

## 11. U01/U05 overlap

The following overlapping items remain documented but are not decomposed into U01 mastery skills:

- even/odd functions;
- symmetry centre/axis;
- relative positions of curves;
- parameter-based graphical discussion.

Clarifications:

- `FUN_LIMITS_S12` addresses a curve versus its own asymptote, not curve-versus-curve relative positions.
- `FUN_CALCULUS_STUDY_S05` addresses infinite branches, not U05 graphical transformations or parameter discussions.
- Composite function-study assessments must not include unresolved overlap content.

The U01/U05 overlap remains OPEN.

## 12. Arabic title and terminology status

- The U01 title supplied in the implementation request is `عموميات على الدوال والنهايات`.
- This title is provisional and not officially verified.
- The title does not explicitly mention continuity or differentiation, although both are in the U01 scope.
- All skill titles and descriptions are provisional Arabic proposals.
- Terms requiring mathematics and curriculum review include `نصف المماس`, `التقريب التآلفي`, `الفروع اللانهائية`, and `اتجاه التقعر`.
- Composition of continuous functions remains excluded from `FUN_CONTINUITY_S03` pending review.

## 13. Ambiguities and review items

| ID | Item | Status |
|---|---|---|
| A-01 | U01 Arabic title and official wording | OPEN |
| A-02 | Arabic skill titles and descriptions | PROVISIONAL |
| A-03 | `FUN_DIFFERENTIATION_S01` breadth across familiar functions | ACCEPTED as one skill until an approved function-family list exists |
| A-04 | `FUN_LIMITS_S03` as a separate mastery skill | PROVISIONAL |
| A-05 | Comparison and squeeze as separate skills | CONFIRMED by DEC-04 |
| A-06 | Horizontal and vertical asymptotes as separate skills | CONFIRMED by DEC-05 |
| A-07 | Concavity and inflection as separate skills | CONFIRMED by DEC-06 |
| A-08 | Composition of continuous functions in `FUN_CONTINUITY_S03` | OPEN; excluded from confirmed description |
| A-09 | Bisection precision and stopping criteria | OPEN |
| A-10 | Required depth of inverse-function work | OPEN |
| A-11 | Hard versus conditional prerequisite model | CONFIRMED by DEC-09; subject to later subject-expert review |
| A-12 | U01/U05 overlap | OPEN |
| A-13 | Official curriculum verification | OPEN |
| A-14 | Final teaching order | OPEN |

## 14. Provenance register

Every skill below has provenance `proposed_inferred_from_user_supplied_provisional`.

| Skill code | Provenance |
|---|---|
| `FUN_LIMITS_S01` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_LIMITS_S02` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_LIMITS_S03` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_LIMITS_S04` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_LIMITS_S05` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_LIMITS_S06` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_LIMITS_S07` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_LIMITS_S08` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_LIMITS_S09` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_LIMITS_S10` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_LIMITS_S11` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_LIMITS_S12` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_CONTINUITY_S01` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_CONTINUITY_S02` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_CONTINUITY_S03` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_CONTINUITY_S04` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_CONTINUITY_S05` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_CONTINUITY_S06` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_CONTINUITY_S07` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_DIFFERENTIATION_S01` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_DIFFERENTIATION_S02` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_DIFFERENTIATION_S03` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_DIFFERENTIATION_S04` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_DIFFERENTIATION_S05` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_DIFFERENTIATION_S06` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_CALCULUS_STUDY_S01` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_CALCULUS_STUDY_S02` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_CALCULUS_STUDY_S03` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_CALCULUS_STUDY_S04` | `proposed_inferred_from_user_supplied_provisional` |
| `FUN_CALCULUS_STUDY_S05` | `proposed_inferred_from_user_supplied_provisional` |

## 15. What this document does not authorize

This document does not authorize:

- creating database skill rows;
- creating `topic_skills` rows;
- creating `skill_prerequisites` rows;
- creating seed data;
- changing migrations or schema;
- changing backend, frontend, APIs, or grading logic;
- creating exercises or mastery calculations;
- beginning U02 or any other unit;
- publishing curriculum content;
- claiming official curriculum verification.

The next step requires separate approval.
