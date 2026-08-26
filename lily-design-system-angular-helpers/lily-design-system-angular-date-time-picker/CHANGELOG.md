# Changelog — lily-design-system-angular-date-time-picker

All notable changes to this package. Format follows
[Keep a Changelog](https://keepachangelog.com/); versions follow
[Semantic Versioning](https://semver.org/).

## 0.2.0 — 2026-08-26

Angular 22 support: peer range widens to `>=20.0.0 <23.0.0`; built and
tested on Angular 22.1 (ng-packagr 22.1, TypeScript 6.0, vitest 4).
No behaviour change beyond 0.1.1.

## 0.1.0 — 2026-07-30

First published release. Nothing earlier shipped, so the
accessibility hardening completed after the initial entry below is
part of 0.1.0 rather than a later version.

### Accessibility hardening (2026-07-29/30)

Accessibility hardening, ported from the canonical Svelte helper: seven
changes, each fixing something a screen reader or keyboard user would
actually hit. Test count 60 → 67 (§7.49–§7.55); the §7.29–§7.31
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
- **Paging from the header buttons no longer steals focus into the
  grid.** `shiftMonth` refocuses the cursor only when focus was already
  inside the grid (where the focused cell is about to be unrendered);
  a user activating "next month" now stays on "next month" and can page
  repeatedly. Grid `PageUp`/`PageDown` behaviour is unchanged.
- **Clicking anything outside the dialog closes it — including the
  component's own text field.** The dialog claims `aria-modal="true"`;
  staying open while the user edits the field behind it told assistive
  technology one thing and did another.
- **Focus moves that target freshly-paged cells now render synchronously
  first** (`ChangeDetectorRef.detectChanges()` before the focus call).
  Angular renders after the microtask queue drains — zone-based and
  zoneless alike — so the previous `queueMicrotask`'d focus ran against
  the old month's DOM and lost focus to `<body>` on every cross-month
  page. An Angular-specific fix with no Svelte equivalent: Svelte
  flushes the DOM synchronously, which is what the canonical microtask
  pattern silently relied on. Recorded in spec §3.

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

Initial release. The Angular port of the fifth Lily helper, and the first
in this catalog that is a **form control** rather than a page-header
preference control.

#### Added

- `DateTimePicker` — a headless date / time / datetime control: a typeable
  text field plus an icon button (📅 U+1F4C5 + U+FE0E) opening a
  WAI-ARIA APG Date Picker Dialog.
- Three modes (`date`, `time`, `datetime`) over an ISO value contract:
  `YYYY-MM-DD`, `HH:MM`, `YYYY-MM-DDTHH:MM` — the same shape
  `<input type="date">` posts. `value` is a `model<string>()`, bound with
  `[(value)]`.
- Constraint inputs: `min`, `max`, and an arbitrary `isDateDisabled`
  predicate.
- `shortcuts` — consumer-labelled quick picks by day offset, calendar-month
  offset, or absolute date; reported via the `(shortcut)` output.
- Optional ISO-8601 week-number column (`showWeekNumbers`), with the
  Thursday rule, so the week containing 1 January 2021 is week 53.
- Typed input: ISO, locale-ordered numerics, and written month names in the
  locale's own vocabulary.
- `formatValue` / `parseInput` escape hatches.
- A projected `<ng-template>` icon slot, typed by the `DateTimePickerIcon`
  marker directive, replacing the default glyph.
- Exported civil-date arithmetic — `addDays`, `addMonths`, `isoWeek`,
  `monthMatrix`, `parseDateInput` and the rest — because a consumer wiring
  `min` / `max` / `shortcuts` is doing date maths too, and the alternative
  is that they reach for a `Date` and reintroduce the bug below.
- One test per acceptance clause in `spec/index.md` §7.

#### Implemented from DHCW

This package exists because Digital Health and Care Wales publishes a date
picker in its [NHSW component
library](https://github.com/dhcw-digital-health-and-care-wales/nhsw-component-library)
and Lily had no equivalent. Everything it does is here: the field and
toggle, the dialog, month and year navigation, the live-region heading,
weekday headers with `abbr`, full-date `aria-label`s on day cells, roving
tabindex, today / other-month / pending states, the whole keyboard contract
(arrows, Home/End, PageUp/Down, Shift+PageUp/Down, Enter, Escape),
shortcuts, the Cancel/OK footer, parse-on-open, change notification,
pre-population, `disabled`, `aria-describedby` passthrough, and
click-outside-to-close. Parity table in `spec/index.md` §8.

#### Deliberately different from DHCW

Twelve departures, ported unchanged from the canonical Svelte helper and
full list in `spec/index.md` §9; the four that matter most:

- **No hardcoded English.** DHCW bakes in `MONTHS`, `SHORT_MONTHS`,
  `"Today"`, `"+1 week"`, `"Cancel"`, `"OK"`, `"Previous year"` and
  `"Open calendar for …"`. Here, month and weekday names come from `Intl`
  and every other string is an input. For a *Welsh* design system this is
  not a technicality: it is the difference between a bilingual service
  and an English one with a Welsh veneer.
- **Monday is not assumed.** DHCW hardcodes a Monday-first grid. First day
  of week comes from `Intl.Locale.getWeekInfo`, overridable by input.
- **The focus trap exists.** DHCW declares `aria-modal="true"` and traps
  nothing, which is worse than not declaring it: the user is told the rest
  of the page is inert while Tab quietly walks into it.
- **Civil dates, not local-midnight `Date`.** DHCW builds every date with
  `new Date(y, m, d)`, which is an *instant* at local midnight and resolves
  to the previous day in zones whose DST transition falls at midnight. All
  arithmetic here goes through UTC epoch days.

#### Angular-specific deviations from the Svelte original

All noted in `spec/index.md` §3 and this package's `AGENTS.md`:

- `value` is `model<string>("")`, not a Svelte bindable prop.
- `onChange` / `onShortcut` / `onInvalidInput` become the outputs
  `(change)`, `(shortcut)`, `(invalidInput)`; `shortcut` emits one
  `ShortcutEvent` object rather than two positional arguments.
- `class` → `className`; `readonly` → `readOnly` (the DOM's own IDL
  property name, chosen to avoid colliding with the TypeScript `readonly`
  modifier that decorates every input declaration in this catalog).
- The `children` snippet becomes a projected `<ng-template>`, queried via
  `contentChild(TemplateRef)` and typed by the `DateTimePickerIcon` marker
  directive.
- No `...restProps` spread: Angular already forwards unbound attributes
  from the host tag onto the host element with no component code.
- The once-only view/cursor seed runs inside a guarded `effect()` rather
  than synchronously at construction, because Angular signal inputs are
  not bound yet when the constructor runs.

#### Notes

- **Nothing is persisted.** Unlike the three preference helpers, this
  writes no `localStorage`: a date in a form is data, not a preference,
  and restoring a stale appointment date on a later visit would be a
  defect.
- **No time zones, no seconds, no ranges, no recurrence.** Scope and
  reasoning in `spec/index.md` §2.
- Ports to the remaining catalogs are pending. Svelte is canonical per
  `AGENTS/helpers.md`.
