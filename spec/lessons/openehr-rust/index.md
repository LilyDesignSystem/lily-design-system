# Lessons from openehr-rust (planned work)

## Summary

A review (2026-11-24) of [openehr-rust](https://github.com/openehr-rust/openehr-rust), a Rust implementation of the openEHR
Reference Model with SQL persistence, an archetype parser and an HTTP service. Lily already learned the openEHR _data model_
in [spec/lessons/openehr](../openehr/index.md) (Phase 29, all built). This review asks a different question: what does a careful
implementation of that model teach a UI library about handling the values once they arrive? Its answers are about precision,
errors that leak patient data, comparisons that must fail closed, and how a health software project states what it does with
patient data. Most of it is server-side and declined; seven items are small, concrete changes to Lily.

## Scope

### In scope

- The library crate's specification (`openehr/spec/`): data types (`D3`), validation (`L10`), security (`X11`), the
  ambiguities register and the conformance matrix.
- The project's practices: `PHI.md`, `COMPARISONS.md`, the coverage floor, the external corpus runs.
- Lily's `shared/clinical-format.ts`, its C# port, the healthcare guide, and the helpers that sort and filter dates.

### Explicitly out of scope

- Persistence, the SQL dialects, the HTTP service, AQL, archetype parsing, access control and the audit chain. They are data
  storage and transport, which Lily never does ([AGENTS/headless.md](../../../AGENTS/headless.md), behaviour boundaries).
- Anything already decided in [spec/lessons/openehr](../openehr/index.md).

## Principles and rules

- **Do not invent clinical facts.** openehr-rust's rule `D3.9` ("a completed date is a fabricated clinical fact") is the same
  rule Lily's healthcare work follows. A formatter that drops recorded precision or completes a partial value breaks it too.
- **An error message is where patient data leaks.** `X11.7`: "no error may echo a submitted value. An error message is the one
  place a value reaches a log, a response, and a support ticket at once." In a browser the same message reaches the console,
  an error tracker and a screenshot in a bug report.
- **Undecidable means no.** `D3.14a`: a comparison that cannot be decided never admits a value into a range. A filter that
  matched a value it could not order would report it as matching.
- **Say plainly what the software does with patient data, and what it does not do.**

## Findings

### Errors that echo values

`shared/clinical-format.ts` puts the submitted value in its errors in eleven places (six `RangeError`s and five `MeterScaleError`s), for example
`` `not a partial ISO 8601 date: ${iso}` ``, `` `ageParts: not a date: ${value}` `` (a birth date),
`` `formatRange: low ${low} is above high ${high}` `` (a lab result) and `` `not an ISO 8601 duration: ${iso}` ``. These are
`RangeError`s a consumer can catch and log, and an error tracker records them with the page URL, which often holds the patient
id. `shared/national-identifiers.ts` already does it right: it names the type, never the value. Echoing a closed vocabulary (a
comparator, a proportion kind) is fine, as openehr-rust's `X11.7a` allows for design-time vocabulary.

### Recorded precision

`formatQuantity` takes a JavaScript `number` and writes it with no trailing zero. That is the right rule for a **dose**: "1.0 mg"
can be misread as "10 mg". It is the wrong rule for a **result**: a laboratory that reports "1.50 mmol/L" is stating precision
to two decimal places, which openEHR records as `DV_QUANTITY.precision` (`D3.18d`, `D3.20`), and "1.5" silently halves it. A
`number` cannot carry the difference, so the caller has to pass it. The healthcare guide states only the dose rule today.

### Durations and date-times

- `durationParts` accepts `.` as the decimal sign in seconds but not `,`, which ISO 8601 and openEHR's own grammar both allow
  (`D3.10b`). It already accepts openEHR's leading `-` and refuses designators out of order (`D3.13`).
- openehr-rust accepts a leap second (`23:59:60`, `D3.12`) so a record that captured one is not rejected. JavaScript's `Date`
  cannot represent it. Whether `date-time-view` and the helpers survive one is untested.
- Lily's partial-date parser already refuses the ISO basic format (`20240517`), as `D3.13a` does, for the same reason: `2024`
  would be ambiguous.

### Partial dates in sorts and filters

The data grid's date cell type accepts a full `YYYY-MM-DD` only (`isCivilDate` in `shared/cell-types.ts`), so a partial date
falls back to text. Text sorting of ISO dates happens to order them sensibly. A date filter cannot: "before 2019-06-01" can
neither include nor exclude `2019`. openehr-rust answers "not comparable" and treats that as "not contained" (`D3.14`,
`D3.14a`). The `filter` helper's model has no partial-date field type, so the question has never come up.

### Withheld entries

openehr-rust redacts by masking, never deleting (`X11.20`): deleting a withheld entry turns "the patient withheld their sexual
health history" into "the patient has no sexual health history". Redaction reports **how much** it withheld and never **what**
(`X11.22`). Lily's healthcare guide already keeps a withheld entry in the list with the consumer's words (from
[spec/lessons/zoblocks](../zoblocks/index.md)). It does not yet say what a summary may disclose ("2 entries are not shown to
you" is right; naming their category is not).

### Saying what the software does with patient data

openehr-rust's `PHI.md` answers a privacy officer's questions in one table: does it send data anywhere, phone home, embed an AI
model, write PHI to logs, record who read a record. Every answer cites the requirement that makes it true, and "no" is said
plainly where the answer is no. Lily is often asked the same questions by health adopters and has no single place that answers
them. The answers are mostly good:

- no telemetry;
- no network request from a headless component;
- identifier inputs with `autocomplete="off"` and `spellcheck="false"` (`bin/check-identifier-inputs`);
- identifier views that put the value in text only, never in a `data-*` attribute that a session-replay tool would record;
- `localStorage` holds the pickers' preferences only.

### Practices

- **A coverage floor that only moves up.** `coverage-floor.tsv` lists, per workspace, the uncovered lines and functions allowed;
  a workspace may not fall below its floor and must lower the floor when it beats it. Lily's `bin/coverage-report` measures
  `shared/`, Svelte headless and Blazor headless but gates nothing, so a drop is invisible.
- **A corpus it did not write.** `json_corpus.md` runs real canonical JSON compositions from the EHRbase SDK through the parser,
  read in place and never copied (licence), as an ignored test: "a conformance claim graded only by its own tests is the
  weakest kind". Lily's clinical formatters are tested only on cases Lily wrote.
- **Permanent requirement ids cited from tests** (`D3.9`, `X11.7`) and a conformance matrix marking each as tested, untested,
  type-enforced or declined. Lily's healthcare contracts are acceptance-criteria checkboxes, which cannot be cited from a test.
- **Honest comparisons.** `COMPARISONS.md` is "deliberately unflattering where the facts are". Lily's `COMPARE.md` already
  has a "where the alternatives are stronger" section.

## Proposals and decisions

| Item                                          | Lily today                                                  | Decision                                                                                                                                                                                                                                                                                         |
| --------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1. Errors never echo a clinical value         | eleven errors in `shared/clinical-format.ts` echo the value | **Adopt.** Each error names the function, the parameter and the rule broken, never the value; a closed vocabulary (a comparator, a kind) may be named. A test passes a sentinel value to every function and asserts it never appears in a thrown message. The C# `ClinicalFormat` port the same. |
| 2. Recorded precision for results             | `formatQuantity` always drops trailing zeros                | **Adopt.** An optional `precision` (decimal places, openEHR's `DV_QUANTITY.precision`) on `formatQuantity` and `formatRange` writes exactly that many places. The guide: a dose never has a trailing zero; a result keeps the places the laboratory reported.                                    |
| 3. `,` as a decimal sign in durations         | `.` only                                                    | **Adopt.** `durationParts` accepts `PT1,5S`, keeps the value, and the `<time datetime>` it builds uses `.` (HTML's form).                                                                                                                                                                        |
| 4. Leap seconds                               | untested                                                    | **Investigate.** A test that `date-time-view` and the data grid accept `2016-12-31T23:59:60Z` and render the consumer's text without throwing; fix whatever fails. Never adjust the second.                                                                                                      |
| 5. Partial dates in the filter and data grid  | full dates only; partial dates fall back to text            | **Consider** (maintainer decision). A partial-date field and cell type in the `filter` model and the data grid: sorted by the components they have, and a comparison that cannot be decided does not match, in every output (JSON, SQL, MongoDB, OData, predicate).                              |
| 6. A summary of withheld entries              | withheld entries stay in the list                           | **Adopt** a guide rule: a summary may say how many entries are not shown, never which or of what kind.                                                                                                                                                                                           |
| 7. `PHI.md`                                   | none                                                        | **Adopt.** A plain-language page for a privacy review: what the headless layer, the helpers, the themes and the example apps do with patient data, each answer citing the check or contract that makes it true, with the gaps said plainly (an adopter's own logging, printing, screenshots).    |
| 8. A coverage floor                           | `bin/coverage-report` measures, gates nothing               | **Adopt.** `coverage-floor.tsv` for the three measured suites, read by `bin/coverage-report --check` in `bin/ci --full` (too slow for `bin/test`): it fails a drop and requires the floor to be lowered when beaten.                                                                             |
| 9. A clinical-format corpus run               | Lily's own cases only                                       | **Consider.** An ignored test that reads the EHRbase SDK's canonical JSON in place (never copied), feeds every `DV_QUANTITY`, `DV_DATE*`, `DV_DURATION` and `DV_PROPORTION` to the formatters, and reports any that throw or lose a digit.                                                       |
| 10. Requirement ids for the healthcare work   | acceptance-criteria checkboxes                              | **Consider** (maintainer decision). Permanent ids for the safety-relevant rules in [spec/healthcare-ui](../../healthcare-ui/index.md), cited from the tests that check them. Worth it only if a regulated adopter asks.                                                                          |
| 11. A worked openEHR example                  | the mapping table in the healthcare guide                   | **Adopt.** One canonical JSON `DV_QUANTITY` (with `precision` and `magnitude_status`) and one partial `DV_DATE`, shown beside the Lily props they become. It makes items 2 and 3 concrete for adopters.                                                                                          |
| Accuracy (`± 2 bpm`)                          | none                                                        | **Defer.** openEHR `DV_AMOUNT.accuracy` is real but rare on screen; revisit if an adopter shows a device reading that needs it.                                                                                                                                                                  |
| Audit chain, redaction engine, access control | —                                                           | **Decline.** Server-side, and Lily stores nothing.                                                                                                                                                                                                                                               |
| Persistence, AQL, REST, archetypes            | —                                                           | **Decline.** Data fetching, storage and clinical content ([spec/lessons/openehr](../openehr/index.md)).                                                                                                                                                                                          |

## Advice

Do **1** first. It is small, it is a real leak, and an error tracker on a clinical page makes it happen in production without
anyone noticing. Then **2**, which is the one place Lily's formatters can change what a result means. **3**, **6** and **11** are
an hour each. **7** and **8** are the project practices most worth copying: health adopters ask the questions `PHI.md` answers,
and a coverage floor turns "aim for 100%" into something that cannot slip back. **4** may find nothing. **5**, **9** and **10**
should wait for an adopter who needs them.

## Acceptance criteria

- [x] No error thrown by `shared/clinical-format.ts` or its C# port contains the value it was given (item 1).
- [x] `formatQuantity(1.5, "mmol/L", "en", undefined, { precision: 2 })` writes `1.50 mmol/L`, and the guide states the dose and
      result rules (item 2).
- [x] `durationParts("PT1,5S")` returns 1.5 seconds (item 3).
- [x] A leap-second test exists for `date-time-view` and the data grid (item 4).
- [x] The healthcare guide has the withheld-summary rule (item 6) and the worked openEHR example (item 11).
- [x] `PHI.md` exists, is linked from `index.md`, `SECURITY.md` and `llms.txt`, and every answer cites a check or a contract
      (item 7).
- [x] `coverage-floor.tsv` exists and `bin/coverage-report --floor-only` (`bin/ci --job coverage-floor`) fails a drop (item 8).
- [x] A corpus run is recorded, with the corpus commit (item 9).

## Decisions

- **2026-11-24, item 4 (P47-T4b): a leap second stays read-only in the data grid. Declined.** Editing `HH:mm:60` would need a
  text editor in place of the native time input for every time cell, losing its picker, its keyboard and its screen-reader
  support for a value almost no record holds: none has been added since 2016, and they are to end by 2035. The grid keeps a
  `:60` value exactly as written, flags it, and never changes it, which is the rule that matters.
- **2026-11-24, item 9 (P47-T9): a corpus run. Adopted**; run 1 is below.
- **2026-11-24, item 10 (P47-T10): requirement ids. Adopted**, because adopters asked for them:
  [spec/healthcare-ui/requirements.md](../../healthcare-ui/requirements.md), checked by `bin/check-healthcare-requirements`.

## Corpus run (item 9)

`shared/clinical-format.corpus.test.ts` reads the EHRbase SDK's canonical JSON compositions in place (Apache-2.0 test data of
another project, never copied here) and feeds every value to the formatters. It is skipped unless `OPENEHR_JSON_CORPUS` names the
directory; the file's header has the command, and `OPENEHR_JSON_CORPUS_REPORT` writes one TSV row per value.

**Run 1, 2026-11-24**, `ehrbase/openEHR_SDK` at `e07110a2d969d6971ff157b93288f64ee30764af`,
`test-data/src/main/resources/composition/canonical_json` (57 files): 155 values, none refused wrongly. The 100 quantities and counts were read back with no digit lost; the
dates, durations, proportions and ranges were checked only for being accepted or refused as expected (corrected
2026-11-24; P48-T9 reads them back too).

| Type            | Values | Outcome                                                                                                                                                       |
| --------------- | -----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DV_QUANTITY`   |     73 | All written; each reads back to its magnitude. `magnitude_status` `"="` (exact) is written with no sign; `precision` 0 and 1 kept.                            |
| `DV_COUNT`      |     27 | All written.                                                                                                                                                  |
| `DV_DURATION`   |     33 | All parsed. 11 with years, months or weeks have no HTML `datetime` form, by design (HTML has no such units); the other 22 have one.                           |
| `DV_DATE`       |     13 | 10 written. 3 are `"20190114"`, ISO 8601's basic format, and are refused: openEHR requires the extended format, as openehr-rust's `D3.13a` and `A-02` record. |
| `DV_PROPORTION` |      6 | All written.                                                                                                                                                  |
| `DV_INTERVAL`   |      3 | All three quantity ranges written by `formatRange`.                                                                                                           |

**Run 2, 2026-11-25 (P48-T9)**: every type is read back from what was written, not only accepted, and a test that needs no corpus
plants a wrong formatter for each type and requires the check to catch it. The same openEHR commit: 155 values, all read back. And
three sets of FHIR examples from other countries, each the `example` directory of a CC0-1.0 package from packages.fhir.org:

| Package (SHA-256 of the download)                                   | Values | What they are                                                     |
| ------------------------------------------------------------------- | -----: | ----------------------------------------------------------------- |
| `hl7.fhir.au.core` 2.0.0, Australia (`e202166028f37001…`)           |     58 | 20 quantities, 8 reference range values, 30 partial or full dates |
| `ch.fhir.ig.ch-lab-report` 2.0.0, Switzerland (`6c23a4493433e48e…`) |    185 | 87 quantities, 94 reference range values, 4 dates                 |
| `hl7.fhir.eu.laboratory` 2.1.0, EU (`87019c396f4cff93…`)            |     44 | 19 quantities, 17 reference range values, 1 ratio, 7 dates        |

All 287 read back. They are example records written for implementation guides, not patient records; FHIR's JSON decimals are read as
numbers, so a trailing zero in them is not tested; none holds an ISO 8601 duration. A range counts three times: both its ends and itself.

Not exercised: `DV_DATE_TIME` (314) and `DV_TIME` (9), since Lily has no formatter of its own for them (`date-time-view` shows the
consumer's text), and `DV_ORDINAL`, `DV_TEXT` and the other non-numeric types. The run found one defect, in the test itself: it
read the result back splitting on a space, where the formatter writes a no-break space.

## Related topics

- [lessons/openehr](../openehr/index.md) — the openEHR data model, Phase 29.
- [healthcare-ui](../../healthcare-ui/index.md) — the clinical components and the safety rules.
- [national-identifiers](../../national-identifiers/index.md) — the identifier inputs and views.
- [helpers](../../helpers/index.md) — the `filter` and data grid that item 5 touches.
- [testing](../../testing/index.md) — where the coverage floor would sit.

## Sources

- `~/git/openehr-rust/openehr-rust`, read 2026-11-24 at `bd92e53`: `openehr/spec/03-data-types.md`,
  `openehr/spec/10-validation.md`, `openehr/spec/11-security.md`, `openehr/spec/ambiguities.md`,
  `openehr/spec/conformance-matrix.md`, `openehr/spec/json_corpus.md`, `PHI.md`, `COMPARISONS.md`, `coverage-floor.tsv`.
- [`shared/clinical-format.ts`](../../../shared/clinical-format.ts), [`shared/cell-types.ts`](../../../shared/cell-types.ts),
  [`shared/national-identifiers.ts`](../../../shared/national-identifiers.ts).
- [`docs/patterns/healthcare/index.md`](../../../docs/patterns/healthcare/index.md).

---

Lily™ and Lily Design System™ are trademarks.
