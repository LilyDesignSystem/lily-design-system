# Lessons from openEHR (planned work)

## Summary

A review on 2026-11-16 of [openEHR](https://openehr.org/), the open, vendor-neutral standard for health records: its
Reference Model (data types, data structures, the record and its entries, versioning and audit), its archetype and template
layer with the Clinical Knowledge Manager, and the forms people build on it (Medblocks UI's web components, which render
openEHR web templates). openEHR is a data standard, not a user interface. Its value to Lily is that it states, more exactly than
FHIR, what a clinical value can be and how it can be absent, and that its archetypes have driven generated clinical forms for
many years. The lessons are small display contracts Lily lacks (partial dates, durations, proportions, the "not applicable"
absence, a record's provenance and signature state, whose record an entry is about), an "add another" form pattern that
repeating archetype items need, and a guide table from openEHR data types to Lily components. Lily still ships no clinical
logic, no clinical content and no form generator. Nothing here is built yet: each item is an open acceptance criterion, with
tasks in [tasks.md](../../../tasks.md#phase-29--lessons-from-openehr-2026-11-16).

## Scope

### In scope

- The openEHR Reference Model's data types and absence codes, as display and input contracts for Lily components.
- The record model's provenance (composer, committer, versions, lifecycle state, attestation, feeder audit) as a display contract.
- Repeating and optional items in archetypes, as a form pattern.
- The mapping from openEHR data types to Lily components, for adopters building openEHR forms by hand.

### Explicitly out of scope

- **A form generator.** Rendering a web template into a form is a data-driven program over someone else's model (Medblocks'
  `mb-auto-form`, the Better forms SDK). It belongs in an adopter's code or a separate project, not the headless layer.
- **Archetypes and templates.** The Clinical Knowledge Manager's models are clinical content under their own licence and
  governance; Lily bundles none (as [healthcare-ui](../../healthcare-ui/index.md) declines all clinical content).
- **AQL, the REST API, EHRbase and other platforms.** Data fetching and persistence are the consumer's
  ([headless](../../headless/index.md), behaviour boundaries).
- **Clinical logic**: validating a value against an archetype's constraints, computing a score from ordinals, unit conversion.

## Principles and rules

- **openEHR and FHIR are both sources, neither is the model.** A Lily component takes plain values and consumer words. The
  adopter's code maps openEHR or FHIR to them; Lily documents the mapping, as it does for FHIR in the
  [healthcare guide](../../../docs/patterns/healthcare/index.md).
- **Absence has a reason, and the reason is shown.** openEHR's `ELEMENT.null_flavour` is required whenever a value is missing:
  `253|unknown|`, `271|no information|`, `272|masked|`, `273|not applicable|`, with optional free-text `null_reason`. Lily's
  record lists and `observation-view` already refuse a blank; "not applicable" is the one reason they cannot say.
- **Precision is part of the value.** A date known only to the year, a result "<5", a titre of 1:128 and "about 3 days" are
  different values from 2019-01-01, 5, 0.0078 and "3 days". Display must never add precision the record does not have.
- **Who and whose.** An entry's `subject` may be someone other than the patient (`PARTY_RELATED`: a parent's history, a fetus);
  an entry's author (`composer`) may differ from who committed it, and from the system it came from (`FEEDER_AUDIT`). A screen
  that hides these can attribute a relative's diagnosis, or an unsigned draft, to the patient.

## Findings, by area

### Data types

The Reference Model's data types ([data types](https://specifications.openehr.org/releases/RM/latest/data_types.html)), against Lily:

| openEHR type                            | What it is                                                                                                         | Lily today                                                        |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| `DV_TEXT` / `DV_CODED_TEXT`             | Text, optionally `markdown`, with a language and term mappings (`=`, `<`, `>`, `?`) to other terminologies         | Coded values pattern (P28-T9); `markdown-editor` writes Markdown  |
| `DV_QUANTITY`                           | Magnitude, UCUM units, precision, `magnitude_status` (`=`, `<`, `>`, `<=`, `>=`, `~`), accuracy                    | `formatQuantity` with a comparator (P28-T4); no `~`; no accuracy  |
| `DV_ORDERED` ranges and `normal_status` | A normal range plus `other_reference_ranges`, each with a `meaning`; `normal_status` `HHH` … `N` … `LLL`           | `observation-view` has one `-range` and FHIR interpretation codes |
| `DV_ORDINAL`, `DV_SCALE`                | A score with a symbol: Glasgow Coma Scale "4, Opens eyes spontaneously"; `DV_SCALE` allows real values (Borg CR10) | `radio-group`, `numeric-rating-scale-picker`; no ordinal pattern  |
| `DV_COUNT`                              | A whole count with no unit (number of pregnancies)                                                                 | `number-input`                                                    |
| `DV_PROPORTION`                         | Numerator and denominator of kind ratio, unitary, percent, fraction or integer fraction (titre 1:128, 1 1/2)       | none                                                              |
| `DV_DATE`, `DV_TIME`, `DV_DATE_TIME`    | ISO 8601, **with partial forms**: a year alone, or a year and month                                                | `date-field`, `date-time-view`: full dates only                   |
| `DV_DURATION`                           | ISO 8601 duration, possibly negative                                                                               | `age-view` for ages only                                          |
| `DV_INTERVAL`                           | A range of any ordered type, with bounds that may be open or excluded                                              | `date-range` for dates only                                       |
| `DV_BOOLEAN`                            | True yes/no, not a substitute for a coded list                                                                     | `checkbox-input`                                                  |
| `DV_IDENTIFIER`                         | An id with issuer, assigner and type                                                                               | the 164 national identifier components                            |
| `DV_MULTIMEDIA`                         | Media with `alternate_text`, a thumbnail and a media type                                                          | `figure`, `picture`, `image`                                      |
| `DV_STATE`                              | A state in an archetype-defined state machine, with `is_terminal`                                                  | `status-tag`                                                      |
| `DV_PERIODIC_TIME_SPECIFICATION`        | Repeating times ("twice daily", "before meals")                                                                    | `medication-view` frequency as consumer text                      |

### Structures and events

`ELEMENT` holds a value or a null flavour; `CLUSTER` groups them; `ITEM_TABLE` has key columns ("left arm", "right arm").
An `OBSERVATION` holds a `HISTORY` of events: a `POINT_EVENT` at a time, or an `INTERVAL_EVENT` with a `width` and a
`math_function` (`146|mean|`, `144|maximum|`, `145|minimum|`, `147|change|`), so "mean over 24 hours" is a different value from
a single reading. An observation's `state` (position, exertion) and `protocol` (cuff size, method) qualify the reading
([data structures](https://specifications.openehr.org/releases/RM/latest/data_structures.html)). Lily's observations chart page
(P27-T9) plots point readings only and has nowhere to say "mean, 24 hours" or "sitting".

### Entries and the Instruction State Machine

Entries are `OBSERVATION`, `EVALUATION` (opinions: diagnoses, risks, goals), `INSTRUCTION` (orders, with a required narrative
and an expiry time), `ACTION` (what was done, with an `ISM_TRANSITION`) and `ADMIN_ENTRY`. An instruction's activities move
through the Instruction State Machine: `INITIAL`, `PLANNED`, `POSTPONED`, `SCHEDULED`, `ACTIVE`, `SUSPENDED`, `COMPLETED`,
`CANCELLED`, `ABORTED`, `EXPIRED` (three terminal, `EXPIRED` pseudo-terminal), each transition optionally with a
local `careflow_step` name and reasons ([EHR model](https://specifications.openehr.org/releases/RM/latest/ehr.html)). Lily's
`medication-record-list-item` and `procedure-record-list-item` show a FHIR status as consumer words; nothing shows the steps
that led there.

### Provenance, versions and signatures

Every change is a new version, never an edit: `ORIGINAL_VERSION` has a lifecycle state (complete, incomplete, deleted) and
`AUDIT_DETAILS` (system, time committed, change type such as `249|creation|` or `523|deleted|`, committer). An `ATTESTATION`
is a signature added to a version: a reason, `is_pending`, an optional proof. A `COMPOSITION` names its `composer`, the
clinician responsible, who may not be the committer; `FEEDER_AUDIT` records the originating system of imported data
([common model](https://specifications.openehr.org/releases/RM/latest/common.html)). A clinician needs to see, beside a
note or result, whether it is a draft, signed, pending signature, amended or imported, and who wrote it. Lily's
`review-date`, `timeline-list` and `diff` cover parts of this; nothing composes them.

### Forms built on archetypes

Medblocks UI ships web components for openEHR forms: `mb-form`, `mb-context`, `mb-quantity` with `mb-unit` children (each unit
its own `min` and `max`), and `mb-auto-form`, which renders a web template and exports a FLAT composition
([Medblocks UI](https://medblocks.com/docs/medblocks-ui)). Its own docs say generated forms become long and repetitive past
about ten fields, and recommend hand-built forms from components for real use. Archetypes are full of optional and repeating
items (`occurrences 0..*`: several diagnoses, several doses), which a hand-built form needs an "add another" control for.
Lily has the inputs; it lacks a quantity-with-unit composition and a repeatable group.

## Proposals and decisions

| Item                                               | Lily today                                                                | Decision                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Partial dates                                   | `date-time-view` and `date-field` take full dates                         | **Adopt.** `formatPartialDate(iso, locale)` in `shared/clinical-format.ts` formats `2019`, `2019-03` or `2019-03-14` with only the fields given (`Intl.DateTimeFormat`), and `date-time-view` accepts a partial `datetime` (a year or a month is a valid HTML `<time>` value). `date-field` gains `precision` (`day`, `month`, `year`) so "onset: March 2019" can be entered without inventing a day. |
| 2. "Not applicable" and "unknown"                  | statuses `none-known`, `not-recorded`, `unavailable`, `omitted`, `masked` | **Adopt** `not-applicable` in the record lists' status and in `observation-view`, with consumer words (a pregnancy test for a man, a section that cannot apply). Map `unknown` and `no information` in the guide; no new value, since `not-recorded` and `unavailable` already say them.                                                                                                              |
| 3. Approximate quantities                          | comparators `<`, `<=`, `>=`, `>`                                          | **Adopt** `~` as a fifth comparator in `formatQuantity` (and the C# port), written `≈` before the number: "about 3 kg" must not read "3 kg".                                                                                                                                                                                                                                                          |
| 4. `formatProportion`                              | none                                                                      | **Adopt as a function, not a component.** `formatProportion(numerator, denominator, kind, locale)` writes `1:128`, `1/2`, `1 1/2`, `45%` or a unitary value; its output goes into `observation-view`'s value. No arithmetic beyond what the kind defines.                                                                                                                                             |
| 5. `duration-view`                                 | `age-view` only                                                           | **Adopt.** A `<time datetime="P3DT4H">` showing an ISO 8601 duration in the units the consumer chooses, words from `Intl.DurationFormat`. Useful outside healthcare (a meeting, a delay); shares its parser with `age-view`.                                                                                                                                                                          |
| 6. Named reference ranges and critical flags       | one `-range` part; FHIR interpretation codes                              | **Adopt** a `ranges` list on `observation-view` (`{ label, text }`, each a `-range` part, so "Normal 3.5–5.0; Critical below 2.5" is two ranges), and document `normal_status` `HHH`/`LLL` as FHIR `HU`/`LU` (or `AA`) in the guide's mapping table.                                                                                                                                                  |
| 7. Interval events, state and protocol             | point readings only                                                       | **Adopt as a pattern.** In the guide and on the observations chart page: a reading's time, and for an interval its width and function ("Mean, 24 hours"), and its state and protocol ("Sitting, large cuff") as visible text beside the value, never only in a tooltip.                                                                                                                               |
| 8. Ordinal scores                                  | `radio-group`, `numeric-rating-scale-picker`                              | **Adopt as a pattern, not a component.** Each option's label carries both the number and its words ("4: Opens eyes spontaneously"); a total, if any, is the consumer's sum shown with `early-warning-score-view`-style words. The Glasgow Coma Scale's own wording is the adopter's to license.                                                                                                       |
| 9. Whose record                                    | items assume the patient                                                  | **Adopt** a `subjectLabel` part on `record-list-item` and the domain items ("Mother", "Fetus 1"), rendered before the item's text, and a guide rule: an entry about someone else always says so in words.                                                                                                                                                                                             |
| 10. `record-provenance-view` (maintainer decision) | `review-date`, `timeline-list`, `diff`                                    | **Consider.** A `<dl>` with consumer-worded parts: author, committer, time, source system, version, and a signature state (`signed`, `pending`, `unsigned`, `amended`, `deleted`) as `data-attestation`. Safety-relevant (an unsigned draft must not read as signed). Build only if an adopter needs it on more than one screen; otherwise a documented composition of `summary-list`.                |
| 11. Instruction steps                              | a status only                                                             | **Adopt as a pattern**: an order's history as a `timeline-list`, one item per action with its state, careflow step and reason, the current state also on the item; the ISM states mapped to FHIR request statuses in the guide.                                                                                                                                                                       |
| 12. `quantity-input-div`                           | `measurement-instance-input`, `measurement-unit-input`                    | **Adopt.** A `<div>` holding a number input and a unit `<select>` (or fixed unit text when there is one), labelled together by a `fieldset` legend or `aria-labelledby`; each unit has its own `min`, `max` and `step`, which change with the unit. The value is `{ magnitude, unit }`; no conversion.                                                                                                |
| 13. `repeatable-fieldset` (maintainer decision)    | none                                                                      | **Consider.** The "add another" pattern (GOV.UK and the UK Ministry of Justice publish one): a list of identical `fieldset`s with an add button and a remove button per item, focus moved to the new item's first field and back after removal, items renumbered in the legends with a consumer template. Needed for any archetype item with `0..*` occurrences, and outside healthcare.              |
| 14. openEHR to Lily mapping                        | FHIR mapping only (P28-T8)                                                | **Adopt** a second table in the healthcare guide: each data type above to its Lily input and view, the null flavours to Lily statuses, `normal_status` to interpretation codes, and the ISM states to Lily words.                                                                                                                                                                                     |
| A form generator from web templates                | —                                                                         | **Decline.** Program logic over someone else's model; Medblocks and the Better SDK exist. The mapping table (item 14) is what an adopter needs to build one.                                                                                                                                                                                                                                          |
| Archetypes, templates, terminology                 | —                                                                         | **Decline.** Clinical content with its own licence and governance.                                                                                                                                                                                                                                                                                                                                    |
| Constraint validation, scores, unit conversion     | —                                                                         | **Decline.** Clinical logic.                                                                                                                                                                                                                                                                                                                                                                          |
| AQL, REST, EHRbase                                 | —                                                                         | **Decline.** Data fetching and persistence.                                                                                                                                                                                                                                                                                                                                                           |

## Advice

The order of value: **1 (partial dates), 2 (not applicable), 3 (approximate) and 9 (whose record)** first. Each is a small
change to an existing contract that stops a screen showing something the record does not say, which is the whole point of the
healthcare work. Then **12 (`quantity-input-div`)** and **14 (the mapping)**, which make Lily usable for the forms openEHR
adopters actually build. **5 (`duration-view`)** and **4 (`formatProportion`)** are cheap and general. Items **10** and **13**
are new components with real use beyond openEHR, but each should wait for a concrete adopter, so they are the maintainer's call.
Items 6 to 8 and 11 are guide content and example-page changes, not catalog growth.

## Acceptance criteria

- [ ] Partial dates format with only their fields, in Svelte and the C# port; `date-time-view` renders `<time datetime="2019-03">`; `date-field` takes `precision` in all nine catalogs (item 1).
- [ ] `not-applicable` is a status of the record lists and `observation-view`, with consumer words, in all nine catalogs (item 2).
- [ ] `formatQuantity` writes `~` as `≈` (item 3); `formatProportion` exists with tests (item 4).
- [ ] `duration-view` exists in all nine catalogs (item 5).
- [ ] `observation-view` takes several named ranges (item 6).
- [ ] Record items render `subjectLabel` (item 9).
- [ ] `quantity-input-div` exists in all nine catalogs, with per-unit limits tested (item 12).
- [ ] The guide has the openEHR mapping, the interval, ordinal and instruction-step patterns (items 7, 8, 11, 14).
- [ ] Items 10 and 13 are built or declined by the maintainer, with the reason recorded here.

## Related topics

- [healthcare-ui](../../healthcare-ui/index.md) — the clinical display components these items extend.
- [openemr](../openemr/index.md) — lessons from an open-source EHR application, the same day.
- [internationalization](../../internationalization/index.md) — dates, numbers and durations through `Intl`.
- [components](../../components/index.md) — suffix rules for `-view`, `-input-div` and `fieldset`.

## Sources

- [openEHR](https://openehr.org/) and its [specifications](https://specifications.openehr.org/)
- [RM data types](https://specifications.openehr.org/releases/RM/latest/data_types.html)
- [RM data structures](https://specifications.openehr.org/releases/RM/latest/data_structures.html)
- [RM EHR information model](https://specifications.openehr.org/releases/RM/latest/ehr.html)
- [RM common information model](https://specifications.openehr.org/releases/RM/latest/common.html)
- [Clinical Knowledge Manager](https://ckm.openehr.org/ckm/)
- [Medblocks UI](https://medblocks.com/docs/medblocks-ui)
- Repo: [docs/patterns/healthcare](../../../docs/patterns/healthcare/index.md), [components/observation-view](../../../components/observation-view/index.md), [shared/clinical-format.ts](../../../shared/clinical-format.ts)

---

Lily™ and Lily Design System™ are trademarks.
