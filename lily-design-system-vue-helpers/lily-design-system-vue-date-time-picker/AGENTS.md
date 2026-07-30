# AGENTS — DateTimePicker (Vue helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A Vue 3 headless control for collecting a date, a time, or both: a
typeable text field plus an icon button (📅 U+1F4C5 + U+FE0E) that opens a
WAI-ARIA APG **Date Picker Dialog**. Ships no CSS, no icons, and no
hardcoded user-facing strings — month and weekday names come from `Intl`,
everything else from props.

A direct port of the canonical
[`lily-design-system-svelte-date-time-picker`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-date-time-picker/).
When the two disagree, the Svelte side wins.

It implements everything in the DHCW / NHSW `nhsw-date-picker` and fixes
twelve defects along the way; parity table in spec §8, departures in §9.

## Files

| File | Purpose |
| ---- | ------- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `DateTimePicker.vue` | Implementation. `<script setup lang="ts">`. |
| `DateTimePicker.test.ts` | Vitest spec, mapped to the §7 clauses (67 tests). |
| `index.ts` | Barrel re-export. |
| `index.md` | User guide. |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |
| `examples/` | Runnable Vue 3 SFCs. |

## Public surface

Default export `DateTimePicker`; named `DateTimePicker`, the `CALENDAR`
glyph constant, `nextDateTimePickerId`, and the civil-date arithmetic
(`addDays`, `addMonths`, `parseIsoDate`, `formatIsoDate`, `toEpochDay`,
`fromEpochDay`, `weekdayOf`, `isoWeek`, `daysInMonth`, `parseIsoTime`,
`formatIsoTime`, `splitValue`, `joinValue`, `withinRange`, `monthMatrix`,
`firstDayOfWeekFor`, `monthNames`, `numericFieldOrder`, `parseDateInput`,
`parseTimeInput`). Types: `Props`, `SlotArgs`, `ChildArgs` (alias of
`SlotArgs`), `CivilDate`, `CivilTime`, `DateTimeMode`, `DateTimeShortcut`,
`DateTimePickerLabels`.

Required props: `label`, `labels`.

## Behaviour contract (one paragraph)

The value is an ISO string shaped by `mode`: `YYYY-MM-DD`, `HH:MM`, or
`YYYY-MM-DDTHH:MM`, two-way bindable via `v-model:value`. Selection inside
the dialog writes to *pending* refs; only Confirm — or a day click when
`confirmOnSelect` (default: date-only mode) — writes to the committed
value and emits `change` + `update:value`. Cancel, Escape and
click-outside close without committing. Typed text resolves on blur or
Enter through ISO → locale-ordered numerics → written month names; text
that will not parse, or that lands outside `min`/`max`/`isDateDisabled`,
sets `aria-invalid` and emits `invalidInput` rather than being snapped to
something legal. Nothing is persisted: a date in a form is data, not a
preference.

## Public surface: props → events

The Svelte canonical's `onChange` / `onShortcut` / `onInvalidInput`
callback props map to the `change` / `shortcut` / `invalidInput` emitted
events (`@invalid-input` in templates), the same way `onShare` maps to
`@share` on `share-picker`. `value` is `v-model:value` — Vue's standard
two-way binding, matching `theme-picker` and `locale-picker` — rather than
a bindable prop.

## Things not to undo

These each encode a bug that was avoided on purpose.

- **Civil dates, never local-midnight `Date`.** All arithmetic goes through
  UTC epoch days. `new Date(y, m, d)` is an instant at local midnight and
  resolves to the previous day in some zones on DST days.
- **The focus trap is load-bearing.** `aria-modal="true"` is a promise the
  browser does not keep. Removing the trap makes the ARIA a lie.
- **Pending state is separate from the committed value.** Collapsing them
  removes any meaning from Cancel and Escape.
- **`el?.focus?.()` and `el?.scrollIntoView?.()` guard the METHOD.** jsdom
  implements neither; an unguarded call throws inside a keydown handler
  where a green suite never sees it. This shape has bitten these helpers
  three times already, across catalogs.
- **The six required label keys stay required.** Inventing an English
  accessible name for a nav button is the defect this package exists to
  avoid — most of all in a Welsh-language context.
- **Fixed six-row grid.** Variable height moves the confirm button as the
  user pages.
- **Vetoed days are `aria-disabled`, never the `disabled` attribute.** A
  `disabled` button refuses focus, so arrowing across a blocked week goes
  silent for a screen reader while visible focus stays behind. Activation
  is refused in `selectDay` instead.
- **Focus returns to the element that opened the dialog** — the text
  field after `Alt`+`Arrow Down`, the button after a click. Hardcoding
  the button strands keyboard users one Tab stop past where they were.
- **Header paging never refocuses the grid.** `shiftMonth` moves focus to
  the cursor only when focus was already inside the grid; otherwise a
  user activating "next month" is yanked away after one press.
- **`await nextTick()` before every post-visibility-change `.focus()`
  call.** A `hidden` element cannot take focus until the DOM has flushed.
  No test catches its removal (jsdom does not enforce the restriction) —
  do not "simplify" it away.

## HTML

`<div class="date-time-picker" data-mode>` → hidden input → `<div
class="date-time-picker-field">` with `<input class="date-time-picker-input">`
and `<button class="date-time-picker-button" aria-haspopup="dialog">` →
optional `role="status"` live region (gated on `labels.invalid`) →
`<div class="date-time-picker-dialog" role="dialog" aria-modal="true"
tabindex="-1" hidden>` containing optional keyboard help (gated on
`labels.instructions`, described-by the dialog), the header, a
`role="grid"` `<table>` of `date-time-picker-day` buttons with roving
tabindex (vetoed days `aria-disabled`, not `disabled`), optional time
selects, optional shortcuts, and the footer.

Full contract in spec §4.5.

## Conventions this package follows

- Vue 3 `<script setup lang="ts">` Composition API.
- `defineProps` + `withDefaults`, `defineEmits` for typed props/events.
- `ref`, `computed`, `watch`, `onMounted`, `onBeforeUnmount` for state and
  lifecycle.
- Strict TypeScript on the public surface.
- No runtime dependency beyond `vue` — no date library.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props or from `Intl`.
- SSR-safe: no DOM writes outside `onMounted`; ids from a module counter.

## Vue gotchas this package already handles

- `:hidden="open ? undefined : true"` and explicit `'true'` / `'false'`
  ternaries for `aria-expanded`, `aria-selected`. Vue 3.5 normalises raw
  booleans correctly for both, but the explicit forms match the siblings
  and state the intent.
- `await nextTick()` before `.focus()` in `openDialog`, `closeDialog`,
  `shiftMonth`, and `applyShortcut`. jsdom does not enforce the
  restriction, so **no test guards it** — do not "simplify" it away.
- `openDialog` / `closeDialog` / `shiftMonth` / `applyShortcut` are async
  (because of the `nextTick()` above); the template calls them through
  small synchronous void-safe wrapper functions
  (`onTriggerClick`, `onPreviousMonthClick`, `onShortcutClick`, …) rather
  than inline in `@click`, so a floating promise never reaches a lint
  rule or an unhandled-rejection channel.
- An internal `current` ref plus a `watch(() => props.value, …)` mirrors
  the two-way binding, exactly as `locale-picker` / `theme-picker` do —
  the control works controlled or uncontrolled.

## Divergence from the sibling helpers

Two, both deliberate and both noted in spec §3:

1. **It is a form control, not a page-header preference control.** So it
   has a text field, and the "one shape: icon button opening a popup" rule
   in `AGENTS/helpers.md` applies only to its trigger.
2. **Strings arrive as one `labels` object**, not a dozen flat `*Label`
   props. The siblings need two or three strings; this needs ten.
