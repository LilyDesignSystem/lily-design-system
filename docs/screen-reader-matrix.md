# Screen-reader testing matrix — Lily Design System™

_Structure prepared 2026-08-28 (plan P4-T4). **Every result row below is
empty until a human session fills it** — this project does not record
screen-reader results it has not observed. See
[docs/accessibility-statement.md](accessibility-statement.md) for why
this matrix exists: the automated suites assert ARIA attributes, not
what assistive technology announces._

## How to contribute a row

Run one component's demo page with one screen reader and record what
you observed — that's a complete contribution. Use the
[screen-reader report issue form](https://github.com/LilyDesignSystem/lily-design-system/issues/new?template=screen-reader-report.yml)
or a PR editing this file. You do not need to be an expert.

**Result vocabulary** (one per cell, with the issue/PR reference):

| Mark | Meaning |
| --- | --- |
| `pass (#N)` | Announced role, name, state, and value as the component's AGENTS.md contract intends |
| `minor (#N)` | Usable, but announcement is awkward, duplicated, or over-verbose |
| `fail (#N)` | Wrong/missing role, name, or state; unreachable; or a trap |
| *(empty)* | Not yet tested — the honest default |

**Environment note format:** screen reader + version, browser +
version, OS + version (e.g. `VoiceOver / Safari 19 / macOS 15.6`).
Results are per *combination*; a second combination gets a second
entry in the same cell.

## The representative twenty

Chosen to match [audit-readiness tier 1](audit-readiness.md): the
hand-rolled interaction patterns first, then the form family, then
structural landmarks.

| # | Component / package | Demo | VoiceOver | NVDA | JAWS |
| --- | --- | --- | --- | --- | --- |
| 1 | theme-picker (helper) | any example app header | | | |
| 2 | locale-picker (helper) | any example app header | | | |
| 3 | date-time-picker (helper) | helper docs/examples | | | |
| 4 | share-picker (helper) | helper docs/examples | | | |
| 5 | `dialog` | `/components/dialog` | | | |
| 6 | `alert-dialog` | `/components/alert-dialog` | | | |
| 7 | `tab-bar` | `/components/tab-bar` | | | |
| 8 | `accordion-nav` | `/components/accordion-nav` | | | |
| 9 | `menu` | `/components/menu` | | | |
| 10 | `tree-nav` | `/components/tree-nav` | | | |
| 11 | `form` + `field` + `error-summary` | `/contact-form` composed flow | | | |
| 12 | `text-input` | `/components/text-input` | | | |
| 13 | `select` | `/components/select` | | | |
| 14 | `checkbox-input` / `radio-input` | `/components/checkbox-input` | | | |
| 15 | `date-input` | `/components/date-input` | | | |
| 16 | `data-table` (sortable) | `/components/data-table` | | | |
| 17 | `pagination-nav` | `/components/pagination-nav` | | | |
| 18 | `breadcrumb-nav` | `/components/breadcrumb-nav` | | | |
| 19 | `skip-link` + landmarks | any example app page | | | |
| 20 | `net-promoter-score-picker` | `/components/net-promoter-score-picker` | | | |

## Recorded sessions

None yet. Each filled cell above must be traceable to an entry here:

| Date | Tester | Environment | Rows touched | Reference |
| --- | --- | --- | --- | --- |

---

Lily™ and Lily Design System™ are trademarks.
