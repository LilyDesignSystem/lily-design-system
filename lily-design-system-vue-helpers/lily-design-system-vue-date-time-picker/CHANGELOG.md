# Changelog — DateTimePicker (Vue)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.1 — 2026-08-26

Metadata-only patch; no behaviour change. Ships the corrected package
metadata to the registry: the project SPDX license menu (`MIT OR
Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause`) replacing
the single-license field that contradicted the repository's
LICENSE.md, `repository`/`homepage`/`bugs` URLs, a named author, and a
description that says what the package does.

## 0.1.0 — 2026-07-30

First published release. Nothing earlier shipped, so the
accessibility hardening completed after the initial entry below is
part of 0.1.0 rather than a later version.

### Accessibility hardening (2026-07-29/30)

Accessibility hardening ported from the Svelte canonical: seven changes,
each fixing something a screen reader or keyboard user would actually
hit. Test count 60 → 67 (§7.49–§7.55); the §7.29–§7.31 assertions moved
from `disabled` to `aria-disabled`.

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
- **Paging from the header buttons no longer steals focus into the
  grid.** `shiftMonth` refocuses the cursor only when focus was already
  inside the grid (where the focused cell is about to be unrendered);
  a user activating "next month" now stays on "next month" and can page
  repeatedly. Grid `PageUp`/`PageDown` behaviour is unchanged.
- **Clicking anything outside the dialog closes it — including the
  component's own text field.** The dialog claims `aria-modal="true"`;
  staying open while the user edits the field behind it told assistive
  technology one thing and did another. (The outside-click listener now
  tests against the dialog and the trigger button, not the whole root.)

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

Initial release. A direct port of the canonical
[`lily-design-system-svelte-date-time-picker`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-date-time-picker/)
0.1.0, the fifth Lily helper and the first form-value helper in this
catalog — the three `*-picker` siblings own a preference lifecycle and
`share-picker` owns an action; this one owns a form value, and, like
`share-picker`, applies nothing to the document and persists nothing.

#### Added

- Headless Vue 3 control for collecting a **date**, a **time**, or
  **both**: a typeable text field plus an icon button (📅 U+1F4C5 +
  U+FE0E) that opens a WAI-ARIA APG Date Picker Dialog with a full
  keyboard contract.
- Locale-correct by construction: month names, weekday names, first day
  of week, numeric field order, 12- vs 24-hour clock, and AM/PM names all
  come from `Intl`, overridable by prop, never from a baked-in table.
- Civil-date arithmetic through UTC epoch days — never local-midnight
  `Date` construction — exported alongside the component for consumers
  wiring `min`, `max`, `shortcuts`, or `isDateDisabled`.
- `min` / `max` / `isDateDisabled` constrain selection; a blocked day
  renders `disabled` but the keyboard cursor can still cross it.
- `shortcuts` for quick-pick buttons, using calendar-month arithmetic
  (`addMonths`), not a fixed day count.
- Typed input resolves ISO → locale-ordered numerics → written month
  names, with `parseInput` to override; unparseable or out-of-range text
  is marked `aria-invalid` and emits `invalidInput` rather than being
  silently snapped to a nearby legal date.
- A real focus trap inside the dialog — `aria-modal="true"` is a promise
  the browser does not enforce on its own.
- Fixed six-row month grid, so the footer's Confirm button never moves
  vertically as the user pages.
- `mode="time"` and `mode="datetime"`, with `minuteStep` and `hour12`.
- `showWeekNumbers` for a real ISO-8601 week column.
- `value` is two-way bindable via `v-model:value`, matching `theme-picker`
  and `locale-picker` — an internal `current` ref keeps the control
  working both controlled and uncontrolled.
- The Svelte canonical's `onChange` / `onShortcut` / `onInvalidInput`
  callback props are `change` / `shortcut` / `invalidInput` emitted
  events here (`@invalid-input` in templates).
- The default scoped slot replaces the trigger's glyph and receives
  `SlotArgs` (aliased as `ChildArgs`, matching `theme-picker` and
  `text-size-picker`'s naming).
- `DateTimePicker.test.ts` — vitest cases under jsdom + `@vue/test-utils`,
  one or more per numbered `spec/index.md` §7 clause (48 clauses,
  §7.1–§7.48 with some gaps, mirroring the Svelte suite's numbering), plus
  two Vue-idiom cases for `v-model:value` round-tripping and the scoped
  slot.
- `docs/accessibility.md`, `examples/basic.vue`, `examples/nhs-booking.vue`,
  and this file.

#### Framework deviations from the Svelte canonical

All idiomatic rather than behavioural — the contract in `spec/index.md`
§5–§9 is identical to the Svelte side.

- `bind:value` becomes `v-model:value` (prop `value` + `update:value`
  event), matching `locale-picker` / `theme-picker` rather than
  `share-picker` (which has no bindable value, being an action helper).
- `onChange` / `onShortcut` / `onInvalidInput` callback props become
  `change` / `shortcut` / `invalidInput` emitted events.
- The `children` snippet becomes the **default scoped slot**; `ChildArgs`
  is exported as an alias of the primary type `SlotArgs`.
- `$bindable` + `$state` + `$derived` become `ref` + `computed` +
  `withDefaults(defineProps<Props>(), {...})`.
- `$effect` (the one-shot "seed today, then anchor the view" effect)
  becomes `onMounted`.
- `queueMicrotask(() => focusX())` becomes `await nextTick(); focusX();`
  inside async functions, called from the template through small
  synchronous void-safe wrapper functions (`onTriggerClick`,
  `onPreviousMonthClick`, `onShortcutClick`, …) rather than inline in
  `@click` — an async handler returning a promise from a template
  expression is a floating promise under a strict lint config.
- `...restProps` spread becomes Vue's automatic `$attrs` fall-through onto
  the single root element — no explicit spread needed.
- Explicit `'true'` / `'false'` string ternaries for `aria-expanded` /
  `aria-selected`, and `:hidden="open ? undefined : true"` for the
  dialog's `hidden` attribute — the same convention as every sibling
  helper in this catalog.

#### Not undone from the Svelte canonical

- Civil dates via epoch-day arithmetic, never local-midnight `Date`
  construction.
- The real focus trap.
- Pending state kept separate from the committed value.
- `el?.focus?.()` / `el?.scrollIntoView?.()` guarding the method, not only
  the element — jsdom implements neither, and an unguarded call throws
  inside a keydown handler where a green suite never sees it.
- The six required label keys (`previousYear`, `previousMonth`,
  `nextMonth`, `nextYear`, `confirm`, `cancel`) with no English default.
- The fixed six-row grid.
- No persistence: unlike the three preference helpers, nothing is written
  to `localStorage`.

---

Lily™ and Lily Design System™ are trademarks.
