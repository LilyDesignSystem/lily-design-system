# Screen-reader session script — Lily Design System™

A script for filling the [screen-reader matrix](screen-reader-matrix.md) (P16-T9). The expected column says what each component's contract
intends. **It is not a result.** Nobody has observed these announcements, and a cell is filled only by what a person hears.

Allow about ten minutes a row. Two combinations are enough to finish the task: VoiceOver with Safari on macOS, then VoiceOver on iOS.

## Before you start

1. Run an example app, such as `npx http-server pages -p 8080` in `lily-design-system-html-css-js-examples`.
2. Note the screen reader, browser and OS versions for the matrix's Recorded sessions table.
3. Open one issue or PR for the session: every filled cell needs a reference.
4. Mark each row `pass`, `minor` or `fail` as the matrix defines them. If unsure between two, choose the lower one and write down what you heard.

## The rows

| #   | Component                          | Do this                                                          | Expected, from the contract                                                                       |
| --- | ---------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1   | theme-picker                       | Tab to it, press Down, arrow through, press Enter                | Button named by its label, collapsed then expanded; a listbox; each option and whether selected   |
| 2   | locale-picker                      | The same; choose a right-to-left language                        | As row 1; reading direction changes with no loss of position                                      |
| 3   | date-time-picker                   | Type a date; open the dialog; arrow by day; Page Down; Escape    | Field name and value; a dialog; each day's full date; focus returns to the trigger                |
| 4   | share-picker                       | Open; Tab through; Escape                                        | Collapsed then expanded; real links; copy outcome announced once; focus returns                   |
| 5   | `dialog`                           | Open; Tab past the last control; Escape                          | Dialog role and name; focus stays inside; page behind is inert; focus returns                     |
| 6   | `alert-dialog`                     | Open; choose an action                                           | Alert dialog role, name and message read on open                                                  |
| 7   | `tab-bar`                          | Arrow between tabs; Tab into the panel                           | Tab, position ("1 of 3") and selected state; panel name                                           |
| 8   | `accordion-nav`                    | Toggle two sections                                              | Expanded state of each; content follows in reading order                                          |
| 9   | `menu`                             | Open; arrow; Escape                                              | Menu role, item count, item names; focus returns                                                  |
| 10  | `tree-nav`                         | Arrow, Right to expand, Left to collapse                         | Tree item, level, expanded state, position in set                                                 |
| 11  | `form` + `field` + `error-summary` | Submit empty; follow an error link; **note how often it speaks** | Summary announced **once**, not twice; link moves to the field; field reads invalid and its error |
| 12  | `text-input`                       | Tab in; type                                                     | Name, role, value; required and invalid states when set                                           |
| 13  | `select`                           | Open; change value                                               | Name, value, position in list                                                                     |
| 14  | `checkbox-input` / `radio-input`   | Toggle; arrow within the radio group                             | Name, state, and for radios the group name and position                                           |
| 15  | `date-input`                       | Set a date with the native control                               | Name and the value in full                                                                        |
| 16  | `data-table`                       | Move by cell; find the sort control; sort                        | Row and column headers read with each cell; sort state after sorting                              |
| 17  | `pagination-nav`                   | Move through links                                               | A named navigation landmark; current page identified                                              |
| 18  | `breadcrumb-nav`                   | Move through links                                               | A named navigation landmark; current page identified                                              |
| 19  | `skip-link` + landmarks            | Tab once from the top; activate; list landmarks                  | Skip link first and it moves focus to main; banner, navigation, main and footer listed            |
| 20  | `net-promoter-score-picker`        | Move through values; choose one                                  | Group name, each value, the chosen state                                                          |

Row 11 also decides [P23-T9](../tasks.md): Lily uses both `role="alert"` and moved focus on `error-summary`, and Aksel says to use only focus.
A double announcement in any combination is the evidence for removing `role="alert"`.

## After the session

Fill the cells in [the matrix](screen-reader-matrix.md), add a row to Recorded sessions, then run `bin/generate-core`.

---

Lily™ and Lily Design System™ are trademarks.
