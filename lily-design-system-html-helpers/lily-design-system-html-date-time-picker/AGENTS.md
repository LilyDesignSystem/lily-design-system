# AGENTS — `<date-time-picker>` (HTML helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A reusable vanilla HTML/JS headless date/time-picking control, packaged
as the `<date-time-picker>` custom element. A typeable text field plus
an icon button (📅, U+1F4C5 + U+FE0E) that opens a WAI-ARIA APG **Date
Picker Dialog**: a month grid with a full keyboard contract, optional
time selects, optional shortcuts, and a Confirm/Cancel footer. Ships no
CSS, no icons beyond the one glyph, and no hardcoded strings — month and
weekday names come from `Intl`, everything else from attributes or
properties.

Ported from the canonical Svelte helper
[`lily-design-system-svelte-date-time-picker`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-date-time-picker/).
Svelte wins on behaviour; this package supplies the custom-element
idiom. Unlike the three preference helpers (and like `share-picker`)
this control does not persist to `localStorage`: a date in a form is
data, not a preference.

## Files

| File | Purpose |
| ---- | ------- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `date-time-picker.ts` | Implementation (TypeScript custom-element class). |
| `date-time-picker.test.ts` | Vitest + jsdom spec, mapped to the §7 clauses (81 tests). |
| `index.ts` | Barrel re-export + side-effectful registration. |
| `index.md` | Human-readable guide. |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |
| `examples/` | Runnable HTML pages. |

## Public surface

- Class `DateTimePicker extends HTMLElement` (registered as
  `<date-time-picker>` on import of `index.ts`).
- Named exports: `DateTimePicker`, the `CALENDAR` glyph constant, and the
  civil-date arithmetic (`pad`, `daysInMonth`, `formatIsoDate`,
  `parseIsoDate`, `toEpochDay`, `fromEpochDay`, `addDays`, `addMonths`,
  `weekdayOf`, `isoWeek`, `parseIsoTime`, `formatIsoTime`, `splitValue`,
  `joinValue`, `withinRange`, `firstDayOfWeekFor`, `monthMatrix`,
  `monthNames`, `numericFieldOrder`, `parseDateInput`, `parseTimeInput`,
  `nextDateTimePickerId`).
- Type exports: `DateTimePickerProps`, `DateTimePickerLabels`,
  `DateTimePickerChangeDetail`, `DateTimePickerShortcutDetail`,
  `DateTimePickerInvalidDetail`, `DateTimeMode`, `DateTimeShortcut`,
  `CivilDate`, `CivilTime`.
- Instance members beyond the attribute mirrors: `open`, `dialogId`,
  `fieldId` (getters), `openDialog()`, `closeDialog(refocus?)`, and the
  overridable `renderButtonContent()` hook.

Required attribute: `label`. Required property: `labels`.

## Property-only members — and why

`labels`, `shortcuts`, `isDateDisabled`, `formatValue`, `parseInput`,
`onChange`, `onShortcut`, and `onInvalidInput` are **property-only** —
set via JS (`el.labels = {...}`), never as attributes. Four of them
(`isDateDisabled`, `formatValue`, `parseInput`, and the three callbacks)
carry functions, so there is no honest string encoding at all — the
same reason `share-picker`'s `targets`/`onShare`/`onCopy`/`onNativeShare`
are property-only. `labels` and `shortcuts` carry plain data (strings,
numbers) and *could* be JSON-attribute-encoded per this catalog's usual
object-attribute convention, but are grouped with the function-valued
members instead: see `spec/index.md` §4.3 for the reasoning (a JSON
round-trip risks silently dropping an optional label key, and `labels`
gates real UI existence the way `share-picker`'s `copy-label` does, so
it belongs on the `#render()` rebuild path, not the attribute path).

Each callback is paired with a bubbling `CustomEvent` — `datetimechange`,
`shortcut`, `invalidinput` — matching how `share-picker` pairs
`onCopy`+`copy` and `theme-picker` exposes `themechange`. Callback fires
first, then the event.

## Tri-state boolean attributes — `hour12` and `confirm-on-select`

Unlike this catalog's usual boolean-attribute convention (absent = false,
present = true), these two resolve a **locale-** or **mode-dependent**
default when absent. The attribute reads three states: `"true"`,
`"false"`, or anything else (including absence), which falls through to
`localeUsesHour12(locale)` / `mode === "date"` respectively. This
mirrors the Svelte prop's `boolean | undefined` type exactly. Do not
"simplify" these to the ordinary presence convention — that would make
"unset" indistinguishable from "explicitly false", losing the
locale-follows-along behaviour the Svelte original (and the DHCW parity
table) both rely on.

## Behaviour contract (one paragraph)

The value is an ISO string shaped by `mode`: `YYYY-MM-DD`, `HH:MM`, or
`YYYY-MM-DDTHH:MM`. Selection inside the dialog writes to *pending*
private state; only Confirm — or a day click when `confirmOnSelect`
(default: date-only mode) — commits to `value` and fires `onChange` +
`datetimechange`. Cancel, Escape, and click-outside (which includes the
component's own text field — aria-modal coherence) close without
committing; closing returns focus to whichever element opened the
dialog (button after a click, field after Alt+ArrowDown). Typed text
resolves on blur or Enter through ISO → locale-ordered numerics →
written month names; text that will not parse, or that lands outside
`min`/`max`/`isDateDisabled`, sets `aria-invalid` and fires
`onInvalidInput` + `invalidinput` rather than being silently snapped to
something legal — and, when `labels.invalid` is supplied, fills the
`role="status"` region so the refusal is announced. `Escape` in the
field discards a pending typed edit without committing. Nothing is
persisted.

## HTML

`<date-time-picker>` wraps one rendered
`<div class="date-time-picker {class}" data-mode>` → hidden input →
`<div class="date-time-picker-field">` with
`<input class="date-time-picker-input">` and
`<button class="date-time-picker-button" aria-haspopup="dialog">` →
optional `<span class="date-time-picker-status" role="status">` (only
when `labels.invalid`; empty while valid) →
`<div class="date-time-picker-dialog" role="dialog" aria-modal="true"
tabindex="-1" hidden>` containing an optional
`<p class="date-time-picker-instructions">` first (only when
`labels.instructions`; the dialog's `aria-describedby` target), the
header, a `role="grid"` `<table>` of `date-time-picker-day` buttons with
roving tabindex (vetoed days are `aria-disabled` + `data-disabled`,
never `disabled`), optional time selects, optional shortcuts, and the
footer.

Full contract in `spec/index.md` §4.4.

## Things not to undo

Each of these encodes a bug that was avoided on purpose; the canonical
Svelte helper carries the same list.

- **Vetoed days are `aria-disabled`, never the `disabled` attribute.** A
  `disabled` button refuses focus: arrowing across a blocked week goes
  silent and the "exactly one tabbable day" invariant breaks. Activation
  is refused in `#selectDay` instead.
- **The opener reference is load-bearing.** Closing must return focus to
  whatever opened the dialog — the field after Alt+ArrowDown — not
  always the trigger button.
- **`#shiftMonth` checks `#tableEl.contains(document.activeElement)`
  before refocusing the cursor.** Grid paging must carry focus (the
  focused cell is unrendered); header prev/next must NOT steal it, or
  the user cannot page twice.
- **The status region is present-but-empty while valid.** A live region
  born together with its message is routinely not announced at all.
- **The focus trap is load-bearing.** `aria-modal="true"` is a promise
  the browser does not keep.
- **`el?.focus?.()` and `el?.scrollIntoView?.()` guard the METHOD.**
  jsdom implements neither; an unguarded call throws inside a keydown
  handler where a green suite never sees it.

## The `#render()` / `#syncState()` split — the biggest engineering surface in this port

Load-bearing; do not collapse it. There is no Svelte equivalent to defer
to here — this mechanism exists purely because a vanilla custom element
has no reactivity graph, so the component has to decide by hand which
prop changes justify a rebuild.

- **`#render()`** rebuilds the entire subtree and **closes the dialog
  first** — a rebuild cannot preserve focus. Runs on connect, and on the
  five structural attributes (`mode`, `show-week-numbers`, `hour12`,
  `locale`, `first-day-of-week`) plus assignment to `labels` /
  `shortcuts`. Creates a **fixed 42-button grid** (6 rows × 7 cells,
  always, even for a 4-row month) that persists across every subsequent
  month-page.
- **`#syncState()`** writes attributes / text content in place — never
  creates or destroys a node. Runs for every other attribute, for the
  `isDateDisabled` / `formatValue` property setters, and after **every
  internal interaction**: open, close, page the month, move the cursor,
  select a day, change the pending time. This is what makes month
  navigation cheap: the same 42 day buttons persist, only their
  `data-date` / `aria-label` / state attributes change.
- The field's `.value` is only reassigned when it actually differs from
  what's already there — while the user is mid-edit, the displayed text
  and the internal pending-typed-text state are equal by construction,
  so this guard is what keeps the caret from jumping mid-keystroke.

## Accessibility

- WAI-ARIA APG Date Picker Dialog pattern; WCAG 2.2 AAA target.
- Keyboard: full grid contract (arrows, Home/End, PageUp/Down,
  Shift+PageUp/Down, Enter/Space) plus a genuine focus trap in the
  dialog and roving tabindex on the grid.
- Costs recorded in [`docs/accessibility.md`](./docs/accessibility.md):
  icon-only trigger naming, a font-dependent glyph, the inherent
  difficulty of date entry, and — new to this port — that the five
  structural attributes close the dialog on change, a cost the Svelte
  original does not pay.

## Conventions this package follows

- Vanilla web component (custom element extending `HTMLElement`).
- Light DOM only (no Shadow DOM); subclassing `renderButtonContent()`
  stands in for the `children` snippet the Svelte original exposes.
- Strict TypeScript on the public surface.
- No runtime dependencies — no date library, matching the Svelte
  original.
- No bundled CSS, fonts, icons, images, or third-party URLs.
- Civil-date arithmetic only — never a local-midnight `Date` for date
  math. See `spec/index.md` §3.
- All user-facing strings come from attributes / properties / `Intl` —
  including AM/PM, which is never hardcoded.
- Mirrors the Svelte sibling's §7 acceptance criteria clause for clause.
