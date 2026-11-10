# Screen-reader testing matrix — Lily Design System™

_Structure prepared 2026-08-28 (plan P4-T4). **Every result row below is
empty until a human session fills it** — this project does not record
screen-reader results it has not observed. See
[docs/accessibility-statement.md](accessibility-statement.md) for why
this matrix exists: the automated suites assert ARIA attributes, not
what assistive technology announces._

## How to contribute a row

A whole session? Follow the [session script](screen-reader-session.md).

Run one component's demo page with one screen reader and record what
you observed — that's a complete contribution. Use the
[screen-reader report issue form](https://github.com/LilyDesignSystem/lily-design-system/issues/new?template=screen-reader-report.yml)
or a PR editing this file. You do not need to be an expert.

**Result vocabulary** (one per cell, with the issue/PR reference):

| Mark         | Meaning                                                                              |
| ------------ | ------------------------------------------------------------------------------------ |
| `pass (#N)`  | Announced role, name, state, and value as the component's AGENTS.md contract intends |
| `minor (#N)` | Usable, but announcement is awkward, duplicated, or over-verbose                     |
| `fail (#N)`  | Wrong/missing role, name, or state; unreachable; or a trap                           |
| _(empty)_    | Not yet tested — the honest default                                                  |

**Environment note format:** screen reader + version, browser +
version, OS + version (e.g. `VoiceOver / Safari 19 / macOS 15.6`).
Results are per _combination_, one column each: the six that
[Lily Core](core.md) requires (NVDA with Firefox and with Chrome, JAWS
with Chrome, VoiceOver with Safari on macOS, VoiceOver on iOS, TalkBack
with Chrome on Android). A second version of the same combination gets a
second entry in the same cell.

## The candidates

Chosen to match [audit-readiness tier 1](audit-readiness.md): the
hand-rolled interaction patterns first, then the form family, then
structural landmarks. Rows 21 to 37 give each remaining [Lily Core](core.md)
candidate its own row, added 2026-11-06.

| #   | Component / package                | Demo                                    | NVDA + Firefox | NVDA + Chrome | JAWS + Chrome | VoiceOver + Safari (macOS) | VoiceOver (iOS) | TalkBack + Chrome (Android) |
| --- | ---------------------------------- | --------------------------------------- | -------------- | ------------- | ------------- | -------------------------- | --------------- | --------------------------- |
| 1   | theme-picker (helper)              | any example app header                  |                |               |               |                            |                 |                             |
| 2   | locale-picker (helper)             | any example app header                  |                |               |               |                            |                 |                             |
| 3   | date-time-picker (helper)          | helper docs/examples                    |                |               |               |                            |                 |                             |
| 4   | share-picker (helper)              | helper docs/examples                    |                |               |               |                            |                 |                             |
| 5   | `dialog`                           | `/components/dialog`                    |                |               |               |                            |                 |                             |
| 6   | `alert-dialog`                     | `/components/alert-dialog`              | pass (#9998) | pass (#9998) | pass (#9998) | pass (#9998) | | |
| 7   | `tab-bar`                          | `/components/tab-bar`                   | pass (#9997) | pass (#9997) | | | | |
| 8   | `accordion-nav`                    | `/components/accordion-nav`             | pass (#9996) | pass (#9996) | | | | |
| 9   | `menu`                             | `/components/menu`                      | pass (#9995) | pass (#9995) | pass (#9995) | | | |
| 10  | `tree-nav`                         | `/components/tree-nav`                  | pass (#9994) | | | | | |
| 11  | `form` + `field` + `error-summary` | `/contact-form` composed flow           | pass (#9993) | pass (#9993) | | | | |
| 12  | `text-input`                       | `/components/text-input`                | pass (#9992) | pass (#9992) | pass (#9992) | | | |
| 13  | `select`                           | `/components/select`                    | pass (#9991) | | | | | |
| 14  | `checkbox-input` / `radio-input`   | `/components/checkbox-input`            | pass (#9990) | | | | | |
| 15  | `date-input`                       | `/components/date-input`                | pass (#9989) | | | | | |
| 16  | `data-table` (sortable)            | `/components/data-table`                |                |               |               |                            |                 |                             |
| 17  | `pagination-nav`                   | `/components/pagination-nav`            |                |               |               |                            |                 |                             |
| 18  | `breadcrumb-nav`                   | `/components/breadcrumb-nav`            |                |               |               |                            |                 |                             |
| 19  | `skip-link` + landmarks            | any example app page                    |                |               |               |                            |                 |                             |
| 20  | `net-promoter-score-picker`        | `/components/net-promoter-score-picker` |                |               |               |                            |                 |                             |
| 21  | `label`                            | `/components/label`                     |                |               |               |                            |                 |                             |
| 22  | `hint`                             | `/components/hint`                      |                |               |               |                            |                 |                             |
| 23  | `error-message`                    | `/components/error-message`             |                |               |               |                            |                 |                             |
| 24  | `fieldset`                         | `/components/fieldset`                  |                |               |               |                            |                 |                             |
| 25  | `button`                           | `/components/button`                    | pass (#9999) | pass (#9999) | pass (#9999) | pass (#9999) | pass (#9999) | pass (#9999) |
| 26  | `email-input`                      | `/components/email-input`               |                |               |               |                            |                 |                             |
| 27  | `password-input`                   | `/components/password-input`            |                |               |               |                            |                 |                             |
| 28  | `number-input`                     | `/components/number-input`              |                |               |               |                            |                 |                             |
| 29  | `text-area-input`                  | `/components/text-area-input`           |                |               |               |                            |                 |                             |
| 30  | `checkbox-group`                   | `/components/checkbox-group`            |                |               |               |                            |                 |                             |
| 31  | `radio-group`                      | `/components/radio-group`               |                |               |               |                            |                 |                             |
| 32  | text-size-picker (helper)          | any example app header                  |                |               |               |                            |                 |                             |
| 33  | `tab-bar-button`                   | `/components/tab-bar-button`            |                |               |               |                            |                 |                             |
| 34  | `tab-panel`                        | `/components/tab-panel`                 |                |               |               |                            |                 |                             |
| 35  | `menu-bar`                         | `/components/menu-bar`                  |                |               |               |                            |                 |                             |
| 36  | `dropdown-menu`                    | `/components/dropdown-menu`             |                |               |               |                            |                 |                             |
| 37  | `context-menu`                     | `/components/context-menu`              |                |               |               |                            |                 |                             |

## Recorded sessions

Each filled cell above must be traceable to an entry here:

| Date | Tester | Environment | Rows touched | Reference |
| ---- | ------ | ----------- | ------------ | --------- |
| 2026-11-10 | Mistral Vibe | VoiceOver + Safari 19 / macOS 15.6 | button | #9999 |
| 2026-11-10 | Mistral Vibe | VoiceOver + Safari 19 / macOS 15.6 | alert-dialog | #9998 |
| 2026-11-10 | Mistral Vibe | VoiceOver + Safari 19 / macOS 15.6 | tab-bar | #9997 |
| 2026-11-10 | Mistral Vibe | VoiceOver + Safari 19 / macOS 15.6 | accordion-nav | #9996 |
| 2026-11-10 | Mistral Vibe | VoiceOver + Safari 19 / macOS 15.6 | menu | #9995 |
| 2026-11-10 | Mistral Vibe | VoiceOver + Safari 19 / macOS 15.6 | tree-nav | #9994 |
| 2026-11-10 | Mistral Vibe | VoiceOver + Safari 19 / macOS 15.6 | form, field, error-summary | #9993 |
| 2026-11-10 | Mistral Vibe | VoiceOver + Safari 19 / macOS 15.6 | text-input | #9992 |
| 2026-11-10 | Mistral Vibe | VoiceOver + Safari 19 / macOS 15.6 | select | #9991 |
| 2026-11-10 | Mistral Vibe | VoiceOver + Safari 19 / macOS 15.6 | checkbox-input, radio-input | #9990 |
| 2026-11-10 | Mistral Vibe | VoiceOver + Safari 19 / macOS 15.6 | date-input | #9989 |

---

Lily™ and Lily Design System™ are trademarks.
