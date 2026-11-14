# Healthcare user interfaces (planned work)

## Summary

Research on 2026-11-13 into the interface patterns of clinical software: clinical portals and electronic health records, results
and reporting, prescribing and medicines administration, decision support, and hospital operations dashboards. Lily already has a
medical banner, a care card, a patient banner composition, 164 national identifier components and the charts. What it lacks are
the small, safety-critical display contracts that clinical software repeats on every screen: a result with its reference range
and flag, an allergy status that is never blank, a medicine written the safe way, a decision-support card, a patient's age. This
topic proposes seven components, one shared formatting module and five example pages, and declines everything that would put
clinical logic in Lily. Items 1 to 8 were built on 2026-11-14; the rest are open acceptance criteria and tasks in
[tasks.md](../../tasks.md#phase-27--healthcare-user-interfaces-2026-11-13).

## Scope

### In scope

- Display contracts for clinical data: observations and results, allergies, medicines, scores, ages, decision-support cards.
- Rules for the patient banner composition beyond those in [dhcw-design-system-lessons](../dhcw-design-system-lessons/index.md) item 3.
- Shared pure functions for the clinical formatting rules that are about display, not clinical judgement (doses, quantities, ages).
- Example pages that compose existing components into clinical screens: a patient summary, a ward board, a medicines
  administration chart, an observations chart, a handover form.
- Safety guidance for adopters: alert tiering, wrong-patient errors, dates and times, regulation.

### Explicitly out of scope

- **Clinical logic.** Lily never computes an early warning score, a growth centile, a dose, a drug interaction or a reference
  range. Software that does is usually a regulated medical device, and the logic belongs to the adopter's validated code.
- **Clinical content.** No drug database, no tall man list, no SNOMED CT, ICD, LOINC or UCUM codes, no clinical wording.
  These are licensed, regional or both, and they change.
- **Copyrighted instruments.** No Wong-Baker FACES scale, no replica of the NEWS2 chart, no Manchester Triage System.
- **Restrictions on open records.** See the wrong-patient rule below.

## Principles and rules

- **Lily is not a medical device, and must not make an adopter's product more of one.** Components display what the consumer's
  code decided. An adopter building regulated software owns the usability engineering file (IEC 62366-1, the FDA's human factors
  guidance, EU MDR); Lily can supply evidence for it (tests, the self-assessed ACR, the screen-reader matrix), never a
  conformance claim.
- **Never blank, never ambiguous.** A missing value is shown as the consumer's text for why it is missing ("Not known",
  "Not recorded", "Unavailable"), never as `?`, `-` or an empty cell. "No value recorded" and "no such value" are different
  states, and each component that can be empty takes them as distinct props or statuses.
- **Never truncate a safety field.** Names, identifiers, allergies, medicine names and doses wrap; they are never cut with an
  ellipsis. The 320px sweep checks it.
- **Meaning is text first.** An abnormal flag, a score band, an allergy status, a deceased patient: each renders a text or
  `data-*` state the consumer labels, so colour is never the only signal (WCAG 1.4.1). The themes may colour it.
- **Interruption follows severity.** Information is inline; a warning is visible without blocking; only a critical item
  interrupts, and dismissing it asks for a reason. This follows AHRQ's alert-fatigue guidance and the CDS Hooks `indicator`.
  Components carry the severity as data; the consumer chooses the interruption, using `alert-dialog` only for critical.
- **Worldwide by construction.** The standards Lily follows here are international: HL7 FHIR and its v3 observation
  interpretation codes, CDS Hooks, the International Patient Summary (ISO 27269), UCUM units. National rules (NHS CUI, ISMP,
  the Australian Commission's onscreen medicines guidelines, ISMP Canada) are cited where they agree, and offered as options
  where they differ. The locale, the clock and every label stay the consumer's.

## Findings, by area

### Patient identification

- The NHS Common User Interface (CUI, withdrawn in 2019 but still the most detailed public guidance) puts name, date of birth,
  gender and NHS number in a fixed order in the banner's first zone; the family name is upper case and is never truncated; a
  missing value shows "Not known"; a deceased patient's banner differs by pattern as well as colour; age is shown beside the date
  of birth in units that depend on the age (minutes under 2 hours up to years from 18).
- The Joint Commission (Quick Safety 45) asks for two identifiers at all times, a standard identifier display, and names on
  adjacent lines made visually distinct.
- A randomised trial of 3,356 clinicians (JAMA, 2019) found that limiting clinicians to one open record did not reduce
  wrong-patient orders. Lily therefore documents identification, not restriction.

### Results and observations

- FHIR `Observation.interpretation` uses the v3 codes: `N`, `L`, `H`, `LL` and `HH` (critical), `A` (abnormal) and others;
  `referenceRange` has a low, a high or text. These are international and are the natural vocabulary for a flag.
- EHR safety guidance (the EHRA patterns as summarised by AHRQ and others) asks for new results to be separated from prior ones, a
  standard flag format, trends over time, and one consistent display whatever the source.
- Clinicians often look for a significant change rather than the value against a range, because chronic patients may sit
  outside the range permanently. A trend beside the value matters as much as the flag.

### Medicines

- ISMP's guidelines for electronic communication (revised 2025) and its error-prone abbreviation list: generic names in lower
  case except tall man letters; tall man letters from the FDA and ISMP lists; no trailing zero (5 mg, not 5.0 mg); a leading
  zero (0.5 mg, not .5 mg); a space between number and unit; mL, not cc; no apothecary units. Australia and Canada publish their
  own tall man principles, and their lists differ from the US list.
- Medicine and patient names are never truncated.
- A medicines administration record shows past, current and planned administrations with their status, and the safety-critical
  items without the user having to ask.

### Decision support

- CDS Hooks cards have a `summary` under 140 characters, an `indicator` of `info`, `warning` or `critical`, a required `source`
  label, optional `suggestions` (buttons) with `selectionBehavior`, `links`, and `overrideReasons` offered when a card is
  dismissed. The specification leaves rendering to the host system, so a headless card fits it exactly.

### Scores, scales and charts

- Early warning scores differ by country and population (NEWS2 in the UK, not for under-16s or pregnancy; PEWS, MEWS, qSOFA and
  local variants elsewhere). A display component shows a score, a band and the escalation text; it does not score.
- The Wong-Baker FACES scale is licensed: modification, including colour, needs permission, and software use needs a commercial
  licence. Lily's `five-face-rating-picker` is a satisfaction scale and must say it is not a validated pain scale.
- Growth charts with centiles are registered medical devices in at least one country (the RCPCH digital growth charts); the
  chart pattern can draw centile lines the consumer supplies, nothing more.

### Dates and times

- The CUI asks for unambiguous dates (month as text) and the 24-hour clock; NHS England's Federated Data Platform guide asks for
  the 24-hour clock everywhere. That is a UK rule, not a worldwide one: Lily keeps the clock and the date format the consumer's,
  and documents the unambiguous options (`Intl.DateTimeFormat` with `month: "short"` and an explicit `hourCycle`).

### Operations dashboards

- Hospital command centres show live bed state, expected discharges and flow by role, with read-only screens at nursing
  stations (Johns Hopkins, Imperial College Healthcare, Queensland Health). The accessibility risk is live updates: a board that
  announces every change is unusable with a screen reader.

### Clinical summaries

- The International Patient Summary (HL7 FHIR IPS, ISO 27269) requires allergies, medication summary and problems, and records
  an `emptyReason` when a required section has no data. It is an international, cross-border standard and a good model for a
  patient summary page.

## Proposals and decisions

| Item                                      | Lily today                                                                | Decision                                                                                                                                                                                                                                                                                                      |
| ----------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. `observation-view`                     | `measurement-instance-view` shows a value and unit, with no range or flag | **Adopt.** `<span>` with `-value`, `-unit`, `-range` and `-flag` parts; `interpretation` takes a FHIR v3 code and is rendered as `data-interpretation`; the flag's text is the consumer's (`flagLabels`), never a colour alone; `status` distinguishes `final`, `preliminary`, `not-recorded`, `unavailable`. |
| 2. `allergy-list` and `allergy-list-item` | `medical-banner-box-for-danger` holds free content                        | **Adopt.** A required `status` of `known`, `none-known`, `not-recorded` or `unavailable`, each with consumer text, so the state is never blank; items are `<li>` with substance, reaction and severity parts and a last-updated `<time>`.                                                                     |
| 3. `medication-view`                      | none                                                                      | **Adopt.** `<span>` with name, strength, form, route and frequency parts; never truncated; tall man letters come from the consumer as marked segments (Lily ships no list); the dose is formatted by item 8.                                                                                                  |
| 4. `decision-support-card`                | `alert`, `care-card`                                                      | **Adopt.** The CDS Hooks card shape: required `summary`, `indicator` and `source` label; optional detail (slot), suggestion buttons, links and override reasons; `data-indicator` for the themes. Not a live region by default; the consumer decides whether a critical card interrupts.                      |
| 5. `early-warning-score-view`             | `gauge-chart`                                                             | **Adopt, display only.** A score, its band as `data-band`, and the consumer's escalation text; the scoring system's name is a prop. It computes nothing.                                                                                                                                                      |
| 6. `age-view`                             | `date-time-view`                                                          | **Adopt.** A `<span>` (or `<time>` with a duration) showing an age in the units the consumer chooses, from an `ageParts()` helper (item 8) that returns the CUI's age bands as numbers; words come from `Intl.DurationFormat` or the consumer.                                                                |
| 7. Patient banner rules                   | a documented composition (DHCW item 3)                                    | **Adopt** as rules and tests on the composition: two identifiers, a deceased state as `data-deceased` plus text, consumer text for missing values, no truncation at 320px, allergies through item 2.                                                                                                          |
| 8. `shared/clinical-format.ts`            | none                                                                      | **Adopt.** Pure functions with tests: `formatQuantity(value, unit, locale)` (no trailing zero, a leading zero, a space before the unit, via `Intl.NumberFormat`), `ageParts(birth, at)`. No clinical judgement, no unit conversion.                                                                           |
| 9. Example pages                          | `/contact-form`, `/dashboard` and others                                  | **Adopt** in the SvelteKit app first: an IPS patient summary, a ward board (live updates summarised, not announced one by one), a medicines administration chart on `data-table`, an observations chart on `line-chart` with its data table, an SBAR handover form.                                           |
| 10. Adopter guidance                      | none                                                                      | **Adopt** as `docs/patterns/healthcare.md`: alert tiering, wrong-patient safeguards, dates and times, the regulation note, and what Lily does not do.                                                                                                                                                         |
| 11. `body-map`                            | none                                                                      | **Maintainer decision.** A consumer-supplied SVG of the body whose regions are real buttons, with a list alternative. Useful for wounds and pain sites; build only for a real use.                                                                                                                            |
| 12. A numeric rating scale (0 to 10)      | `net-promoter-score-picker` is 0 to 10                                    | **Maintainer decision.** Generalise or add `numeric-rating-scale-picker` with consumer-supplied anchors. In the meantime, document that `five-face-rating-picker` is not a pain scale.                                                                                                                        |
| Scoring, centiles, dose calculation       | —                                                                         | **Decline.** Clinical logic.                                                                                                                                                                                                                                                                                  |
| Wong-Baker FACES, a NEWS2 chart replica   | —                                                                         | **Decline.** Licensed or someone else's design.                                                                                                                                                                                                                                                               |
| Tall man lists, drug and terminology data | —                                                                         | **Decline.** Licensed, regional, changing; the consumer supplies them.                                                                                                                                                                                                                                        |
| Limiting the number of open records       | —                                                                         | **Decline.** No evidence it reduces wrong-patient errors (JAMA 2019); clinicians work around it.                                                                                                                                                                                                              |

## Acceptance criteria

- [x] 1. `observation-view` in all nine catalogs, with tests that each interpretation code renders its consumer label and its
      `data-interpretation`, and that `not-recorded` and `unavailable` render different text.
- [x] 2. `allergy-list` and `allergy-list-item` in all nine catalogs; a missing `status` is a development warning; each status
      renders its consumer text.
- [x] 3. `medication-view` in all nine catalogs; tall man segments render as marked parts; the 320px sweep shows no truncation.
- [x] 4. `decision-support-card` in all nine catalogs; suggestions are buttons, links are links, dismissing with
      `overrideReasons` asks for one; key and ARIA tests.
- [x] 5. `early-warning-score-view` in all nine catalogs; it has no scoring code (a review check in its `AGENTS.md`).
- [x] 6. `age-view` and `ageParts()` with tests at each band boundary.
- [x] 7. The patient banner rules are in `medical-banner`'s docs and `AGENTS/components.md`, with an e2e test at 320px.
- [x] 8. `shared/clinical-format.ts` with tests, synced by `bin/sync-shared-modules`.
- [ ] 9. The five example pages exist in the SvelteKit app, pass axe, and are reachable by keyboard alone.
- [x] 10. `docs/patterns/healthcare.md` exists and is linked from each healthcare component's page.
- [x] 11–12. Each maintainer decision is recorded here: `body-map` and a 0 to 10 rating scale were both approved on 2026-11-14 (tasks.md P27-T11, P27-T12).

## Adopter guide

[docs/patterns/healthcare.md](../../docs/patterns/healthcare.md): what Lily does and does not do, alert tiering,
wrong-patient safeguards, the patient banner, results, medicines, dates and times, dashboards.

## Related topics

- [dhcw-design-system-lessons](../dhcw-design-system-lessons/index.md) — the patient banner composition (item 3).
- [national-identifiers](../national-identifiers/index.md) — the identifier `-view` components the banner uses.
- [accessibility](../accessibility/index.md) — live regions, colour, the screen-reader matrix.
- [internationalization](../internationalization/index.md) — locale, clock and label rules.
- [components](../components/index.md) — naming and the suffix table.
- [examples](../examples/index.md) — composed page demonstrations.

## Sources

- NHS Common User Interface (withdrawn 2019), unofficial mirror: [patient banner](https://pacharanero.github.io/nhs-cui/patient-identification-and-information-entry-and-display/patben),
  [date display](https://pacharanero.github.io/nhs-cui/patient-identification-and-information-entry-and-display/datedisplay),
  [time display](https://pacharanero.github.io/nhs-cui/patient-identification-and-information-entry-and-display/timedisplay);
  [why it was withdrawn](https://nhsd-proxy.openprescribing.net/blog/transformation-blog/2019/why-we-are-withdrawing-the-nhs-common-user-interface);
  [NHS standards entry](https://standards.nhs.uk/published-standards/common-user-interface-standards). Verify against the
  National Archives copies before relying on details.
- [NHS England Federated Data Platform design guide](https://nhsengland.github.io/fdp-design-guide) (24-hour clock).
- [CDS Hooks 2.0](https://cds-hooks.hl7.org/2.0/) (card fields, display and feedback).
- [FHIR Observation](https://hl7.org/fhir/observation.html) and the [v3 ObservationInterpretation codes](https://tx5.health-samurai.io/ui/vs/observation-interpretation).
- [International Patient Summary IG](https://hl7.org/fhir/uv/ips/Structure-of-the-International-Patient-Summary.html).
- ISMP: [Guidelines for safe electronic communication of medication information](https://online.ecri.org/hubfs/ISMP/Resources/ISMP_Electronic_Guidelines.pdf),
  [error-prone abbreviations list](https://online.ecri.org/hubfs/ISMP/Resources/ISMP_ErrorProneAbbreviation_List.pdf);
  [ISMP Canada TALLman principles](https://www.ismp-canada.org/download/TALLman/Principles_for_the_Application_of_TALLman_Lettering_in_Canada.pdf);
  [Australian Commission on Safety and Quality in Health Care, mixed-case lettering principles](https://safetyandquality.gov.au/sites/default/files/2024-05/mixed-case_lettering_-_principles_for_application.docx).
- [AHRQ PSNet primer: alert fatigue](https://psnet.ahrq.gov/primer/alert-fatigue).
- [The Joint Commission, Quick Safety 45: patient identification](https://www.jointcommission.org/resources/news-and-multimedia/newsletters/newsletters/quick-safety/quick-safety-45-people-processes-health-it-and-accurate-patient-identification);
  [wrong-patient errors with multiple records open, JAMA 2019](https://pubmed.ncbi.nlm.nih.gov/31087021/).
- [UTHealth EHR usability guidelines](https://sbmi.uth.edu/nccd/ehrusability/design/guidelines/results.htm) (medication
  display and administration items from NIST-7865 and the Microsoft CUI).
- [Wong-Baker FACES licensing](https://wongbakerfaces.org/licensing-dashboard/); [RCPCH digital growth charts](https://www.rcpch.ac.uk/resources/growth-charts/digital/about).
- Usability engineering: [Johner Institute on IEC 62366](https://blog.johner-institute.com/iec-62366-usability),
  [NAMSA on the regulatory framework](https://namsa.com/resources/blog/regulatory-human-factors-usability-engineering-medical-devices/).
- Operations: [Johns Hopkins command center](https://www.hopkinsmedicine.org/news/articles/command-center-to-improve-patient-flow),
  [Imperial College Healthcare command centre](https://WWW.IMPERIAL.NHS.UK/about-us/blog/command-centre-winter-pressures).
- [Creedon, electronic early warning observation chart design (UCC thesis, 2016)](https://cora.ucc.ie/bitstreams/13e11683-b022-4a1d-9baf-eaa6b5136a75/download).

Lily™ and Lily Design System™ are trademarks.
