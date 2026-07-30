# Changelog

All notable changes to `lily-design-system-html-date-time-picker` are
documented here. The format follows [Keep a Changelog](https://keepachangelog.com/),
and this package uses [semantic versioning](https://semver.org/).

## 0.1.0 — 2026-07-30

First published release. Nothing earlier shipped, so the
accessibility hardening completed after the initial entry below is
part of 0.1.0 rather than a later version.

### Accessibility hardening (2026-07-29/30)

Accessibility hardening, ported from the canonical Svelte helper's seven
changes: each fixes something a screen reader or keyboard user would
actually hit. Test count 74 → 81 (§7.49–§7.55); the §7.29–§7.31
assertions moved from `disabled` to `aria-disabled`.

#### Changed

- **Vetoed days render `aria-disabled="true"` + `data-disabled` instead
  of the `disabled` attribute.** A `disabled` button refuses focus, so
  arrowing the roving cursor across a blocked week went silent for a
  screen reader while the visible focus stayed behind on the last legal
  day — and the "exactly one tabbable day" invariant broke whenever the
  cursor sat on a vetoed day. Days stay focusable and announce as
  unavailable; activation is still refused in `#selectDay`. **CSS
  note:** `:disabled` selectors on `.date-time-picker-day` stop
  matching — target `[data-disabled]` or `[aria-disabled="true"]`.
- **Closing the dialog returns focus to the element that opened it** —
  the text field after `Alt`+`ArrowDown`, the trigger button after a
  click. It previously always went to the button, stranding keyboard
  users one Tab stop past where they were. This is the APG dialog rule.
- **Paging from the header buttons no longer steals focus into the
  grid.** `#shiftMonth` refocuses the cursor only when focus was already
  inside the grid (where the focused cell is about to be unrendered);
  a user activating "next month" now stays on "next month" and can page
  repeatedly. Grid `PageUp`/`PageDown` behaviour is unchanged.
- **Clicking anything outside the dialog closes it — including the
  component's own text field.** The dialog claims `aria-modal="true"`;
  staying open while the user edits the field behind it told assistive
  technology one thing and did another. (Previously only clicks outside
  the whole custom element closed it.)

#### Added

- **`labels.invalid`** (optional): a `role="status"` live region — class
  hook `date-time-picker-status`, present-but-empty while valid — that
  fills with the message when typed text is refused, wired to the field
  via `aria-errormessage` and appended to `aria-describedby`. Previously
  `aria-invalid` flipped with no announcement at all, so a user who had
  already blurred the field never learned their date was rejected.
- **`labels.instructions`** (optional): keyboard help rendered first
  inside the dialog — class hook `date-time-picker-instructions` — and
  referenced by the dialog's `aria-describedby`, so screen readers speak
  it once on open. The APG date-picker example ships exactly this
  affordance.
- **`Escape` in the text field discards a pending edit**, restoring the
  committed display and clearing `aria-invalid`, mirroring the dialog's
  Escape contract. The keystroke does not propagate; with no pending
  edit the key is untouched.

### Initial entry — 2026-07-28

First release. Port of the canonical Svelte helper
`lily-design-system-svelte-date-time-picker` to a vanilla custom
element, following this catalog's established `<share-picker>` /
`<theme-picker>` idiom.

#### Added

- `<date-time-picker>` custom element: a text field plus an icon button
  (📅, U+1F4C5 + U+FE0E) that opens a WAI-ARIA APG Date Picker Dialog —
  a fixed six-row month grid with a full keyboard contract, optional
  time selects, optional quick-pick shortcuts, and a Confirm/Cancel/
  Clear footer.
- Observed attributes `label`, `mode`, `value`, `locale`, `min`, `max`,
  `first-day-of-week`, `minute-step`, `hour12`, `show-week-numbers`,
  `confirm-on-select`, `name`, `input-id`, `described-by`,
  `placeholder`, `disabled`, `readonly`, `required`, `class`, each with
  a mirrored camelCase property. `hour12` and `confirm-on-select` are
  tri-state (`"true"` / `"false"` / absent-means-auto), unlike this
  catalog's usual presence-based boolean convention, because their
  defaults depend on `locale` / `mode`.
- Property-only `labels`, `shortcuts`, `isDateDisabled`, `formatValue`,
  `parseInput`, `onChange`, `onShortcut`, `onInvalidInput`. Each
  callback is paired with a bubbling, composed `CustomEvent`:
  `datetimechange`, `shortcut`, `invalidinput`.
- Public methods `openDialog()`, `closeDialog(refocus?)`, and the
  overridable `renderButtonContent()` hook standing in for the `children`
  snippet the Svelte original exposes (light DOM has no `<slot>`).
- Read-only getters `open`, `dialogId`, `fieldId`.
- Civil-date arithmetic exported for consumer reuse: `pad`,
  `daysInMonth`, `formatIsoDate`, `parseIsoDate`, `toEpochDay`,
  `fromEpochDay`, `addDays`, `addMonths`, `weekdayOf`, `isoWeek`,
  `parseIsoTime`, `formatIsoTime`, `splitValue`, `joinValue`,
  `withinRange`, `firstDayOfWeekFor`, `monthMatrix`, `monthNames`,
  `numericFieldOrder`, `parseDateInput`, `parseTimeInput`,
  `nextDateTimePickerId`, and the `CALENDAR` glyph constant.
- The `#render()` / `#syncState()` split: a fixed 42-button grid built
  once and updated in place across month navigation, so paging never
  destroys the roving-tabindex focus.
- 74 vitest + jsdom cases mapped onto the spec's §7 acceptance clauses
  (§7.1–§7.48, ported clause-for-clause from the Svelte suite), plus
  coverage of the catalog idiom (attribute/property mirroring, tri-state
  boolean resolution, property-only members and their defensive copies,
  the render/sync split preserving focus and dialog state, event
  detail shapes, listener cleanup, and SSR import safety).

#### Notes

- No persistence: unlike the three preference helpers, nothing is
  written to `localStorage`. A date in a form is data, not a preference
  — the same rule `share-picker` follows for its own action.
- Civil-date arithmetic only. All date math goes through UTC epoch days,
  never a local-midnight `Date`, for the reasons in `spec/index.md` §3.
- Two deviations from the cross-framework Svelte prop table, both
  forced by the vanilla custom-element model and documented in
  `spec/index.md` §4.1 and §4.3: `hour12` / `confirmOnSelect` are
  tri-state attributes rather than plain booleans, and `labels` /
  `shortcuts` are property-only alongside the function-valued members,
  rather than JSON-encoded attributes.

---

Lily™ and Lily Design System™ are trademarks.
