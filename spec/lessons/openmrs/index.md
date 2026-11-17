# Lessons from OpenMRS (planned work)

## Summary

A review on 2026-11-17 of [OpenMRS](https://openmrs.org/), the open-source medical record system used in more than 70
countries and 8,000 facilities, much of it in low- and middle-income health systems (HIV, TB, maternal and child health,
primary care). Its current interface, OpenMRS 3 ("O3"), is a set of React microfrontends on IBM's Carbon Design System: a
patient chart of a banner, a navigation, a chart review of widgets (allergies, conditions, medications, vitals, results,
immunizations, programs, orders, notes, attachments, a growth chart) and a **workspace**, a side panel where forms open beside
the chart. Its shared styleguide (`esm-styleguide`) has an empty card, an error state, a numeric observation, a patient banner,
toasts, snackbars and a location picker. Reading that source is the useful part, because it shows the defects Lily's healthcare
contracts exist to prevent: **a result with no reference range, or one still loading, is treated as "normal"**, an abnormal value
is marked by colour and an empty element with a `title`, every empty widget says "There are no {items} to display" whatever the
reason, and a failed load shows "Error 404: Not Found" with no retry and no announcement. The proposals are a test that Lily
never defaults to normal, guide rules for load failures, the session location and the active visit, a non-modal workspace panel
pattern, a "saved on this device" state for offline work, and patient flags in the banner. Nothing here is built yet; tasks are
in [tasks.md](../../../tasks.md#phase-33--lessons-from-openmrs-2026-11-17).

## Scope

### In scope

- The O3 patient chart's layout and its styleguide components, against Lily's healthcare components and guide.
- The O3 workflows that shape every screen: the session location, the active visit, offline work, service queues.

### Explicitly out of scope

- The form engine (JSON form schemas rendered to forms) and the concept dictionary: a form generator and clinical content, as in
  [openehr](../openehr/index.md).
- Billing, stock, dispensing, reporting and label printing: application features.
- An OpenMRS theme. Lily already ships an IBM Carbon theme, and an OpenMRS brand theme would carry its identity
  ([visual-identity](../../visual-identity/index.md)).

## Principles and rules

- **Unknown is not normal.** When the reference range is missing, still loading or unreadable, the result has no interpretation
  and says so; it never falls back to "normal". O3's `calculateInterpretation` returns `'normal'` in each of those cases, and its
  component defaults to `'normal'` too, so a critical potassium shown before its range loads reads as normal.
- **A flag is visible text.** O3 marks an abnormal value with a class and an empty `<span title="Abnormal value">`, so the meaning
  is colour plus a tooltip (WCAG 1.4.1, 1.3.1). Lily's `observation-view` requires `flagLabels` for every abnormal code.
- **An empty section says why.** O3's `EmptyCard` writes "There are no {displayText} to display" for every empty widget, so "no
  known allergies", "never asked" and "the service did not answer" read the same, and the sentence is built around a translated
  noun, which breaks grammatical gender and case in many languages. Lily's record lists take a required status and whole
  sentences from the consumer.
- **A failed load is a state in words, with a way out.** O3's `ErrorState` shows the HTTP status and status text to a clinician,
  with no retry and no live region. A section that cannot load is `unavailable`, in the consumer's words, with a retry action.
- **Context that changes what a click does is always visible.** O3 attributes records to the logged-in session location and
  requires an active visit before most forms open. Both belong in the page header and the banner, not only in a menu.

## Findings, by area

From the [O3 styleguide source](https://github.com/openmrs/openmrs-esm-core/tree/main/packages/framework/esm-styleguide/src),
the [patient chart repository](https://github.com/openmrs/openmrs-esm-patient-chart), the
[designer onboarding](https://openmrs.atlassian.net/wiki/spaces/docs/pages/26938255) and the
[workspace](https://openmrs.atlassian.net/wiki/spaces/docs/pages/150962924/Launching+Workspaces) and
[order sets](https://openmrs.atlassian.net/wiki/spaces/projects/pages/962756610/Order+Sets+in+OpenMRS+O3) pages:

| O3                            | What it does                                                                                                                                                                                                                                                                                                                                                     | Lily today                                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Numeric observation           | Value, unit and label in a card or a table cell; interpretation `normal`, `low`, `high`, `critically_low`, `critically_high`, `off_scale_low`, `off_scale_high`, computed from the concept's range or given; **`normal` when there is no range, while it loads, or when the value does not parse**; abnormal shown by class and an empty `<span>` with a `title` | `observation-view`: the consumer's interpretation code, `flagLabels` required, no default              |
| Empty card                    | "There are no {displayText} to display", and "Record {displayText}" when a form can be launched                                                                                                                                                                                                                                                                  | `record-list` statuses `known`, `none-known`, `not-recorded`, `unavailable`, `omitted`, with sentences |
| Error state                   | `Error {status}: {statusText}` and a translated paragraph; no `role="alert"`, no retry                                                                                                                                                                                                                                                                           | `unavailable` status; `error-message`, `error-summary`                                                 |
| Patient banner                | Name, age, birthdate, gender and the preferred identifier, always at the top, with more demographics and contacts behind a toggle; an actions menu; patient flags in their own module                                                                                                                                                                            | the patient banner composition and its rules (P27-T8)                                                  |
| Workspace                     | Forms, the order basket and notes open in a panel on the right of the chart, which stays readable; workspaces can be minimised; launching one first asks to start a visit when the patient has none                                                                                                                                                              | `drawer`, `sheet` (modal); `grail-layout` right aside                                                  |
| Order basket                  | A side panel holding pending drug and lab orders, with empty entry points ("Order set", "Drug orders", "Lab orders", each with an add link) before anything is ordered                                                                                                                                                                                           | `record-list`, `medication-record-list`                                                                |
| Session location              | The facility or ward chosen at login, which records are attributed to; a location picker in the header                                                                                                                                                                                                                                                           | none                                                                                                   |
| Visits                        | An active visit (type, start time) frames most recording; start and end are explicit                                                                                                                                                                                                                                                                             | none                                                                                                   |
| Offline                       | Forms can be filled offline and synchronised later                                                                                                                                                                                                                                                                                                               | none                                                                                                   |
| Service queues, ward, beds    | Queues of patients by service with priority, status and waiting time; a ward view of beds                                                                                                                                                                                                                                                                        | `/ward-board`, the planned `/flow-board` (P30-T3)                                                      |
| Growth chart, vitals, results | Growth charts, vitals and biometrics with BMI, results with trends                                                                                                                                                                                                                                                                                               | `line-chart`; the growth chart pattern (P30-T7); `sparkline` (P31-T7)                                  |
| Diagnosis tags                | Primary and secondary diagnoses as Carbon tags                                                                                                                                                                                                                                                                                                                   | `tag`, `problem-record-list-item`                                                                      |
| Tablet                        | Larger buttons when `isTablet` (a layout breakpoint)                                                                                                                                                                                                                                                                                                             | the themes' `(pointer: coarse)` targets                                                                |

## Proposals and decisions

| Item                                       | Lily today                      | Decision                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Never default to normal                 | no default, but no test says so | **Adopt as a test and a rule.** In all nine catalogs, `observation-view` without `interpretation` renders no `data-interpretation` and no flag, and the docs say it never infers one. The guide adds: a result whose range is missing or loading has no interpretation, and is never shown as normal.                                                                                                      |
| 2. Off-scale results                       | comparators                     | **Adopt a guide mapping**: an off-scale result is the instrument's limit with a comparator ("> 33.3 mmol/L", `formatQuantity` with `">"`), plus the consumer's critical flag, never a bare number.                                                                                                                                                                                                         |
| 3. Load failures                           | `unavailable` status            | **Adopt a guide rule and an example**: a section that cannot load renders `unavailable` with the consumer's sentence and a retry button; the technical detail, if shown at all, sits behind a disclosure; a failure the user caused by an action is announced, a failure on page load is not. `/patient-summary` gains one section in this state.                                                          |
| 4. Workspace panel                         | modal `drawer` and `sheet`      | **Adopt as a pattern**: a non-modal `<aside aria-labelledby>` beside the chart for entering a form, with a heading, a close button that returns focus to the opener, a minimise button that keeps the form's state, and an `alert-dialog` before closing with unsaved changes. Built into the `/patient-dashboard` page (P30-T5). Not a new component: `grail-layout`'s right aside and `dialog` cover it. |
| 5. Session location and active visit       | none                            | **Adopt guide rules**: the location records will be attributed to is visible text in the page header, and changing it is an explicit action; the active visit (its type and start, or "No active visit") is in the patient banner; a form that needs a visit says so and offers to start one, rather than failing on save.                                                                                 |
| 6. Saved on this device                    | none                            | **Fold into openEHR item 10 (P29-T9)**: the provenance view's states include "saved on this device, not yet sent" (`data-sync="pending"`) and "could not be sent" (`"failed"`), each in consumer words, so offline work is never mistaken for the shared record.                                                                                                                                           |
| 7. Patient flags in the banner             | banner rules                    | **Adopt a banner rule**: flags ("Needs an interpreter", "Infection risk") are a labelled `tag-group` of words in the banner, never icons or colour alone, and their count stays visible when the banner wraps.                                                                                                                                                                                             |
| 8. Service queues                          | `/flow-board` planned           | **Fold into P30-T3**: the flow board's rows carry a priority in words as well as `data-priority`, and the queue's sort order is said in a coverage line (P31-T2).                                                                                                                                                                                                                                          |
| 9. Device detection for tablets            | `(pointer: coarse)`             | **Decline.** O3 sizes buttons by an `isTablet` breakpoint; Lily keeps its rule that touch is a pointer query, never a width ([responsive](../../responsive/index.md)).                                                                                                                                                                                                                                     |
| The form engine and concept dictionary     | —                               | **Decline.** A form generator and clinical content.                                                                                                                                                                                                                                                                                                                                                        |
| An OpenMRS theme                           | the IBM Carbon theme            | **Decline.** Carbon is covered; an OpenMRS brand theme would carry its identity.                                                                                                                                                                                                                                                                                                                           |
| Label printing, billing, stock, dispensing | —                               | **Decline.** Application features.                                                                                                                                                                                                                                                                                                                                                                         |

## Advice

OpenMRS is the most widely deployed system in this series, in the settings Lily's worldwide rule is written for, and its
interface is the most instructive by its defects. Do **1 (never default to normal)** first: Lily already behaves correctly, but
nothing tests it, and a regression would be silent and dangerous. Then **3 (load failures)** and **5 (location and visit)**, which
are guide rules every EHR screen needs. **4 (workspace panel)** belongs with the dashboard page, and **6** and **8** fold into
tasks already planned. Lily's contracts compare well here; the gap is that the reasons behind them are not yet tested or written
down where an adopter building an OpenMRS-like chart would read them.

## Acceptance criteria

- [ ] A test in all nine catalogs that `observation-view` without `interpretation` renders no interpretation or flag, and a sentence in its docs (item 1).
- [ ] The guide has the off-scale mapping, the load-failure rule, the session location and active visit rules, and the banner flags rule (items 2, 3, 5, 7).
- [ ] `/patient-summary` shows one section as `unavailable` with a retry button (item 3).
- [ ] The workspace panel is part of `/patient-dashboard` (item 4, with P30-T5).
- [ ] P29-T9 and P30-T3 carry items 6 and 8.

## Related topics

- [healthcare-ui](../../healthcare-ui/index.md) — the components and banner rules these items extend.
- [openehr](../openehr/index.md), [openemr](../openemr/index.md), [zoblocks](../zoblocks/index.md) — the same series.
- [responsive](../../responsive/index.md) — touch as a pointer query.
- [internationalization](../../internationalization/index.md) — whole sentences from the consumer, never a noun dropped into one.

## Sources

- [OpenMRS](https://openmrs.org/) and its [demo](https://o3.openmrs.org/)
- [O3 styleguide source](https://github.com/openmrs/openmrs-esm-core/tree/main/packages/framework/esm-styleguide/src): [numeric observation](https://github.com/openmrs/openmrs-esm-core/tree/main/packages/framework/esm-styleguide/src/numeric-observation), [empty card](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/empty-card/empty-card.component.tsx), [error state](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/error-state/error-state.component.tsx)
- [OpenMRS patient chart](https://github.com/openmrs/openmrs-esm-patient-chart)
- [Designer onboarding to OpenMRS 3](https://openmrs.atlassian.net/wiki/spaces/docs/pages/26938255)
- [Launching workspaces](https://openmrs.atlassian.net/wiki/spaces/docs/pages/150962924/Launching+Workspaces), [Order sets in O3](https://openmrs.atlassian.net/wiki/spaces/projects/pages/962756610/Order+Sets+in+OpenMRS+O3)

---

Lily™ and Lily Design System™ are trademarks.
