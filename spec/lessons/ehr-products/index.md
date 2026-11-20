# Lessons from commercial health record products

## Summary

Planned work from a review (2026-11-20) of 24 screenshots of six products: five US electronic health record systems (Epic,
athenaOne, eClinicalWorks, AdvancedMD and McKesson Practice Choice) and one consumer wellness app (Welltory). Most of what they
show Lily already has or has planned in [healthcare-ui](../../healthcare-ui/index.md), [openEMR](../openemr/index.md) and
[OpenMRS](../openmrs/index.md). The new work is small: a change and an "as of" time on `statistic`, a native `<meter>` for a
result's place in its range, a range formatter that cannot print a range backwards, option groups in `listbox`, the name a
patient wants used and their pronouns in the banner, and guide rules for icon-only columns, data freshness and derived scores.
The products also show what to avoid: colour-only flags, icon columns with truncated headers, details shown only on hover, and
scores that are never explained.

## Scope

### In scope

- What each screen does that Lily's components, compositions or guide should support, and what it does that Lily should advise
  against.
- Proposals mapped onto existing components first; a new component only where none fits.

### Explicitly out of scope

- Clinical logic: risk adjustment (HCC categories, RAF weights), diagnosis inference, early warning or wellness scoring.
- Billing, claims, eligibility, e-prescribing and practice management.
- Voice assistants, telehealth video and maps.
- Any product's look. Lily ships no Epic, athenaOne or other product theme; [visual-identity](../../visual-identity/index.md)
  forbids carrying another body's identity.
- Code-set data (ICD-10, CPT); the consumer supplies results, as for every Lily search.

## Principles and rules

- Every state a screen shows by colour or icon is also in words: a flag letter, a status label, a legend.
- A number that changes says what it changed against and when it was measured.
- A range is always written low to high, with its unit.
- A derived score (risk, wellness, early warning) says what it is based on, by keyboard and screen reader as well as by sight.
- Lily renders what the consumer computes; it infers no diagnosis, interpretation or trend.

## Findings, by product

### Epic (Hyperspace, inpatient)

- **Patient summary** as a page of cards: orders awaiting collection, unresulted labs, current infusions, sticky notes with
  "last edited by" and a time, the care team, a vital-signs chart, care-plan goals, and timed work-list tasks with a priority.
- **Persistent side banner**: precautions ("Fall precautions"), attending clinician with a photo, allergies, and "Pharmacy: Yes -
  Hover for Details", a detail reachable only by hovering.
- **Two rows of tabs** (activity, then section) and an **index page** of grouped links to every view.
- **Patient list (census)**: dozens of narrow columns whose headers are cut off ("Cod Statu", "Une Orde"), states shown only as
  coloured icons (a red "!!", a green tick, an amber triangle), "Refreshed 3 minutes ago" and a refresh button.

### athenaOne

- **Day schedule** with a column per clinician and office, appointment blocks coloured by type with no legend, two mini month
  calendars, a saved view, filter chips and "2 Filters | Clear".
- **Metrics page**: an index value with changes ("0.5 ↑ vs Oct 2024", "0.7 ↑ vs Nov 2023"), a month-on-month / year-on-year
  toggle, "Data current as of 12/01/2024", a line chart whose series differ by dash and colour, and an export link.
- **Patient banner** with initials, name, age, sex, date of birth and record number; an encounter step trail (Review, HPI, ROS,
  PE, A/P, Sign-off); a left rail of icons with labels.
- **Problem list** grouped as chronic, acute and not categorised, with codes; "Potential" diagnoses (from claims) and
  "Suspected" ones (inferred from results) kept apart from confirmed ones, each with its source and date.
- **Mobile**: appointment cards with a status chip ("Ready for provider"), filter chips with a count, a voice button, bills
  marked "Due Now", lab cards marked "Abnormal" with "2 Historical", vitals tiles with sparklines, and a banner with pronouns
  ("he/him") and "2 Allergies".

### eClinicalWorks

- A **voice assistant** that, once a patient is named, lists "What would you like to do?" actions: in effect a command palette
  with a patient context.
- A **provider directory**: a filtered table beside result cards showing "Earliest availability", a Distance / First
  availability toggle and a map; a shaded-row legend ("In address book" / "Not in address book").
- **Review-of-systems notes** whose pertinent negatives ("no fever") differ only by colour.
- An iPad **master-detail** list of encounters and an icon launcher with count badges.

### AdvancedMD

- An **appointment confirmation** table with a totals row: booked, confirmed, checked in, checked out, cancelled, no-show.
- A **code picker** with a filter field and grouped favourites ("Common", "Lab", "Well visit").
- A **work dashboard**: ring counters (notes, prescriptions, orders) with badges, and an inbox table with select-all, bulk
  "Priority" and "Hold" actions, and a review state per row ("status: Unreviewed", "reviewed by …").
- A record sidebar of sections with counts and an add button ("Notes 64", "Encounters 224").
- A **checkbox grid** for review of systems with a "No Reported Symptoms" box beside individually ticked symptoms (the two can
  contradict each other) and "Other (specify)".

### McKesson Practice Choice

- An **encounter timeline**: a strip of months with a dot per visit.
- A **vital-signs trend table**: a sparkline and the last, lowest and highest value for each sign.
- **Lab results** on a red-green-red bar with a marker, plus lettered flags ("H", "CL" for critical low).
- **Note templates** with fill-in placeholders («Quality…», «Onset…»).
- Several patients open as tabs, and waiting-list cards marked "Not Arrived".

### Welltory (consumer app)

- A headline score drawn as a ten-segment bar ("46%", "-52% since wake-up"), and a gauge labelled "Low" and "High" in words.
- A personal reference range, "Your norm: 2.12–1.82", printed high to low.
- A Days / Weeks / Months control over a labelled trend line, "Today at 08:05am", and a plain-language explanation of every
  score.
- A "✦" mark on some options that nothing explains.

## Proposals and decisions

| Item                                      | Lily today                                          | Decision                                                                                                                                                                                                                                                                                                                                                                           |
| ----------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. A change and an "as of" on `statistic` | `title`, `value`, prefix and suffix slots           | **Adopt.** Optional `change` (consumer text, "0.5 more than October 2024"), `trend` (`up`, `down`, `flat`, rendered as `data-trend`; any arrow is decorative) and `asOf` (a `<time datetime>` with consumer text). The comparison is always named in words; never an arrow or colour alone.                                                                                        |
| 2. A result's place in its range          | `observation-view` shows the range as text          | **Built (P40-T2).** An optional native `<meter>` part (`meterValue`, `meterMin`, `meterMax`, `meterLow`, `meterHigh`, `meterOptimum`) after the text range. It is `aria-hidden`: the value, range and flag are already words, so an exposed meter would only repeat the value; it is their picture from data, never the only signal. The red-green bar is a theme's drawing of it. |
| 3. `formatRange` in `clinical-format.ts`  | `formatQuantity`                                    | **Adopt.** `formatRange(low, high, unit, locale)` through `Intl.NumberFormat.formatRange`, refusing a low above the high, so a range can never read "2.12–1.82". Tested like `formatQuantity`.                                                                                                                                                                                     |
| 4. Option groups in `listbox`             | flat options                                        | **Adopt.** Groups as `role="group"` with a label (the APG grouped listbox), for favourites such as "Common" and "Lab"; arrows move through the options across groups, and the group's name is read once.                                                                                                                                                                           |
| 5. The name to use and pronouns           | banner rules: two identifiers, allergies, deceased  | **Adopt banner rules.** Optional, consumer-supplied text in the banner: the name the patient wants used (FHIR `HumanName.use` `usual`) and their pronouns, labelled as such; never inferred from sex or gender, and never replacing the legal name used for identification.                                                                                                        |
| 6. Icon-only columns and legends          | hover and focus parity, accessible names            | **Adopt a guide rule.** A column whose cells are icons has a header in full words (a short visible header may use `<abbr>` only if its accessible name is the full text), each cell states its value in text, and the table has a legend. Investigate a `shortLabel` for `data-grid` columns.                                                                                      |
| 7. Data freshness                         | flow board refresh rule (OpenEMR item 1)            | **Adopt a guide rule.** Data that may be stale shows when it was fetched as a `<time>` ("Updated 3 minutes ago") and a Refresh button; refreshing never reorders rows under the user's focus or pointer.                                                                                                                                                                           |
| 8. Derived scores explained               | `early-warning-score-view`, `decision-support-card` | **Adopt a guide rule.** Every derived score names what it is based on and when it was calculated, in text or behind `contextual-help` reachable by keyboard. The score's method is the consumer's.                                                                                                                                                                                 |
| 9. A results inbox page                   | `data-grid` selection, `record-provenance-view`     | **Adopt** `/results-inbox` in the SvelteKit app: a table of results with select-all, bulk actions named for what they do, a review state per row in words ("Not reviewed", "Reviewed by … at …"), and priority as text as well as `data-priority`.                                                                                                                                 |
| 10. A vital-signs trend table             | `data-table`, `sparkline`, `observation-view`       | **Adopt as a pattern**, added to the existing `/patient-dashboard` (OpenEMR item 2): one row per sign with its last, lowest and highest value and a `sparkline` whose text summary gives the same numbers.                                                                                                                                                                         |
| 11. Resource columns in the day calendar  | `calendar-day-table`, the `calendar` helper         | **Investigate**, beyond OpenEMR item 6's audit (which found categories and free slots covered): one column per clinician or room, the column header naming the resource, and an appointment's type as text as well as colour.                                                                                                                                                      |
| 12. A filter summary                      | the `filter` helper                                 | **Investigate**: a summary line ("2 filters") with a "Clear all" button, both in consumer words. Saving a view is the application's; the helper's JSON is what it saves.                                                                                                                                                                                                           |
| 13. Encounter steps                       | `step-list`                                         | **Map**: a step trail is a `step-list` of links with `aria-current="step"`, not tabs.                                                                                                                                                                                                                                                                                              |
| 14. Potential and suspected diagnoses     | `problem-record-list-item` `verificationStatus`     | **Map**: `unconfirmed` or `provisional` with the consumer's words and source; nothing new.                                                                                                                                                                                                                                                                                         |
| 15. Pertinent negatives                   | tri-state answers (OpenEMR item 5)                  | **Map**: "absent" is an answer in words, never a colour.                                                                                                                                                                                                                                                                                                                           |
| 16. Note templates with placeholders      | `markdown-editor`, `error-summary`                  | **Defer.** If built, an editor command to go to the next unfilled field; until then the advice is that unfilled fields are listed in an `error-summary` before signing.                                                                                                                                                                                                            |
| Voice assistant, telehealth, maps         | —                                                   | **Decline.** Application features.                                                                                                                                                                                                                                                                                                                                                 |
| Risk adjustment, HCC and RAF scoring      | —                                                   | **Decline.** Clinical and billing logic, US-specific.                                                                                                                                                                                                                                                                                                                              |
| A product look-alike theme                | —                                                   | **Decline.** Another body's identity.                                                                                                                                                                                                                                                                                                                                              |

## Advice

- **Hover-only detail is a defect.** Epic's "Hover for Details" fails WCAG 1.4.13 and 2.1.1; Lily's hover and focus parity
  rule already covers it, and `contextual-help` or a disclosure is the replacement.
- **Truncated column headers.** A header cut to "Cod Statu" names nothing. Prefer fewer columns, wrapping headers, or a
  short header whose accessible name is the full text.
- **Colour-coded appointment types** need a legend in words and the type in each block's text, as athenaOne's schedule lacks.
- **Count badges** on launchers and rings say what they count in their accessible name ("3 unsigned notes"), not just the
  number.
- **Contradictory answers.** A "No reported symptoms" box beside ticked symptoms can say two things at once; use the tri-state
  pattern, whose "all others absent" sets only the unanswered ones.
- **Unexplained marks** such as Welltory's "✦" need visible text or a legend; an icon is never the only carrier of meaning.

## Acceptance criteria

- [ ] `statistic` takes `change`, `trend` and `asOf` in all nine catalogs, with tests that the comparison is text and the arrow
      is decorative.
- [ ] `observation-view` can render a native `<meter>`, with tests that its `low`, `high` and `optimum` follow the props.
- [ ] `formatRange` is in `shared/clinical-format.ts`, copied by `bin/sync-shared-modules`, with tests for order, locale and
      a refused backwards range.
- [ ] `listbox` supports labelled option groups with the APG keys, in all nine catalogs.
- [ ] The banner rules name the name to use and pronouns.
- [ ] The healthcare guide has the icon-column, freshness and derived-score rules.
- [ ] `/results-inbox` exists in the SvelteKit app with an axe-clean e2e test.

## Related topics

- [healthcare-ui](../../healthcare-ui/index.md): the clinical components and the adopter guide.
- [lessons/openemr](../openemr/index.md): the flow board, patient dashboard and calendar audit this builds on.
- [lessons/openmrs](../openmrs/index.md): load failures, banner flags and the workspace panel.
- [lessons/openehr](../openehr/index.md): named reference ranges and provenance.
- [accessibility](../../accessibility/index.md): hover and focus parity, no colour-only meaning.

## Sources

- Screenshots and product notes collected by the maintainer, from the public product pages at emrfinder.com: Epic
  (<https://www.emrfinder.com/epic-ehr-software/>), athenaOne (<https://www.emrfinder.com/athenahealth-ehr-software>),
  eClinicalWorks (<https://www.emrfinder.com/eclinicalworks-ehr-software/>), AdvancedMD
  (<https://www.emrfinder.com/advancedmd-emr-software/>) and McKesson Practice Choice
  (<https://www.emrfinder.com/mckesson-ehr-software/>); and four screens of the Welltory app.
- WAI-ARIA APG listbox pattern, grouped options: <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>.
- HTML `<meter>`: <https://html.spec.whatwg.org/multipage/form-elements.html#the-meter-element>.
- `Intl.NumberFormat.prototype.formatRange`: ECMA-402.
- FHIR `HumanName.use`: <https://hl7.org/fhir/datatypes.html#HumanName>.

---

Lily™ and Lily Design System™ are trademarks.
