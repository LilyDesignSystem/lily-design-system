# Lessons from OpenEMR (planned work)

## Summary

A review on 2026-11-16 of [OpenEMR](https://www.open-emr.org/), the open-source (GPL) electronic health record and practice
management application, ONC-certified in the United States (version 8). Unlike openEHR, it is a working application, so its lessons
are screens: the patient dashboard, the patient flow board, the scheduling calendar, encounters with vitals, growth charts, SOAP
notes and review of systems, the patient finder, the message centre, clinical reminders, and the fee sheet. Lily already has
most of the parts: the record lists, `international-patient-summary`, the patient banner composition, the calendar helper, the
data grid and the `/ward-board` page. What OpenEMR shows is where those parts are composed badly in practice: status by colour
alone, a blinking overdue entry, a board that refreshes itself every 20 seconds, several patients open in tabs, and a review of
systems where "not asked" and "denied" look the same. The proposals are four example pages, three rules for the healthcare
guide, one checked audit of the calendar helper, and a tri-state answer pattern. Most of OpenEMR (billing, claims, US code sets,
e-prescribing, access control) is declined: it is application logic, US-specific, or both. Nothing here is built yet; tasks are in
[tasks.md](../../../tasks.md#phase-30--lessons-from-openemr-2026-11-16).

## Scope

### In scope

- OpenEMR's clinical and front-desk screens, as compositions of existing Lily components.
- The accessibility and safety defects those screens commonly carry, as rules for adopters.
- Gaps in Lily components that the screens reveal.

### Explicitly out of scope

- **Billing and revenue cycle**: the fee sheet's pricing levels, ANSI X12 5010 claims, ERA posting, eligibility. Application logic,
  and US-specific (the worldwide rule in [internationalization](../../internationalization/index.md)).
- **Code sets**: CPT (licensed by the American Medical Association), HCPCS, ICD-10-CM. Lily ships no terminology.
- **E-prescribing, lab interfaces, CCDA and FHIR exchange, Direct messaging, DICOM viewing.** Integrations and data handling.
- **Access control, layout-based form builders, customisable demographics.** Application features, not components.

## Principles and rules

- **An application is evidence, not a reference design.** OpenEMR's screens show what clinics need; their markup is not the
  model. Lily's contracts and the [healthcare guide](../../../docs/patterns/healthcare/index.md) win where they differ.
- **Colour is a hint, never the status.** OpenEMR colours each appointment status and calendar category; a Lily composition
  always carries the status as text (WCAG 1.4.1).
- **Nothing blinks, and nothing updates without the user's control.** OpenEMR's flow board blinks an entry past its alert time and
  refreshes on a timer. Blinking content fails WCAG 2.2.2 when it lasts more than five seconds and risks 2.3.1; automatic updates
  need a pause or a manual refresh (2.2.2) and must not move focus.
- **The patient is named wherever a patient is open.** A workspace with several records open names the patient in every tab and
  on every panel, with two identifiers.

## Findings, by screen

From the [features list](https://open-emr.org/wiki/index.php/OpenEMR_Features), the
[v6+ walkthrough](https://www.open-emr.org/wiki/index.php/OpenEMR_v6%2B_Walkthrough) and the
[Patient Flow Board](https://www.open-emr.org/wiki/index.php/Patient_Flow_Board) page:

| Screen                     | What OpenEMR does                                                                                                                                                                                            | Lily today                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Tabbed workspace           | Each open page is a tab that stays open, with reload and close; the menu greys out patient items until a patient is open                                                                                     | `tab-bar`; the wrong-patient rules in the guide                                                 |
| Patient finder             | A multi-field search with configurable result columns; a separate "Manage Duplicates" admin tool                                                                                                             | `search-input`, `data-grid`, `form`                                                             |
| Patient dashboard          | The open patient's chart: demographics, problems, allergies, medications, prescriptions, immunizations, reminders, appointments, vitals, billing, care team                                                  | the record lists, `international-patient-summary`, the summary card pattern, `/patient-summary` |
| Flow board                 | Today's appointments with status, room, time in status and total time since arrival; each status has a colour and an alert time after which the entry blinks; refresh every 20 seconds by default, or manual | `/ward-board` (changes summarised in one polite region), `timer`, `status-tag`, `data-table`    |
| Calendar                   | Open-slot search, appointment categories colour-coded by type and facility, repeating appointments, type restrictions                                                                                        | the `calendar` helper (marked ranges carry text since 2026-10)                                  |
| Recall board and reminders | Dated reminders and recalls; clinical reminders computed by a rules engine, shown as due, soon due or past due                                                                                               | `record-list`, `review-date`, `decision-support-card`                                           |
| Encounter: vitals          | Vitals entry in US or metric units, with growth charts for children                                                                                                                                          | `observation-view`, `line-chart`, `measurement-unit-input`                                      |
| Encounter: SOAP and ROS    | A SOAP note (four free-text sections) and a review of systems: many symptoms per body system, each positive or negative                                                                                      | `/handover` (SBAR), `fieldset`, `radio-group`, `checkbox-group`                                 |
| Message centre             | Staff messages (not part of the record), dated reminders, recalls                                                                                                                                            | the chat components                                                                             |
| Fee sheet and billing      | Code search by first letters, price levels as columns, claims                                                                                                                                                | `combobox`                                                                                      |
| Languages                  | About 34 languages, right-to-left included, several in one clinic                                                                                                                                            | Lily's `locale-picker`, RTL and label packs                                                     |

## Proposals and decisions

| Item                                               | Lily today                           | Decision                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. A clinic flow board page                        | `/ward-board` (inpatient)            | **Adopt** `/flow-board` in the SvelteKit app: a `data-table` of today's appointments with time, patient (two identifiers), status as text, room, and time in status as a `<time datetime="PT25M">`. An overdue entry gets `data-overdue` and the words "Waiting over 20 minutes", never a blink. Updates arrive only when the user presses Refresh, or with a visible pause control, and are summarised in one polite region. |
| 2. A patient dashboard page                        | `/patient-summary` (read-only IPS)   | **Adopt** `/patient-dashboard`: summary cards for problems, allergies, medications, immunizations, reminders and upcoming appointments, each a record list with its never-blank status and a "Change" or "Add" action named for what it changes. The banner is the patient banner composition. Show what a working dashboard adds to a read-only summary: actions, and dates of last review.                                  |
| 3. Several patients open                           | wrong-patient rules (P27-T10)        | **Adopt a guide rule.** When an application keeps several records open (tabs, windows, split panes), each tab's accessible name and visible text include the patient's name and a second identifier, the active panel repeats the banner, and an action never applies to a patient other than the one on its panel. Lily's guidance still declines limiting the number of open records (JAMA 2019).                           |
| 4. Find a patient page                             | `search-input`, `data-grid`          | **Adopt** `/find-patient`: a search form with several fields, a results table that shows two identifiers per row, a "no results" state in words, and no automatic opening of a single match, so the user always confirms the patient. Possible duplicates are listed side by side as text, never merged by the page.                                                                                                          |
| 5. Tri-state answers (review of systems)           | `radio-group`, `checkbox-group`      | **Adopt as a pattern.** Each symptom is a `radio-group` of three consumer-worded answers (present, absent, not asked), defaulting to none chosen, in one `fieldset` per body system, with an optional "all others absent" button that sets only the unanswered ones. A checkbox cannot tell "denied" from "not asked", which is the defect.                                                                                   |
| 6. The `calendar` helper against clinic scheduling | events, marked ranges with labels    | **Investigate.** Check that an event's category is text as well as colour, that a free slot can be marked and found by keyboard, and that a repeating series says it repeats in words. Record each gap as a task or a non-goal; do not add recurrence rules (consumer logic).                                                                                                                                                 |
| 7. Vitals in two unit systems                      | `observation-view`, `formatQuantity` | **Adopt as a pattern**, with openEHR item 12 (`quantity-input-div`): one value entered in the unit the user chose and shown with the other system's value beside it as the consumer's text ("70 kg (154 lb)"). Lily converts nothing; the conversion is the consumer's and its rounding must be stated.                                                                                                                       |
| 8. Growth charts                                   | `line-chart`                         | **Adopt as a pattern**: a `line-chart` with the consumer's centile lines as series, the child's points, and the data table with each reading's age and value. Lily computes no centile (healthcare-ui declines it) and bundles no growth reference.                                                                                                                                                                           |
| 9. Due and overdue reminders                       | `record-list`, `review-date`         | **Adopt a guide mapping**: a reminder list is a `record-list` whose items carry a due date (`review-date`) and a due state in words (`data-due="due"`, `"soon"`, `"overdue"`); the rule that produced it is the adopter's.                                                                                                                                                                                                    |
| Fee sheet, claims, price levels                    | —                                    | **Decline.** Billing logic, US-specific.                                                                                                                                                                                                                                                                                                                                                                                      |
| CPT, HCPCS, ICD-10-CM code search data             | —                                    | **Decline the data**; the search itself is `combobox` with the consumer's results.                                                                                                                                                                                                                                                                                                                                            |
| A US prescriber identifier (NPI, DEA) component    | —                                    | **Defer.** A real candidate for the national identifiers (NPI has a check digit), but a provider identifier, not a personal one; consider it only alongside the other countries' provider identifiers, per the worldwide rule.                                                                                                                                                                                                |
| Layout-based form builder, access control, DICOM   | —                                    | **Decline.** Application features.                                                                                                                                                                                                                                                                                                                                                                                            |
| A message centre                                   | chat components                      | **Decline** a new component; staff messages are not a clinical record, and the chat components cover the markup.                                                                                                                                                                                                                                                                                                              |

## Advice

OpenEMR adds no new components to Lily's catalog, and that is the useful finding: the healthcare work of Phases 27 and 28 covers
what a full EHR's clinical screens need. What it does show is how those screens go wrong. Do **5 (tri-state answers)** and
**3 (several patients open)** first: both are safety rules, cheap to write, and not in the guide today. Then **1 (flow board)**,
which is where blinking and auto-refresh live, and **4 (find a patient)**. **2** and **6** are larger: the dashboard page
repays the effort only once openEHR's provenance and "whose record" items (openEHR items 9 and 10) land, so a card can show who
reviewed it and when. Treat **7** to **9** as guide content. Keep billing, codes and integrations out entirely: they are the bulk
of OpenEMR, and none of it is a user-interface contract.

## Acceptance criteria

- [ ] `/flow-board`, `/patient-dashboard` and `/find-patient` exist in the SvelteKit app, each with an e2e spec and axe-clean (items 1, 2, 4).
- [ ] The flow board never blinks, and updates only on request or with a pause control; a test checks no element animates (item 1).
- [ ] The guide has the several-patients rule, the tri-state answers pattern, the two-unit vitals, growth chart and reminder patterns (items 3, 5, 7, 8, 9).
- [x] The calendar audit is recorded, each finding a task or a non-goal (item 6).

## Related topics

- [healthcare-ui](../../healthcare-ui/index.md) — the components these pages compose.
- [openehr](../openehr/index.md) — lessons from the openEHR standard, the same day.
- [accessibility](../../accessibility/index.md) — WCAG 1.4.1, 2.2.2 and 2.3.1.
- [helpers](../../helpers/index.md) — the `calendar` helper.

## Sources

- [OpenEMR](https://www.open-emr.org/)
- [OpenEMR features](https://open-emr.org/wiki/index.php/OpenEMR_Features)
- [OpenEMR v6+ walkthrough](https://www.open-emr.org/wiki/index.php/OpenEMR_v6%2B_Walkthrough)
- [Patient Flow Board](https://www.open-emr.org/wiki/index.php/Patient_Flow_Board)
- [OpenEMR on GitHub](https://github.com/openemr)
- Repo: [spec/healthcare-ui](../../healthcare-ui/index.md), [docs/patterns/healthcare](../../../docs/patterns/healthcare/index.md)

---

Lily™ and Lily Design System™ are trademarks.
