# Lessons from ZoBlocks (planned work)

## Summary

A review on 2026-11-16 of [ZoBlocks](https://zoblocks.design/), a healthcare UI component library from Zowork, a healthcare
engineering firm: 30 MIT-licensed React components typed to FHIR R4, installed as source through a CLI and a registry, as
shadcn/ui is, with a stylesheet per component and Tailwind class merging. It targets WCAG 2.2 AA and says plainly that it is
neither a compliance boundary nor a medical device. Its catalog overlaps Lily's healthcare work almost item for item (a result
value, an allergy chip, a signature, a patient header, a timeline, a data grid), so it is the closest peer Lily has, and the
two agree on the main rule: a missing value is a reason in words, never a dash. What ZoBlocks has that Lily lacks is a
**coverage statement** (what a list or timeline is a view of, and what it leaves out), **provenance as an affix** beside a
value, **a corrected result that keeps the superseded value visible**, **signature outcomes other than "signed"**, a menu that
**names its subject first**, and **focus that follows the row, not its position, when a grid is sorted**. The last is a defect
in Lily's data grid today. ZoBlocks also does a few things Lily should not copy: a tri-state switch with `aria-checked="mixed"`,
which ARIA does not support, sentences built in English inside components, and decorative heartbeat loaders. Nothing here is
built yet; tasks are in [tasks.md](../../../tasks.md#phase-31--lessons-from-zoblocks-2026-11-16).

## Scope

### In scope

- ZoBlocks' 30 components and 11 composed screens, against Lily's catalog, helpers and healthcare guide.
- The safety rules its components encode, as contracts or guide rules for Lily.

### Explicitly out of scope

- Copying ZoBlocks' markup, styles or names. It is a styled React library; Lily is headless across nine catalogs.
- Its clinical content: the Stanley-Brown safety plan (a published instrument with its own terms), validated measures and their
  scoring bands, FHIR adapters (`fromObservation()`), the copilot.
- Its premium packs and registry.

## Principles and rules

- **A list says what it is a view of.** "6 of 312 clients, PHQ-9 of 10 or more"; "18 of 43 events, newest first, from 1 July";
  "the source did not say how many match". A list that shows nothing must say whether nothing exists, nothing matched, or a
  source did not answer, and "no records" from an unavailable source is not proof that none exist.
- **Withheld is present.** A restricted record is shown as existing and withheld ("Restricted"), not silently removed, and an
  entry in error is struck through and kept, never filtered out.
- **The host supplies "now".** A component never computes "3 days ago" from the browser's clock; the consumer passes the time.
  Lily's `age-view` and `ageParts()` already take `at`.
- **Focus follows the record, not the row number.** After a sort, a filter or new data, the focused row is still the same
  patient.
- **Name the subject before the action.** A menu of actions on a record says whose record it is before it offers anything.

## Findings, by component

From the [catalogue](https://zoblocks.design/components), the [showcase](https://zoblocks.design/showcase) and the component
pages cited:

| ZoBlocks                                                                    | What it does                                                                                                                                                                                                                                          | Lily today                                                                                       |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [Result Value](https://zoblocks.design/components/result-value)             | 18 states; seven absence reasons in words; a corrected result shows the superseded value struck through with when it changed; no delta across different assays; units spoken in full; one composed accessible name with the parts `aria-hidden`       | `observation-view`: value, unit, range, flag, nine statuses with consumer words                  |
| [Provenance Chip](https://zoblocks.design/components/provenance-chip)       | An affix beside a value: source class (clinic, device, AI-extracted, external, amended, patient-reported) as a glyph and a word; "unreviewed" for AI-extracted values; observed-at kept apart from recorded-at; staleness only with a consumer policy | none (openEHR item 10, `record-provenance-view`, proposed)                                       |
| [Trend Indicator](https://zoblocks.design/components/trend-indicator)       | A sparkline that draws no line below three points and says why, splits the line where the consumer marks a comparability break, shows a change below the consumer's noise threshold as flat, and says direction and valence in words                  | `sparkline`, `line-chart` (graphic plus data table)                                              |
| [Data Grid](https://zoblocks.design/components/data-grid)                   | A coverage line above the rows; absences in words that sort last; restricted rows shown as present; `aria-rowcount="-1"` when the total is unknown; focus follows the row's key, so sorting never moves it to another patient                         | the `data-grid` helper: focus is kept by **row index**, so a sort moves it to another row        |
| [Care Timeline](https://zoblocks.design/components/care-timeline)           | Required `coverage` (window, order, counts, which sources answered); declared gaps drawn as gaps; withheld entries show the date and the fact of a record; entered-in-error kept and struck through; a "new since last reviewed" divider              | `timeline-list` and its items: order only                                                        |
| [Signature](https://zoblocks.design/components/signature)                   | Attestation text above the pad; a document hash; outcomes signed, declined, unable, verbal, on paper, pending and revoked (unable and verbal need a witness); a typed alternative, since drawing alone fails WCAG 2.1.1                               | `signature-pad`: drawing, with `role="application"`; its docs only advise a keyboard alternative |
| [Chart Context Menu](https://zoblocks.design/components/chart-context-menu) | A subject header that names the record and is the menu's accessible name; four tiers: routine, documented (says what it writes), clinical (a second step whose button is the verb, never "OK"), disclosive (a reason first)                           | `context-menu`, `dropdown-menu`; `decision-support-card` has override reasons                    |
| [Switch](https://zoblocks.design/components/switch)                         | On, off and "unknown" as `role="switch"` with `aria-checked="mixed"`; optimistic writes with rollback announced with the value the record now holds                                                                                                   | `switch-button`; the tri-state answers pattern (OpenEMR item 5)                                  |
| Allergy Chip                                                                | Past reaction severity and future risk shown separately                                                                                                                                                                                               | `allergy-record-list-item` severity and criticality (P28-T2)                                     |
| Recent Patient Stack, Chart Header                                          | A multi-patient workspace that makes the active patient clear; a header that collapses to a safety bar                                                                                                                                                | the several-patients rule (OpenEMR item 3), the patient banner composition                       |
| Clinical Note                                                               | Each passage marked typed, dictated, template, copied forward or AI-drafted; signing blocked until the note has been read                                                                                                                             | `markdown-editor`, `mark`                                                                        |
| Clinical Status, density modes                                              | Status on nine scales with colour, shape and text; patient-facing, standard and clinical-dense density                                                                                                                                                | `status-light`, the RAG parts, the patient and practitioner themes                               |
| Loaders (Pulse, Rhythm, Breath, Helix, Infusion)                            | Themed waiting animations with reduced motion and an announced wait                                                                                                                                                                                   | `loading`, `progress-spinner`, `progress`                                                        |
| Dashboard tiles (showcase)                                                  | Each metric tile shows its denominator and opens the list behind it                                                                                                                                                                                   | `statistic`                                                                                      |

## Proposals and decisions

| Item                                          | Lily today                                | Decision                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Data grid focus follows the row            | focus kept by row index                   | **Adopt, as a fix.** In the `data-grid` helper in all eight catalogs, the focused cell is keyed by `rowId` and column id, so a sort, a filter or new rows keep focus on the same record (or on the nearest row, with an announcement, when it is filtered out). `aria-rowcount="-1"` when the consumer says the total is unknown.                                           |
| 2. Coverage statements                        | none                                      | **Adopt.** A `coverageLabel` (consumer words) on the `data-grid` helper above the rows, and a `-coverage` part on `timeline-list` and `record-list`: what the view shows, its order and window, what is hidden and why, which sources did not answer. A source that did not answer is said in words beside an empty list.                                                   |
| 3. Corrected results keep the old value       | `amended` and `corrected` show words only | **Adopt** `previousValue` and `previousLabel` on `observation-view`: the superseded value in a `<del>` with the consumer's words for when it changed, so a reader who saw the old value knows it changed.                                                                                                                                                                   |
| 4. Withheld and in-error entries              | `masked` on `observation-view`            | **Adopt** `withheld` and `entered-in-error` states on `timeline-list-item` and `record-list-item` (`data-entry-state`): a withheld entry keeps its date and consumer words and drops its content; an entry in error is kept, its content in a `<del>`, with the consumer's note.                                                                                            |
| 5. Provenance                                 | openEHR item 10, a maintainer decision    | **Fold into openEHR item 10 (P29-T9)**, which the maintainer has approved: the provenance view also has a compact affix form for beside a value, observed-at apart from recorded-at, a source kind as `data-source` with consumer words, and "unreviewed" for machine-extracted values.                                                                                     |
| 6. Signature outcomes and a typed alternative | drawing only                              | **Adopt** on `signature-pad`: required attestation text (consumer words, as its accessible description), an `outcome` of signed, declined, unable, verbal, on paper, pending or revoked with consumer words (a non-signed outcome is a notice, never an empty line), and a typed-name method beside drawing. Drop `role="application"`. No hashing: that is the consumer's. |
| 7. Name the subject first                     | menus have no header                      | **Adopt** a `subjectLabel` on `context-menu` and `dropdown-menu`: a non-interactive first part that names the menu (`aria-labelledby`). And a guide pattern for consequence tiers: routine runs; documented says what it writes; clinical confirms with the verb, never "OK"; disclosive asks for a reason first.                                                           |
| 8. Trends that refuse                         | `sparkline` draws what it is given        | **Adopt as a pattern and two props**: `breaks` (indexes the consumer marks as not comparable) splits the line, and `minimumPoints` with consumer words draws no line below it. Direction, noise and valence are the consumer's words, since deciding them is clinical judgement.                                                                                            |
| 9. Clinical notes: passage sources            | none                                      | **Adopt as a guide pattern**: each passage carries `data-source` (typed, dictated, template, copied forward, generated) and visible words, so copied-forward and generated text is never mistaken for today's examination. Gating a signature on reading is the consumer's logic.                                                                                           |
| 10. Denominators                              | `statistic` shows a value                 | **Adopt a guide rule** for dashboards: a count or rate shows its denominator ("12 of 68"), and links to the list behind it.                                                                                                                                                                                                                                                 |
| A tri-state switch (`aria-checked="mixed"`)   | —                                         | **Decline.** ARIA 1.2 does not support `mixed` on `switch` (it is read as false), and "unknown" is not a switch position. Use the tri-state answers pattern (OpenEMR item 5): three radios.                                                                                                                                                                                 |
| A composed English accessible name            | —                                         | **Decline** for the components; a sentence built from parts is English (`bin/check-built-english`). The consumer may pass a `label` built in its own language.                                                                                                                                                                                                              |
| Themed loaders                                | —                                         | **Decline.** Decoration, and an animation the headless layer does not ship.                                                                                                                                                                                                                                                                                                 |
| Optimistic writes with rollback               | —                                         | **Decline as a component feature**; network state is the consumer's. The pending-button contract (chanhdai lessons) covers the markup, and the guide can say that a failed write announces the value the record now holds.                                                                                                                                                  |
| Safety plan, measures, copilot                | —                                         | **Decline.** Clinical content and AI features.                                                                                                                                                                                                                                                                                                                              |

## Advice

**Item 1 first, and soon:** it is a real defect in a published Lily helper, and in a clinical worklist it puts the next action on
the wrong patient. Then **2 (coverage)** and **4 (withheld and in error)**, which carry Lily's never-blank rule from one value to a
whole list. **6 (signature)** fixes a WCAG 2.1.1 gap Lily's own docs admit. **3** and **7** are small. Fold **5** into the
openEHR provenance work rather than starting another component. ZoBlocks is worth watching: it is the only other healthcare
component library that writes its safety rules down, and where the two disagree (the switch, built names) the reason should be
recorded, as here.

## Acceptance criteria

- [ ] The data grid keeps focus on the same `rowId` through a sort and a filter in all eight catalogs, with a test that fails on index-based focus (item 1).
- [x] `coverageLabel` and `-coverage` parts exist, with tests (item 2).
- [ ] `observation-view` shows a superseded value in `<del>` (item 3).
- [ ] Withheld and in-error entries render in timeline and record items (item 4).
- [ ] `signature-pad` has outcomes, attestation text and a typed method, and a test signs by keyboard alone (item 6).
- [ ] Menus take `subjectLabel` (item 7); `sparkline` takes `breaks` and `minimumPoints` (item 8).
- [ ] The guide has the consequence-tier, passage-source and denominator rules (items 7, 9, 10).

## Related topics

- [healthcare-ui](../../healthcare-ui/index.md) — the components these items extend.
- [openehr](../openehr/index.md) — the provenance view this folds into.
- [openemr](../openemr/index.md) — the tri-state answers pattern and the several-patients rule.
- [helpers](../../helpers/index.md) — the `data-grid` helper.

## Sources

- [ZoBlocks](https://zoblocks.design/), [catalogue](https://zoblocks.design/components), [showcase](https://zoblocks.design/showcase)
- [Result Value](https://zoblocks.design/components/result-value), [Provenance Chip](https://zoblocks.design/components/provenance-chip),
  [Trend Indicator](https://zoblocks.design/components/trend-indicator), [Data Grid](https://zoblocks.design/components/data-grid),
  [Care Timeline](https://zoblocks.design/components/care-timeline), [Signature](https://zoblocks.design/components/signature),
  [Chart Context Menu](https://zoblocks.design/components/chart-context-menu), [Switch](https://zoblocks.design/components/switch)
- [ZoBlocks on GitHub](https://github.com/zoworkhq/zoblocks)
- [WAI-ARIA 1.2, switch role](https://www.w3.org/TR/wai-aria-1.2/#switch)

---

Lily™ and Lily Design System™ are trademarks.
