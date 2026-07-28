# Changelog — DateTimePicker (React)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-28

### Added

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

### React-specific notes

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
