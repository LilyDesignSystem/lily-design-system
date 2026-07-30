# Changelog — DateTimePicker (React)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-30

First published release. Nothing earlier shipped, so the
accessibility hardening completed after the initial entry below is
part of 0.1.0 rather than a later version.

### Accessibility hardening (2026-07-29/30)

Accessibility hardening, ported from the canonical Svelte helper: seven
changes, each fixing something a screen reader or keyboard user would
actually hit. Test count 58 → 65 (§7.49–§7.55); the §7.29–§7.31
assertions moved from `disabled` to `aria-disabled`.

#### Changed

- **Vetoed days render `aria-disabled="true"` + `data-disabled` instead
  of the `disabled` attribute.** A `disabled` button refuses focus, so
  arrowing the roving cursor across a blocked week went silent for a
  screen reader while the visible focus stayed behind on the last legal
  day — and the "exactly one tabbable day" invariant broke whenever the
  cursor sat on a vetoed day. Days stay focusable and announce as
  unavailable; activation is still refused in `selectDay`. **CSS note:**
  `:disabled` selectors on `.date-time-picker-day` stop matching — target
  `[data-disabled]` or `[aria-disabled="true"]`.
- **Closing the dialog returns focus to the element that opened it** —
  the text field after `Alt`+`ArrowDown`, the trigger button after a
  click. It previously always went to the button, stranding keyboard
  users one Tab stop past where they were. This is the APG dialog rule.
  (React shape: `openDialog` captures the opener in an `openerRef`; the
  focus-request effect's old `"trigger"` target is now `"opener"`.)
- **Paging from the header buttons no longer steals focus into the
  grid.** `shiftMonth` refocuses the cursor only when focus was already
  inside the grid (where the focused cell is about to be unrendered) —
  checked against `document.activeElement` *before* the state updates
  are queued; a user activating "next month" now stays on "next month"
  and can page repeatedly. Grid `PageUp`/`PageDown` behaviour is
  unchanged.
- **Clicking anything outside the dialog closes it — including the
  component's own text field.** The dialog claims `aria-modal="true"`;
  staying open while the user edits the field behind it told assistive
  technology one thing and did another. (The document click listener now
  tests containment against the dialog and trigger button rather than
  the component root.)

#### Added

- **`labels.invalid`** (optional): a `role="status"` live region — class
  hook `date-time-picker-status`, present-but-empty while valid — that
  fills with the message when typed text is refused, wired to the field
  via `aria-errormessage` and appended to `aria-describedby`. Previously
  `aria-invalid` flipped with no announcement at all, so a user who had
  already blurred the field never learned their date was rejected.
- **`labels.instructions`** (optional): keyboard help rendered inside the
  dialog — class hook `date-time-picker-instructions` — and referenced by
  the dialog's `aria-describedby`, so screen readers speak it once on
  open. The APG date-picker example ships exactly this affordance.
- **`Escape` in the text field discards a pending edit**, restoring the
  committed display and clearing `aria-invalid`, mirroring the dialog's
  Escape contract. The keystroke does not propagate; with no pending edit
  the key is untouched.

### Initial entry — 2026-07-28

#### Added

- Initial release. The fifth helper ported to the React catalog, and the
  first that is a **form control** rather than a page-header preference
  control. A headless date / time / datetime control: a typeable text
  field plus an icon button (📅 U+1F4C5 + U+FE0E) opening a WAI-ARIA APG
  Date Picker Dialog.
- Three modes (`date`, `time`, `datetime`) over an ISO value contract:
  `YYYY-MM-DD`, `HH:MM`, `YYYY-MM-DDTHH:MM` — the same shape
  `<input type="date">` posts.
- Constraint props: `min`, `max`, and an arbitrary `isDateDisabled`
  predicate.
- `shortcuts` — consumer-labelled quick picks by day offset, calendar-month
  offset, or absolute date.
- Optional ISO-8601 week-number column (`showWeekNumbers`), with the
  Thursday rule.
- Typed input: ISO, locale-ordered numerics, and written month names in
  the locale's own vocabulary.
- `formatValue` / `parseInput` escape hatches.
- Exported civil-date arithmetic — `addDays`, `addMonths`, `isoWeek`,
  `monthMatrix`, `parseDateInput` and the rest — for consumers wiring
  `min` / `max` / `shortcuts`, matching the Svelte original's rationale
  for exporting them.
- 58 tests, one per acceptance clause in `spec/index.md` §7 — the same
  count as the canonical Svelte suite.
- Ported from the canonical Svelte helper
  (`lily-design-system-svelte-helpers/lily-design-system-svelte-date-time-picker/`),
  mirroring its spec §-numbering clause for clause. Per `AGENTS/helpers.md`,
  Svelte is canonical; where the two disagree, Svelte wins.

#### React-specific notes

- `value` follows this catalog's controlled-or-uncontrolled convention
  (the same `isControlled` / `internalValue` / `currentValue` shape as
  `ThemePicker` and `LocalePicker`) — the idiomatic React equivalent of
  the Svelte original's `value = $bindable("")`.
- Focus moves in a single unconditional `useEffect` that reads a ref set
  by whichever handler just ran, rather than inline in the handler — the
  target element may not exist in the DOM until the queued state change
  has re-rendered. The Svelte original used `queueMicrotask` for the same
  reason.
- **The one genuine logic change, not just an idiom swap:** `commit()`
  and `applyShortcut()` take explicit date/time overrides for the value
  about to be committed, rather than reading `pendingDate` / `pendingTime`
  state immediately after queuing an update to it. React's `setState`
  does not land until the next render, so a day click or a shortcut that
  both updates the pending selection *and* commits in the same handler
  needs the fresh value passed in directly, or it would commit the
  *previous* render's selection. Svelte's `$state` assignment takes
  effect immediately, so the original did not need this. Documented in
  `spec/index.md` §3.1 and `AGENTS.md` so a future edit does not "simplify"
  it back into a one-render-stale bug.
- Ids come from `React.useId()`; the exported `nextDateTimePickerId()`
  ships only for parity with the Svelte helper.
- The day grid uses real focusable `<button>` cells with a roving
  `tabindex`, matching `share-picker`'s pattern rather than the three
  listbox helpers' `aria-activedescendant` pattern — inherited unchanged
  from the canonical spec, since the grid was never a listbox.
- Nothing is persisted. Unlike the three preference helpers, this writes
  no `localStorage`.
- No time zones, no seconds, no ranges, no recurrence. Scope and
  reasoning in `spec/index.md` §2.
- Ports to the remaining catalogs (Vue, Angular, Blazor, Nunjucks, HTML)
  are pending. Svelte is canonical per `AGENTS/helpers.md`.
