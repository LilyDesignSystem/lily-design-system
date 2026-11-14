# Pattern: Healthcare user interfaces

A guide for teams building clinical software with Lily Design System™: clinical portals, results and reporting, prescribing and
medicines administration, decision support and hospital dashboards (tasks.md P27-T10). The research, sources and decisions behind
it are in [spec/healthcare-ui](../../spec/healthcare-ui/index.md).

## What Lily does, and what it does not

Lily gives you display contracts: semantic markup, ARIA, keyboard behaviour and class hooks for the things clinical screens repeat.
It does not give you clinical logic, clinical content or a regulatory claim.

| Lily provides                                                               | You provide                                                        |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `observation-view`: a value, unit, flag in words, range, and missing states | The value, the flag decision, the reference range                  |
| `allergy-list`, `allergy-list-item`: a status that is never blank           | The allergy record and its terminology                             |
| `medication-view`: name, strength, form, route, frequency, none truncated   | The drug data, tall man segments, the formatted strength           |
| `decision-support-card`: the CDS Hooks card shape                           | The rules, the suggestion actions, recording the outcome           |
| `early-warning-score-view`: a score, band and escalation, displayed         | The scoring system and its validated calculation                   |
| `age-view` and `ageParts()`: an age in units suited to it                   | The words for the units (`Intl.DurationFormat` or your own labels) |
| `formatQuantity()`: 5 mg, never 5.0 mg; 0.5 mg, never .5 mg                 | The number, the unit and the locale                                |
| The patient banner composition                                              | Every label and value, and who may see clinical information        |

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
- Do not limit how many records a clinician may open: a randomised trial of 3,356 clinicians (JAMA, 2019) found that it did not
  reduce wrong-patient orders, and people work around it.

## The patient banner

The composition is documented in [`medical-banner`](../../components/medical-banner/index.md#patient-banner), with a working page
at `/patient-banner` in the SvelteKit example app:

- two identifiers; age beside the date of birth (`age-view`);
- allergies through `allergy-list`, so "no known allergies", "not recorded" and "unavailable" never look alike;
- a missing value is words ("Not known"), never `?`, `-` or an empty cell;
- a deceased patient: `data-deceased` for the theme, and a visible line of text, never colour alone;
- no field truncated, clipped or hidden at any width; it wraps.

## Results

- One display for a result, whatever system it came from: `observation-view`.
- The flag is words from your translation (`flagLabel`), with the FHIR interpretation code as `data-interpretation` for the theme.
- Separate new results from earlier ones, and show a trend (`sparkline`, or a `line-chart` with its data table): clinicians look
  for a significant change, not only the range.
- A result that was never recorded and one that is unavailable are different states, with different words.

## Medicines

- Generic names in lower case, except tall man letters from the FDA and ISMP lists or your country's (Australia and Canada publish
  their own). Mark them in `nameSegments`; Lily never guesses them.
- Write the strength with `formatQuantity`: no trailing zero, a leading zero, a no-break space before the unit.
- Write mL, never cc, and avoid every abbreviation on ISMP's error-prone list.
- Never truncate a medicine's name or dose.

## Dates and times

- Write the month as text so a date cannot be read two ways (`Intl.DateTimeFormat` with `month: "short"`).
- Choose the clock on purpose: pass `hourCycle` explicitly. The NHS asks for the 24-hour clock; that is a UK rule, not a worldwide
  one, so Lily never picks it for you.
- Ages follow the Common User Interface bands through `ageParts()`; a service with another convention passes its own words.

## Dashboards

- A ward board or command-centre screen updates often. Never announce each change: keep one polite summary region ("3 beds free,
  2 discharges due") and let people read the board.
- Every state on a board (bed clean, occupied, blocked) is text or a `data-*` state with words, never colour alone.

## What Lily will not do

- Compute an early warning score, a growth centile, a dose or a reference range.
- Ship a drug database, a tall man list, or SNOMED CT, ICD, LOINC or UCUM codes.
- Reproduce a licensed instrument (Wong-Baker FACES) or another body's design (the NEWS2 chart).
- Limit the number of records open at once.

---

Lily™ and Lily Design System™ are trademarks.
