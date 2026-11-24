# Pattern: Healthcare user interfaces

A guide for teams building clinical software with Lily Design System™: clinical portals, results and reporting, prescribing and
medicines administration, decision support and hospital dashboards (tasks.md P27-T10). The research, sources and decisions behind
it are in [spec/healthcare-ui](../../../spec/healthcare-ui/index.md).

This guide is also on the website at <https://lilydesignsystem.com/patterns/healthcare/>, with unreviewed machine
translations into the site's 63 other languages; this file is the source, and the site page (`lilydesignsystem.github.io/src/routes/patterns/healthcare/+page.svelte`) must follow it.

## What Lily does, and what it does not

Lily gives you display contracts: semantic markup, ARIA, keyboard behaviour and class hooks for the things clinical screens repeat.
It does not give you clinical logic, clinical content or a regulatory claim.

| Lily provides                                                                   | You provide                                                        |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `observation-view`: a value, unit, flag in words, range, and missing states     | The value, the flag decision, the reference range                  |
| `allergy-record-list`, `allergy-record-list-item`: a status that is never blank | The allergy record and its terminology                             |
| `medication-view`: name, strength, form, route, frequency, none truncated       | The drug data, tall man segments, the formatted strength           |
| `decision-support-card`: the CDS Hooks card shape                               | The rules, the suggestion actions, recording the outcome           |
| `early-warning-score-view`: a score, band and escalation, displayed             | The scoring system and its validated calculation                   |
| `age-view` and `ageParts()`: an age in units suited to it                       | The words for the units (`Intl.DurationFormat` or your own labels) |
| `formatQuantity()`: 5 mg, never 5.0 mg; 0.5 mg, never .5 mg                     | The number, the unit and the locale                                |
| The patient banner composition                                                  | Every label and value, and who may see clinical information        |

**Regulation.** Software that computes a score, a centile, a dose or a drug interaction is usually a medical device. Lily computes none
of these, on purpose. If your product is regulated, you own its usability engineering file (IEC 62366-1, the FDA's human factors
guidance, EU MDR). Lily's tests, its self-assessed accessibility conformance report and its screen-reader matrix can be evidence in
that file; none of them is a conformance claim, and the matrix has no results yet.

## Alerts: interrupt only for what is critical

Alert fatigue is a safety problem: when every alert interrupts, people dismiss them all. AHRQ's guidance is to tier alerts by
severity and make only the severe ones interruptive.

- **Information** (`indicator="info"`): inline, beside the task, a `decision-support-card` in the page.
- **Warning** (`indicator="warning"`): visible without blocking, the same card, styled to stand out; no modal.
- **Critical** (`indicator="critical"`): put the card inside an `alert-dialog`, and offer `overrideReasons` so dismissing it asks
  for a reason.
- A `decision-support-card` is never a live region by itself. Announce a new critical card by moving focus into the dialog, not
  by `aria-live`.
- Remove a card when the event it answered happens again, and record each outcome (accepted, or overridden with its reason).

## Wrong-patient errors: identify, do not restrict

- Show two identifiers wherever a patient's data appears: the name with the date of birth, and the national identifier with its
  `-view` component (The Joint Commission, Quick Safety 45).
- Use the patient banner on every screen that acts on one patient's record, and keep it visible.
- Before an action on a record other than the one in the banner, confirm it with the name, date of birth and identifier.
- An entry about someone other than the patient (a parent's history, a fetus, a donor) says whose it is first, in words: give the
  record items a `subjectLabel` ("Mother"), so a relative's diagnosis is never read as the patient's (openEHR `PARTY_RELATED`, FHIR
  `FamilyMemberHistory`).
- Do not limit how many records a clinician may open: a randomised trial of 3,356 clinicians (JAMA, 2019) found that it did not
  reduce wrong-patient orders, and people work around it.
- A menu of actions on one record names that record first, with `subjectLabel` on `context-menu` or `dropdown-menu` ("Ada
  Lovelace, blood pressure 3 Nov"): a non-interactive first part that is also the menu's accessible name.
- Tier each action by what it does, and make the tier visible before it runs. **Routine** (view, print) runs at once.
  **Documented** says what it will write to the record ("Adds a note to the encounter"). **Clinical** (discontinue, cancel an
  order) asks a second time, in an `alert-dialog` whose confirming button is the verb ("Discontinue"), never "OK" or "Yes".
  **Disclosive** (break the glass, share outside the care team) asks for a reason first and records it.
- When several records are open (tabs, windows, split panes), every tab's visible text and accessible name include the patient's
  name and a second identifier, the active panel repeats the banner, and no action applies to a patient other than its panel's.
- Show the location records will be attributed to (the ward, clinic or facility chosen at sign-in) as text in the page header, and
  make changing it an explicit action.
- Show the active visit, or "No active visit", in the banner. A form that needs a visit says so and offers to start one, rather than
  failing when it is saved.

## The patient banner

The composition is documented in [`medical-banner`](../../../components/medical-banner/index.md#patient-banner), with a working page
at `/patient-banner` in the SvelteKit example app:

- two identifiers; age beside the date of birth (`age-view`);
- allergies through `allergy-record-list`, so "no known allergies", "not recorded" and "unavailable" never look alike;
- a missing value is words ("Not known"), never `?`, `-` or an empty cell;
- a deceased patient: `data-deceased` for the theme, and a visible line of text, never colour alone;
- no field truncated, clipped or hidden at any width; it wraps.
- patient flags ("Needs an interpreter", "Infection risk") are a labelled `tag-group` of words, never icons or colour alone, and
  stay visible when the banner wraps.
- the name the patient wants used and their pronouns, when recorded, as their own labelled fields beside the legal name, never
  replacing it and never inferred.

## Results

- One display for a result, whatever system it came from: `observation-view`.
- The flag is words from your translation (`flagLabel`), with the FHIR interpretation code as `data-interpretation` for the theme.
- Separate new results from earlier ones, and show a trend (`sparkline`, or a `line-chart` with its data table): clinicians look
  for a significant change, not only the range.
- A result that was never recorded and one that is unavailable are different states, with different words.

- Unknown is not normal. A result whose reference range is missing, still loading or unreadable has no interpretation and says
  so; `observation-view` never infers one, so a result with a range and no `interpretation` shows no flag.
- An off-scale result is the instrument's limit with a comparator ("> 33.3 mmol/L": `formatQuantity` with `">"`) and your critical
  flag, never a bare number. An approximate value keeps its `≈` (`"~"`).
- Give further named ranges ("Critical: below 2.5") as `ranges`, each its own part.
- Keep the decimal places the laboratory reported: a potassium of 4.50 mmol/L is written with `formatQuantity(4.5, "mmol/L",
locale, undefined, { precision: 2 })`, because "4.5" claims less precision than the result has. A dose is the opposite: no
  `precision`, so no trailing zero ("1 mg", never "1.0 mg", which reads as "10 mg"). A value with more places than its
  `precision` is refused, never rounded.
- A corrected or amended result keeps the value it replaced, in a `<del>`, with your words for when it changed (`previousValue`,
  `previousLabel`), so a clinician who read the old value knows it changed.
- An interval reading says its width and function ("Mean, 24 hours"), and a reading's state and method ("Sitting, large cuff")
  are visible text beside it, never only a tooltip (openEHR `INTERVAL_EVENT`, `state`, `protocol`).
- A trend needs comparable points: draw no line below your minimum, break the line where the method or assay changed, and say
  direction and meaning in words ("falling, improving").
- Vitals entered in one unit system may show the other beside them as your text ("70 kg (154 lb)"); Lily converts nothing, so
  state your rounding. Enter a quantity with `quantity-input-div`, whose number takes each unit's limits.
- A growth chart is a `line-chart` with your centile lines as series, the child's points and its data table of age and value; Lily
  computes no centile and ships no growth reference.

## Medicines

- Generic names in lower case, except tall man letters from the FDA and ISMP lists or your country's (Australia and Canada publish
  their own). Mark them in `nameSegments`; Lily never guesses them.
- Write the strength with `formatQuantity`: no trailing zero, a leading zero, a no-break space before the unit.
- Keep a result's comparator: `formatQuantity(5, "mmol/L", locale, "<")` writes "<5 mmol/L". FHIR's `Quantity.comparator`
  (`<`, `<=`, `>=`, `>`) is written `<`, `≤`, `≥`, `>`; dropping it turns "less than 5" into "5".
- Write mL, never cc, and avoid every abbreviation on ISMP's error-prone list.
- Never truncate a medicine's name or dose.

## Dates and times

- Write the month as text so a date cannot be read two ways (`Intl.DateTimeFormat` with `month: "short"`).
- Choose the clock on purpose: pass `hourCycle` explicitly. The NHS asks for the 24-hour clock; that is a UK rule, not a worldwide
  one, so Lily never picks it for you.
- Ages follow the Common User Interface bands through `ageParts()`; a service with another convention passes its own words.
- A date known only to the month or year stays that way: ask for it with `date-field` `precision="month"` or `"year"`, store
  `2019-03` or `2019`, and write it with `formatPartialDate()`. Never invent a day.
- A length of time is `duration-view`, a `<time datetime="P3DT4H">` holding your words, from `durationParts()` and
  `Intl.DurationFormat`.

## Dashboards

- A ward board or command-centre screen updates often. Never announce each change: keep one polite summary region ("3 beds free,
  2 discharges due") and let people read the board.
- Every state on a board (bed clean, occupied, blocked) is text or a `data-*` state with words, never colour alone.
- Nothing blinks (WCAG 2.2.2, 2.3.1), and a board that updates on a timer has a pause control or updates only when asked; updates
  never move focus. An overdue entry says so in words ("Waiting over 20 minutes") with `data-overdue`.
- A count or rate shows its denominator ("12 of 68") and links to the list behind it.
- A list or timeline says what it is a view of: what it shows, its order and window, what is hidden and why, and which sources did
  not answer. An empty list from a source that did not answer is not proof that nothing exists.
- A reminder list is a `record-list` whose items carry a due date (`review-date`) and a due state in words, with `data-due`; the
  rule that produced it is yours.
- A day schedule with a column per clinician or room is `calendar-day-table` over your own markup: a `<th scope="col">` naming
  each resource, a `<th scope="row">` for each time, and each appointment's type as text in its cell, with any colour beside
  it and a legend. The grid keys move across it; the `calendar` helper is date-grained and has no resource view.
- A column whose cells are icons has a header in full words, a legend, and the value as text in every cell. A short visible
  header ("Cosign") is fine only if its accessible name is the whole phrase ("Cosign required"); a header cut off after a few
  letters names nothing. A row like `<td><span aria-hidden="true">!!</span> New critical result</td>` keeps the icon for the
  eye and the words for everyone.
- Data that may be stale says when it was fetched and offers a Refresh button: "Updated <time datetime="2026-11-20T14:05">3
  minutes ago</time>". Refreshing never reorders rows under the user's focus or pointer; new rows arrive at the end of the
  sort or after the user asks.
- A derived score (a risk score, an early warning score, a wellness score) says what it is based on and when it was
  calculated, as text or in a `contextual-help` reachable by keyboard: "NEWS2 6, from observations at 14:00". How the score is
  calculated is yours; Lily shows it and computes nothing.

## Forms

- A question answered "yes", "no" or "not asked" is a `radio-group` of three answers, none chosen at first, never a checkbox: a
  checkbox cannot tell "denied" from "never asked". A review of systems is one `fieldset` per body system, and an "all others
  absent" button sets only the unanswered ones.
- A question with a list of answers (medicines, addresses) is a `repeatable-fieldset`: an item is added or removed, focus follows,
  and each remove button is named for its item.
- A number with a decimal comma: show it with `Intl.NumberFormat` and, where `type="number"` does not accept the comma, take it in a
  text field with `inputmode="decimal"` and parse it in your code. Never change a value the person typed, even to clamp it to a
  range: an out-of-range value is an error they can see.
- A long list that renders only part of its options at a time sets `aria-setsize` and `aria-posinset` on each option, and
  remembers that find-in-page cannot see the rest.

## Records, notes and their provenance

- Say what a list or a grid is a view of, before its rows: its window and order, what it leaves out and why, and which sources did
  not answer ("Last 12 months, newest first. The GP record did not answer."). Give `record-list` and `timeline-list` a
  `coverageLabel`, and the `data-grid` helper its `coverageLabel`. An empty list from a source that did not answer says so in
  words, so it is never read as "nothing recorded".
- Say where a record came from and whether it is final with `record-provenance-view`: signed, awaiting a signature, amended,
  saved on this device and not yet sent. An unsigned draft must never look signed.
- An entry about someone else (a parent, a fetus, a donor) says whose it is first, with the record items' `subjectLabel`.
- A withheld entry stays in the list with your words ("Restricted: not available to you"), and an entry made in error stays struck
  through with "Entered in error": give `record-list-item` or `timeline-list-item` an `entryState` and an `entryStateLabel`. Never
  remove either silently, since a gap is read as "nothing happened".
- A summary of what is withheld says how many, never which or of what kind: "2 entries are not shown to you", never "2 sexual
  health entries are not shown to you", since the category is itself the private fact.
- In a clinical note, mark each passage's source (typed, dictated, template, copied forward, generated) with `data-source` and
  visible words, so copied or generated text is never taken for today's examination.
- A section that cannot load is `unavailable` in your words, with a retry button; a technical code, if shown at all, sits behind a
  disclosure. A failure caused by a person's action is announced, with the value the record now holds; a failure on page load is
  not.
- An order's history is a `timeline-list`, one item per step (planned, scheduled, active, suspended, completed, cancelled) with its
  time and reason, and the current state also on the item.

## From FHIR to Lily

Lily does not read FHIR resources; your code maps them to Lily's props. The tables below are the mapping for the HL7 FHIR
International Patient Summary (IPS 2.0.1, FHIR R4). The code mapping is a suggestion: your clinical safety review decides it,
and the words for every state are your own.

### Sections

| IPS section (LOINC)                        | Lily                                                                                           |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Allergies and intolerances (`48765-2`)     | `allergy-record-list`, `allergy-record-list-item`                                              |
| Medication summary (`10160-0`)             | `medication-record-list`, `medication-record-list-item` holding a `medication-view`            |
| Problem list (`11450-4`)                   | `problem-record-list`, `problem-record-list-item`                                              |
| Immunizations (`11369-6`)                  | `immunization-record-list`, `immunization-record-list-item`                                    |
| Results (`30954-2`)                        | `observation-view`, in a `data-table` or `summary-list`; a DiagnosticReport is a group of them |
| History of procedures (`47519-4`)          | `procedure-record-list`, `procedure-record-list-item`                                          |
| Medical devices (`46264-8`)                | `device-record-list`, `device-record-list-item`                                                |
| Alerts (`104605-1`)                        | `warning-text`, or `alert`; never behind a collapsed control                                   |
| Any other section                          | `record-list`, `record-list-item`                                                              |
| A required section the document leaves out | the section's list with `status="omitted"`                                                     |

### Codes

| FHIR                                                                         | Lily                                                              |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `Composition.section.emptyReason` `nilknown`                                 | the list's `status="none-known"`                                  |
| `emptyReason` `notasked`, `notstarted`                                       | `status="not-recorded"`                                           |
| `emptyReason` `unavailable`, `withheld`, `closed`                            | `status="unavailable"`, with words that say which                 |
| IPS absent and unknown codes `no-known-allergies`, `no-known-medications`, … | `status="none-known"`                                             |
| IPS absent and unknown codes `no-allergy-info`, `no-medication-info`, …      | `status="not-recorded"`                                           |
| `AllergyIntolerance.criticality`                                             | `allergy-record-list-item` `criticality`                          |
| `AllergyIntolerance.reaction.severity`                                       | `allergy-record-list-item` `severity`                             |
| `AllergyIntolerance.clinicalStatus`, `.verificationStatus`                   | `clinicalStatus`, `verificationStatus` (same codes)               |
| `Condition.clinicalStatus`, `.verificationStatus`                            | `problem-record-list-item` `clinicalStatus`, `verificationStatus` |
| `MedicationStatement.status`                                                 | `medication-record-list-item` `status`                            |
| `Dosage.text`                                                                | `medication-view` `dosageText`                                    |
| `Immunization.status`, `Procedure.status`, `DeviceUseStatement.status`       | the item's `status` (same codes)                                  |
| `Observation.status`                                                         | `observation-view` `status` (same codes)                          |
| `Observation.interpretation` (v3 ObservationInterpretation)                  | `observation-view` `interpretation`, with `flagLabel`             |
| `Observation.dataAbsentReason` `masked`                                      | `observation-view` `status="masked"`                              |
| `dataAbsentReason` `asked-unknown`, `not-asked`, `not-performed`             | `status="not-recorded"`                                           |
| `dataAbsentReason` `unknown`, `temp-unknown`, `error`                        | `status="unavailable"`                                            |
| `dataAbsentReason` `not-applicable`                                          | `status="not-applicable"` (also on the record lists)              |
| `Quantity.comparator`                                                        | `formatQuantity(value, unit, locale, comparator)`                 |

### Fields

The element-by-element mapping for the four components a vaccination, results or medicines view is built from (FHIR R4 names).
Lily shows text; your code turns codes, dates and numbers into the words and formats for your readers' language.

| FHIR resource and element                                   | Lily component and prop                                                       |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `Immunization.vaccineCode`                                  | `immunization-record-list-item` `vaccine` (the display text, never truncated) |
| `Immunization.occurrenceDateTime`                           | `occurrence` (machine date) and `occurrenceLabel` (your formatted words)      |
| `Immunization.occurrenceString`                             | `occurrenceLabel` only, with no `occurrence`                                  |
| `Immunization.protocolApplied.doseNumber`                   | `doseNumberLabel` ("Dose 2 of 2"; you write the words)                        |
| `Immunization.lotNumber`                                    | `lotNumber`                                                                   |
| `Immunization.status`                                       | `status` (`completed`, `entered-in-error`, `not-done`) with `statusLabel`     |
| `Immunization.patient` when not the subject of the page     | `subjectLabel`                                                                |
| `Observation.code`                                          | the visible caption, or `observation-view` `label`                            |
| `Observation.valueQuantity.value`, `.unit`                  | `value` (formatted by you, for example with `formatQuantity`) and `unit`      |
| `Observation.referenceRange.text`, or `.low` and `.high`    | `range` (text), plus `meterLow` and `meterHigh` for the optional `<meter>`    |
| `Observation.referenceRange` with a `type` such as critical | `ranges` (`{ label, text }`)                                                  |
| `Observation.interpretation`                                | `interpretation` and `flagLabel`                                              |
| `Observation.status`, `.dataAbsentReason`                   | `status` and `statusLabel` (see Codes above)                                  |
| `MedicationStatement.medicationCodeableConcept`             | `medication-view` `name`, or `nameSegments` when tall man letters apply       |
| `MedicationStatement.dosage.text`                           | `dosageText`                                                                  |
| `MedicationStatement.dosage.route`                          | `route`                                                                       |
| `MedicationStatement.dosage.timing`                         | `frequency` (your words: "twice a day")                                       |
| `MedicationStatement.dosage.doseAndRate.doseQuantity`       | `strength` (what is given), or inside `dosageText`                            |
| `Medication.form`                                           | `form`                                                                        |
| `AllergyIntolerance.code`                                   | `allergy-record-list-item` `substance` (never truncated)                      |
| `AllergyIntolerance.reaction.manifestation`                 | `reaction`                                                                    |
| `AllergyIntolerance.type`, `.category`                      | `typeLabel`, `categoryLabel`                                                  |
| `AllergyIntolerance.recordedDate` or `.lastOccurrence`      | `updated` and `updatedLabel`                                                  |

Lily ships no FHIR data model, parser or terminology: these tables describe where each element shows up, and nothing here
validates a resource.

Map an `entered-in-error` record to its `entered-in-error` status, with words, rather than dropping it silently: whether to show
it at all is your service's decision.

## From openEHR to Lily

Lily does not read openEHR compositions either. The mapping for openEHR Reference Model data types and codes, as a suggestion
your clinical safety review decides ([spec/lessons/openehr](../../../spec/lessons/openehr/index.md)):

| openEHR                                                       | Lily                                                                                                     |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `DV_QUANTITY` (entry)                                         | `quantity-input-div`; units as UCUM codes with your words                                                |
| `DV_QUANTITY` (display), `magnitude_status`                   | `observation-view` with `formatQuantity(value, unit, locale, comparator)` (`~` is `≈`)                   |
| `DV_QUANTITY.precision`                                       | `formatQuantity(…, { precision })` and `formatRange(…, { precision })`; `-1` (unknown) is leaving it out |
| `DV_ORDERED.normal_status` `HHH`, `HH`, `H`, `L`, `LL`, `LLL` | `observation-view` `interpretation`: FHIR `HU`, `HH`, `H`, `L`, `LL`, `LU`                               |
| `other_reference_ranges` with a `meaning`                     | `observation-view` `ranges`                                                                              |
| `DV_DATE` partial (year, year and month)                      | `date-field` `precision`; `formatPartialDate()`; `date-time-view`                                        |
| `DV_DURATION`                                                 | `duration-view` with `durationParts()`                                                                   |
| `DV_PROPORTION`                                               | `formatProportion()` inside `observation-view`                                                           |
| `DV_ORDINAL`, `DV_SCALE`                                      | a `radio-group` whose labels carry the number and its words                                              |
| `DV_CODED_TEXT`                                               | the coded values pattern below                                                                           |
| `DV_BOOLEAN`                                                  | `checkbox-input`, only when "not asked" cannot happen                                                    |
| `ELEMENT.null_flavour` `253` unknown, `271` no information    | `status="not-recorded"` or `"unavailable"`, with words that say which                                    |
| `null_flavour` `272` masked                                   | `observation-view` `status="masked"`                                                                     |
| `null_flavour` `273` not applicable                           | `status="not-applicable"`                                                                                |
| `PARTY_RELATED` subject                                       | `subjectLabel` on the record items                                                                       |
| `AUDIT_DETAILS`, `ATTESTATION`, `FEEDER_AUDIT`                | `record-provenance-view`                                                                                 |
| Instruction State Machine steps                               | a `timeline-list` of steps, with the current state on the item                                           |
| an archetype item with occurrences `0..*`                     | `repeatable-fieldset`                                                                                    |

A worked example ([spec/lessons/openehr-rust](../../../spec/lessons/openehr-rust/index.md)). A potassium result and a partial
date of onset, as openEHR canonical JSON:

```json
{
  "_type": "DV_QUANTITY",
  "magnitude": 4.5,
  "units": "mmol/L",
  "precision": 2,
  "magnitude_status": "<"
}
```

```json
{ "_type": "DV_DATE", "value": "2019-03" }
```

become these Lily calls; nothing is rounded, padded or completed:

```ts
const value = formatQuantity(4.5, "", locale, "<", { precision: 2 }); // "<4.50": the comparator and both places kept
// <ObservationView value={value} unit="mmol/L" … />
const onset = formatPartialDate("2019-03", locale); // "March 2019": never "1 March 2019"
// <DateTimeView value="2019-03" format={onset} />
```

`precision` `-1` (unknown) means leaving `precision` out. A `magnitude` with more places than its `precision` is refused, so
check the record rather than catching the error and showing the number anyway.

## Coded values

A coded value is written for a person first and a code second:

- Show `Coding.display`; if there is none, `CodeableConcept.text`; if neither, `system|code`. Never an empty cell.
- Offer a control that reveals the code system and code beside each value (for example a `toggle-button`, "Show codes"), for the
  people who check them. Hidden codes stay out of the reading order until shown (`hidden`, not only visually hidden).
- Mark clinical text with the document's language (`lang`), which may differ from the interface's, so a screen reader pronounces
  it correctly. Translate the interface; never translate the clinical content.
- Lily ships no terminology: no SNOMED CT, LOINC, ATC or UCUM lookups. Write what the document says.

The SvelteKit example's `/patient-summary` page shows the pattern.

## What Lily will not do

- Compute an early warning score, a growth centile, a dose or a reference range.
- Ship a drug database, a tall man list, or SNOMED CT, ICD, LOINC or UCUM codes.
- Reproduce a licensed instrument (Wong-Baker FACES) or another body's design (the NEWS2 chart).
- Limit the number of records open at once.
- Infer an interpretation from a range, convert a unit, or parse a relative date ("next Tuesday").
- Use a switch for "yes, no or unknown": ARIA's `switch` has no third state, so it is three radios.

---

Lily™ and Lily Design System™ are trademarks.
