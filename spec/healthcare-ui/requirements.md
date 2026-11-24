# Healthcare requirements register

**Permanent ids for the safety-relevant healthcare rules, and the tests that check each one** (tasks.md P47-T10, adopted
2026-11-24 because adopters asked for it; [spec/lessons/openehr-rust](../lessons/openehr-rust/index.md) item 10). A regulated
adopter's clinical safety case or usability file can cite an id here and follow it to the test that proves it. The rules
themselves are explained in [the topic](index.md) and the [adopter guide](../../docs/patterns/healthcare/index.md).

## Rules for the ids

- **An id is permanent.** It is never renumbered, never reused, and never given to a different rule. A rule that is withdrawn
  keeps its row, with the status `withdrawn` and the date.
- **A test cites an id in its name**, `"HC-F1: writes no trailing zero"` (TypeScript) or in a comment on the line before it
  (`// HC-F1`, C#). One test may cite several; one id may be cited by several tests and catalogs.
- **The status says what proves the rule:**
  - `tested`: every file in Evidence holds a test that cites the id;
  - `checked`: a `bin/` script in `bin/test` enforces it over every catalog;
  - `guide`: an adopter's rule, stated in the guide, which no Lily code can enforce;
  - `untested`: Lily follows it, but nothing proves it yet (a gap, listed below);
  - `declined`: Lily does not do it, and the topic says why.
- `bin/check-healthcare-requirements` (in `bin/test`) fails when an id is duplicated or malformed, when a `tested` id is not
  cited in each of its evidence files, when evidence does not exist, or when a test cites an id this register lacks.

## Formatting (`shared/clinical-format.ts`, its C# port)

| Id     | Requirement                                                                                                     | Status | Evidence                                                                                                                                |
| ------ | --------------------------------------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| HC-F1  | A quantity given without a precision (a dose) is written with no trailing zero: 5 mg, never 5.0 mg.             | tested | `shared/clinical-format.test.ts`, `lily-design-system-blazor-headless/tests/LilyBlazorHeadless.Tests/Components/ClinicalFormatTests.cs` |
| HC-F2  | A number below one has a leading zero: 0.5 mg, never .5 mg.                                                     | tested | `shared/clinical-format.test.ts`, `lily-design-system-blazor-headless/tests/LilyBlazorHeadless.Tests/Components/ClinicalFormatTests.cs` |
| HC-F3  | Thousands are grouped in the locale's way, so 5000 cannot be read as 500.                                       | tested | `shared/clinical-format.test.ts`, `lily-design-system-blazor-headless/tests/LilyBlazorHeadless.Tests/Components/ClinicalFormatTests.cs` |
| HC-F4  | Number and unit are joined by a no-break space, so they never part across a line.                               | tested | `shared/clinical-format.test.ts`, `lily-design-system-svelte-headless/components/ObservationView/ObservationView.test.ts`               |
| HC-F5  | A comparator (`<`, `≤`, `≥`, `>`, `≈`) is written before the number and never dropped.                          | tested | `shared/clinical-format.test.ts`, `lily-design-system-blazor-headless/tests/LilyBlazorHeadless.Tests/Components/ClinicalFormatTests.cs` |
| HC-F6  | A result keeps the decimal places it was reported to (openEHR `precision`); a value finer than that is refused. | tested | `shared/clinical-format.test.ts`, `lily-design-system-blazor-headless/tests/LilyBlazorHeadless.Tests/Components/ClinicalFormatTests.cs` |
| HC-F7  | A range given high to low is refused, so it can never read backwards.                                           | tested | `shared/clinical-format.test.ts`, `lily-design-system-blazor-headless/tests/LilyBlazorHeadless.Tests/Components/ClinicalFormatTests.cs` |
| HC-F8  | No error names the clinical value it refused; a closed vocabulary is echoed only truncated.                     | tested | `shared/clinical-format.test.ts`, `lily-design-system-blazor-headless/tests/LilyBlazorHeadless.Tests/Components/ClinicalFormatTests.cs` |
| HC-F9  | A partial date is written with only the fields it has, never completed with an invented month or day.           | tested | `shared/clinical-format.test.ts`, `lily-design-system-blazor-headless/tests/LilyBlazorHeadless.Tests/Components/ClinicalFormatTests.cs` |
| HC-F10 | A month is written as a word, never a number, so 03/04 cannot be misread.                                       | tested | `shared/clinical-format.test.ts`                                                                                                        |
| HC-F11 | A duration is split into the parts it was given, converting nothing: 90 minutes stays 90 minutes.               | tested | `shared/clinical-format.test.ts`                                                                                                        |
| HC-F12 | A duration accepts `,` as the decimal sign, as ISO 8601 and openEHR allow, and its HTML form writes `.`.        | tested | `shared/clinical-format.test.ts`, `lily-design-system-blazor-headless/tests/LilyBlazorHeadless.Tests/Components/ClinicalFormatTests.cs` |
| HC-F13 | A proportion is written as recorded and never reduced: 2/4 stays 2/4.                                           | tested | `shared/clinical-format.test.ts`                                                                                                        |
| HC-F14 | An age is given in the units its band calls for, from minutes under 2 hours to years from 18.                   | tested | `shared/clinical-format.test.ts`, `lily-design-system-blazor-headless/tests/LilyBlazorHeadless.Tests/Components/ClinicalFormatTests.cs` |
| HC-F15 | A leap second (`23:59:60`) is kept exactly as written, never moved to the next minute.                          | tested | `shared/cell-types.test.ts`, `lily-design-system-svelte-headless/components/DateTimeView/DateTimeView.test.ts`                          |

## Components

| Id     | Requirement                                                                                                                     | Status | Evidence                                                                                                                                                               |
| ------ | ------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HC-C1  | An observation's interpretation is data (`data-interpretation`), and its flag is only the consumer's words, never colour alone. | tested | `lily-design-system-svelte-headless/components/ObservationView/ObservationView.test.ts`                                                                                |
| HC-C2  | An observation never infers an interpretation from its range.                                                                   | tested | `lily-design-system-svelte-headless/components/ObservationView/ObservationView.test.ts`                                                                                |
| HC-C3  | "Not recorded" and "unavailable" are different states with different words, never a blank; a list without a status warns.       | tested | `lily-design-system-svelte-headless/components/ObservationView/ObservationView.test.ts`, `lily-design-system-svelte-headless/components/RecordList/RecordList.test.ts` |
| HC-C4  | A corrected result keeps the value it replaces visible, struck through, with words.                                             | tested | `lily-design-system-svelte-headless/components/ObservationView/ObservationView.test.ts`                                                                                |
| HC-C5  | An allergy list's status is required, so "no known allergies" and "not recorded" are never confused with an empty list.         | tested | `lily-design-system-svelte-headless/components/AllergyRecordList/AllergyRecordList.test.ts`                                                                            |
| HC-C6  | Tall man letters are only the consumer's marked segments; Lily writes none of its own.                                          | tested | `lily-design-system-svelte-headless/components/MedicationView/MedicationView.test.ts`                                                                                  |
| HC-C7  | A decision support card is not a live region, so it never interrupts by itself.                                                 | tested | `lily-design-system-svelte-headless/components/DecisionSupportCard/DecisionSupportCard.test.ts`                                                                        |
| HC-C8  | Dismissing a card that offers override reasons asks for one.                                                                    | tested | `lily-design-system-svelte-headless/components/DecisionSupportCard/DecisionSupportCard.test.ts`                                                                        |
| HC-C9  | An early warning score is shown as given; the component computes nothing.                                                       | tested | `lily-design-system-svelte-headless/components/EarlyWarningScoreView/EarlyWarningScoreView.test.ts`                                                                    |
| HC-C10 | A missing required section of a patient summary is always shown, in words, with a contents link.                                | tested | `lily-design-system-svelte-headless/components/InternationalPatientSummary/InternationalPatientSummary.test.ts`                                                        |
| HC-C11 | An entry about someone other than the patient says whose it is, first.                                                          | tested | `lily-design-system-svelte-headless/components/AllergyRecordListItem/AllergyRecordListItem.test.ts`                                                                    |

## Patient banner, identifiers and filtering

| Id    | Requirement                                                                                                                                                                                     | Status  | Evidence                                                                                                                                                                                                         |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HC-B1 | Every banner field is visible and unclipped at 320 CSS pixels; names, identifiers and allergies wrap, never truncate.                                                                           | tested  | `lily-design-system-svelte-sveltekit-examples/e2e/patient-banner.spec.ts`                                                                                                                                        |
| HC-B2 | The banner shows two identifiers and the age.                                                                                                                                                   | tested  | `lily-design-system-svelte-sveltekit-examples/e2e/patient-banner.spec.ts`                                                                                                                                        |
| HC-B3 | Allergies are never blank in the banner, and a deceased patient is said in words, not colour alone.                                                                                             | tested  | `lily-design-system-svelte-sveltekit-examples/e2e/patient-banner.spec.ts`                                                                                                                                        |
| HC-I1 | Every national identifier input sets `autocomplete="off"` and `spellcheck="false"`.                                                                                                             | checked | `bin/check-identifier-inputs`                                                                                                                                                                                    |
| HC-I2 | A national identifier view puts the identifier in text only, never in an attribute (`data-*`, `title`, `aria-label`, or a Web Components host's `value`) that a session-replay tool might keep. | tested  | `lily-design-system-svelte-headless-identifiers/components/identifier-views.test.ts`, `lily-design-system-web-components-headless-identifiers/components/identifier-views.test.ts`, `bin/check-identifier-views` |
| HC-Q1 | A filter comparison a partial date cannot decide matches neither the rule nor its negation.                                                                                                     | tested  | `shared/filter-model.partial-date.test.ts`, `lily-design-system-blazor-filter/FilterModelPartialDateTests.cs`                                                                                                    |
| HC-Q2 | A partial date that matches a filter matches it for every day it may stand for.                                                                                                                 | tested  | `shared/filter-model.partial-date.test.ts`                                                                                                                                                                       |

## Adopter rules and declined work

| Id    | Requirement                                                                                            | Status   | Evidence                            |
| ----- | ------------------------------------------------------------------------------------------------------ | -------- | ----------------------------------- |
| HC-G1 | Interruption follows severity: information inline, a warning visible, only a critical item interrupts. | guide    | `docs/patterns/healthcare/index.md` |
| HC-G2 | A summary of withheld entries says how many are not shown, never which or of what kind.                | guide    | `docs/patterns/healthcare/index.md` |
| HC-G3 | A date is unambiguous (the month as a word) and the clock is chosen explicitly.                        | guide    | `docs/patterns/healthcare/index.md` |
| HC-G4 | A patient identifier is kept out of page URLs, logs, error trackers and session replay.                | guide    | `PHI.md`                            |
| HC-X1 | Scores, centiles, interpretations, reference ranges, doses and unit conversions are computed by Lily.  | declined | `spec/healthcare-ui/index.md`       |
| HC-X2 | Limiting a clinician to one open record (no evidence it reduces wrong-patient errors, JAMA 2019).      | declined | `spec/healthcare-ui/index.md`       |
| HC-X3 | Bundled tall man lists, drug or terminology data (licensed, regional and changing).                    | declined | `spec/healthcare-ui/index.md`       |

## Gaps

None. HC-I2, the last, was closed on 2026-11-24 by `bin/check-identifier-views` over all ten catalogs and a rendered test
in Svelte and Web Components; it found that the Web Components views left the identifier in the host element's `value`
attribute, now removed once read.

---

Lily™ and Lily Design System™ are trademarks.
