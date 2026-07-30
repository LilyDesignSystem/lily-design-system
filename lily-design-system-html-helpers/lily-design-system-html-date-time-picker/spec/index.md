# `<date-time-picker>` — Specification

Single source of truth for the `lily-design-system-html-date-time-picker`
HTML helper. This file drives implementation, testing, and
documentation: anything not in this spec is out of scope; anything in
this spec must be exercised by a test.

Ported from the canonical Svelte helper
[`lily-design-system-svelte-date-time-picker`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-date-time-picker/spec/index.md).
Per [`AGENTS/helpers.md`](../../../AGENTS/helpers.md) the Svelte side
wins on behaviour; this file records the vanilla-custom-element idiom
and the places the API shape could not be carried over verbatim (§4.3
property-only members, §4.1 tri-state boolean attributes).

Sibling files:

- `date-time-picker.ts` — the implementation (custom-element class)
- `date-time-picker.test.ts` — vitest + jsdom spec exercising every clause in §7
- `index.ts` — barrel re-export + side-effectful registration
- `index.md` — user-facing guide
- `docs/accessibility.md` — tradeoffs, stated plainly

---

## 1. Goal

Give any HTML page a drop-in, headless control for collecting a
**date**, a **time**, or **both**, that:

1. Renders a text field plus an icon button that opens a WAI-ARIA APG
   **Date Picker Dialog**: a month grid with a full keyboard contract.
2. Is **locale-correct by construction** — month names, weekday names,
   first day of week, numeric field order, 12- vs 24-hour clock and
   day-period names all come from `Intl`, never from a baked-in table.
3. Accepts **typed input** as well as pointer and keyboard selection.
4. Constrains selection with `min`, `max`, and an arbitrary
   `isDateDisabled` predicate.
5. Ships zero CSS — the consumer styles every visual aspect via the
   `date-time-picker` class hooks.

### 1.1 Relationship to the DHCW date picker

This helper carries forward everything the Svelte canonical documents in
its own §1.1 and §8–§9: feature parity with the Digital Health and Care
Wales `nhsw-date-picker`, and the same deliberate departures (no
hardcoded English, Monday is not assumed, a real focus trap, civil dates
not local-midnight `Date`, `min`/`max`/`isDateDisabled`, a fixed-height
grid, no `innerHTML` string building, SSR-safe ids, typed-input
round-tripping, a genuinely discarding Escape, and time support). See the
Svelte spec §8–§9 for the full table; nothing in that comparison changes
in this port.

## 2. Non-goals

Identical to the Svelte canonical's §2:

- **Time zones.** The value is a civil date and/or wall-clock time with
  no zone attached.
- **Seconds, or sub-minute precision.**
- **Ranges.** Use two of these plus a cross-field validity rule, or this
  catalog's `calendar-range-picker` when it exists.
- **Recurrence.**
- **Persistence.** Unlike the three preference helpers in this catalog
  (`theme-picker`, `locale-picker`, `text-size-picker`), this control
  does not write to `localStorage`, the same way `share-picker` does
  not: a date in a form is *data*, not a preference.
- **Relative-date parsing** ("tomorrow", "next Friday"). Use `shortcuts`.
- **Shipped positioning CSS** for the dialog. The package stays headless.

## 3. Architectural decisions

Carried forward from the Svelte canonical, unchanged by the port:

- **Civil dates, never local-midnight `Date`.** All arithmetic goes
  through UTC epoch days. See the Svelte spec §3 for the full argument;
  it applies verbatim here since the arithmetic functions are a
  line-for-line port.
- **ISO 8601 is the value contract.** `YYYY-MM-DD`, `HH:MM`, or
  `YYYY-MM-DDTHH:MM`.
- **Pending state is separate from the committed `value`.** Selection
  inside the dialog writes to private `#pendingDate` / `#pendingTime`
  fields; only Confirm (or a day click in `confirmOnSelect` mode) writes
  to `value`.
- **A real focus trap.** `aria-modal="true"` is a promise the browser
  does not enforce.
- **Labels arrive as one object**, and — new to this port — **that
  object is property-only**. See §4.3.
- **Fixed six-row grid.**
- **No dependencies beyond the DOM.** No date library, no framework
  runtime. `Intl` and epoch-day arithmetic cover everything in scope.

Two decisions are specific to this port:

- **The `#render()` / `#syncState()` split**, following this catalog's
  `share-picker` precedent (see §5.7). This is the mechanism that
  replaces Svelte's fine-grained reactivity: a vanilla custom element has
  no signal graph, so the component must decide by hand which prop
  changes justify tearing down and rebuilding the DOM (and therefore
  closing the dialog) versus which can be satisfied by writing an
  attribute or a text node in place. Getting this split wrong either
  destroys focus on every navigation keystroke or leaves stale markup
  after a structural change; §5.7 states the exact bucketing this
  package uses and why.
- **A fixed 42-button grid, reused across months.** The six-row, seven
  column grid of day `<button>` elements is created once, in `#render()`,
  and never recreated for as long as `mode`/`showWeekNumbers` stay the
  same. Paging the month, moving the roving-tabindex cursor, and
  selecting a day all update the same 42 buttons' attributes and text in
  `#syncState()` — this is what makes month-to-month navigation cheap and
  keeps the currently-focused button element from ever being replaced
  out from under the user's focus.

## 4. Public API

### 4.1 Observed attributes

| Attribute | Type | Required | Default | Purpose |
| --------- | ---- | -------- | ------- | ------- |
| `label` | string | yes | `""` | Accessible name for **both** the trigger button and the dialog. |
| `mode` | `"date" \| "time" \| "datetime"` | no | `"date"` | What to collect. An unrecognised value falls back to `"date"`. |
| `value` | string | no | `""` | ISO value. |
| `locale` | string | no | runtime default | BCP 47 tag driving all formatting. |
| `min` | string | no | — | Earliest selectable date, ISO. |
| `max` | string | no | — | Latest selectable date, ISO. |
| `first-day-of-week` | number (`"0"`–`"6"`) | no | from `locale` | 0 = Sunday … 6 = Saturday. Absent, empty, or out of range falls back to the locale. |
| `minute-step` | number | no | `1` | Granularity of the minute select. |
| `hour12` | `"true" \| "false"` | no | from `locale` | 12-hour clock. **Tri-state** — see below. |
| `show-week-numbers` | boolean (presence) | no | `false` | Render an ISO-8601 week column. |
| `confirm-on-select` | `"true" \| "false"` | no | `mode === "date"` | Commit and close on day click. **Tri-state** — see below. |
| `name` | string | no | `"date-time"` | `name` of the hidden input. |
| `input-id` | string | no | generated | `id` of the text field, for a consumer `<label for>`. |
| `described-by` | string | no | — | Forwarded as `aria-describedby`. |
| `placeholder` | string | no | — | Placeholder for the text field. |
| `disabled` | boolean (presence) | no | `false` | Disable the whole control. |
| `readonly` | boolean (presence) | no | `false` | Show the value, refuse edits. |
| `required` | boolean (presence) | no | `false` | Mark the field required. |
| `class` | string | no | `""` | Extra CSS class on the rendered root `<div>`. |

**Tri-state booleans (`hour12`, `confirm-on-select`).** This catalog's
usual boolean-attribute convention — absent means `false`, present means
`true` (`theme-picker`'s `detect-from-system`, this package's own
`show-week-numbers`) — cannot express "absent means *compute a default*"
because the resolved default depends on `locale` or `mode`. So these two
read three states from the attribute: `"true"` and `"false"` are
explicit; anything else (including absence) falls through to the
locale/mode-derived default, exactly matching the Svelte prop's
`boolean | undefined` type where `undefined` means "let the component
decide". `disabled`, `readonly`, `required`, and `show-week-numbers` stay
ordinary presence-based booleans, because none of them has a
locale-dependent default to fall back to.

### 4.2 JS properties

Every attribute above has a mirrored camelCase property
(`label`, `mode`, `value`, `locale`, `min`, `max`, `firstDayOfWeek`,
`minuteStep`, `hour12`, `showWeekNumbers`, `confirmOnSelect`, `name`,
`inputId`, `describedBy`, `placeholder`, `disabled`, `readonly`,
`required`). Writing the property writes the attribute (or removes it
for `undefined`); reading it reads the attribute, resolving the same
default the markup would.

Read-only: `open` (is the dialog open?), `dialogId` (id of the rendered
`role="dialog"` element), `fieldId` (id of the rendered text field,
same value as `inputId`).

No renamed prop is needed against the cross-framework table here —
unlike `share-picker`'s `title` → `share-title`, nothing in this
control's prop list collides with a global `HTMLElement` member or
reflected attribute. `name` is the one that looks likely to collide and
does not: `HTMLElement` has no `name` property (that only exists on
form-associated elements this class does not extend), so it is free to
mean exactly what the Svelte prop means — the `name` of the rendered
hidden input.

### 4.3 Property-only members

Six parts of the canonical API cannot be attributes:

| Member | Type | Why it cannot be an attribute | Paired event |
| ------ | ---- | ------------------------------ | ------------ |
| `labels: DateTimePickerLabels` | object, 6 required + 7 optional strings | See below. | — |
| `shortcuts: DateTimeShortcut[]` | array of objects | Each entry mixes a string `label` with optional numeric `days`/`months` and an optional ISO `date`; no single attribute encoding covers the shape without ambiguity, and this catalog's usual "comma-separated string" convention only handles a flat array of plain strings. | `shortcut` |
| `isDateDisabled` | `(isoDate: string) => boolean` | Function. | — |
| `formatValue` | `(value: string) => string` | Function. | — |
| `parseInput` | `(text: string) => string \| null` | Function. | — |
| `onChange` | `(value: string) => void` | Function-valued callback. | `datetimechange` |
| `onShortcut` | `(id: string, isoDate: string) => void` | Function-valued callback. | `shortcut` |
| `onInvalidInput` | `(text: string) => void` | Function-valued callback. | `invalidinput` |

**Why `labels` is property-only rather than a JSON attribute.** This
catalog does JSON-encode some object-valued attributes elsewhere
(`AGENTS.md` § Conventions documents the pattern). `labels` deliberately
does not follow that path, for the same reason `share-picker`'s
`targets` does not: it is grouped with the function-valued members
above because all of them arrive together, once, as the control's
setup — not as a value a server-rendered page is expected to encode
inline — and a JSON-attribute round-trip risks silently dropping an
optional key (`clear`, `week`, `meridiem`, `invalid`, `instructions`)
with no error, which is worse than refusing the encoding outright. `labels` also gates real UI
existence (the clear button, the week-number heading, the meridiem
select's label) exactly the way `share-picker`'s `copy-label` does, so
it participates in the same `#render()` rebuild path as the function
props, not the `#syncState()` path attributes use.

Every callback is paired with a bubbling, composed `CustomEvent`,
matching `theme-picker`'s `themechange` and `share-picker`'s `share` /
`copy` / `nativeshare`:

| Event | Detail | Fires when |
| ----- | ------ | ---------- |
| `datetimechange` | `{ value: string }` | A value is committed (Confirm, a committing day click, Clear, or a resolved typed edit). |
| `shortcut` | `{ id: string; isoDate: string }` | A shortcut resolves to a selectable date. |
| `invalidinput` | `{ text: string }` | Typed text will not parse, or parses outside `min`/`max`/`isDateDisabled`. |

Ordering: callback first, then `dispatchEvent`. Both always fire when
the underlying action fires at all — the callback is a convenience, not
an alternative. `datetimechange` does **not** fire when the committed
value would be unchanged (§5.3), and `shortcut` does not fire when the
shortcut resolves to a blocked date (§5.5) — both match the Svelte
`onChange` / `onShortcut` firing rules exactly.

### 4.4 DOM contract

```html
<date-time-picker label="Choose a date" mode="date" value="…">
  <div class="date-time-picker {class}" data-mode="date">
    <input type="hidden" name="{name}" value="{value}" />

    <div class="date-time-picker-field">
      <input class="date-time-picker-input" id="{fieldId}" type="text"
             autocomplete="off" value="{display}" aria-invalid="true|absent"
             aria-errormessage="{statusId} while invalid, when labels.invalid" />
      <button type="button" class="date-time-picker-button" aria-label="{label}"
              aria-haspopup="dialog" aria-expanded="false"
              aria-controls="{dialogId}">
        <span class="date-time-picker-icon" aria-hidden="true">&#128197;&#65038;</span>
      </button>
    </div>

    <!-- Only when labels.invalid: always present, empty while valid. -->
    <span class="date-time-picker-status" id="{statusId}" role="status"></span>

    <div class="date-time-picker-dialog" id="{dialogId}" role="dialog"
         aria-modal="true" aria-label="{label}" tabindex="-1" hidden
         aria-describedby="{instructionsId} when labels.instructions">
      <!-- Only when labels.instructions: keyboard help, spoken on open. -->
      <p class="date-time-picker-instructions" id="{instructionsId}">…</p>

      <div class="date-time-picker-header">
        <button class="date-time-picker-previous-year"  aria-label="…">«</button>
        <button class="date-time-picker-previous-month" aria-label="…">‹</button>
        <span   class="date-time-picker-period" id="{periodId}" aria-live="polite">March 2026</span>
        <button class="date-time-picker-next-month"     aria-label="…">›</button>
        <button class="date-time-picker-next-year"      aria-label="…">»</button>
      </div>

      <table class="date-time-picker-calendar" role="grid" aria-labelledby="{periodId}">
        <thead><tr>
          <th class="date-time-picker-week-heading" scope="col" abbr="…">…</th>
          <th class="date-time-picker-weekday" scope="col" abbr="Monday">Mo</th>
        </tr></thead>
        <tbody><tr>
          <th class="date-time-picker-week" scope="row">10</th>
          <td role="gridcell" aria-selected="true|false">
            <button class="date-time-picker-day" data-date="2026-03-01"
                    data-outside data-today data-selected data-disabled
                    tabindex="0|-1" aria-label="Sunday 1 March 2026"
                    aria-current="date" aria-disabled="true|absent">1</button>
          </td>
        </tr></tbody>
      </table>

      <div class="date-time-picker-time">
        <label class="date-time-picker-time-label" for="…">…</label>
        <select class="date-time-picker-hour">…</select>
        <select class="date-time-picker-minute">…</select>
        <select class="date-time-picker-meridiem">…</select>
      </div>

      <div class="date-time-picker-shortcuts">
        <button class="date-time-picker-shortcut" data-shortcut-id="today">…</button>
      </div>

      <div class="date-time-picker-footer">
        <button class="date-time-picker-clear">…</button>
        <button class="date-time-picker-cancel">…</button>
        <button class="date-time-picker-confirm">…</button>
      </div>
    </div>
  </div>
</date-time-picker>
```

This is the same markup shape as the Svelte spec's §4.3, with the outer
custom element itself as one further wrapping layer (matching
`share-picker`'s `<share-picker><div class="share-picker">…`), and with
`abbr`/`data-*`/ARIA semantics unchanged clause for clause. In
particular:

- The **hidden input** carries `name`; the visible text field
  deliberately has none, for the same reason as the Svelte original.
- **`data-*` on days** (`data-outside`, `data-today`, `data-selected`,
  `data-disabled`) is for consumer CSS; the ARIA equivalent
  (`aria-current`, `aria-selected` on the cell, `aria-disabled`) is what
  assistive technology reads.
- **Vetoed days are `aria-disabled`, never the `disabled` attribute.** A
  `disabled` button refuses focus, so arrowing across a blocked week
  goes silent for a screen reader while the visible focus stays behind —
  and the "exactly one tabbable day" invariant breaks the moment the
  cursor lands on one. `aria-disabled` keeps the day focusable and
  announced as unavailable; activation is refused in `#selectDay`. This
  is the ARIA APG guidance for composite-widget items.
- **The status region and the instructions paragraph render only when
  their label is supplied** (`labels.invalid`, `labels.instructions`) —
  the component never invents English. The status region is present but
  *empty* while the field is valid, because a live region born with its
  message is routinely not announced at all; while invalid, the field
  points at it via `aria-errormessage` and appends its id to
  `aria-describedby`, after the consumer's `described-by`.
- **`abbr` on weekday headers** carries the full weekday name.
- **The glyph** is U+1F4C5 CALENDAR + U+FE0E, exported as `CALENDAR`,
  `aria-hidden`, and rendered by the overridable `renderButtonContent()`
  hook (§4.6) — the custom-element equivalent of the Svelte `children`
  snippet, since light DOM has no `<slot>`.
- The package ships zero CSS, including dialog positioning.

### 4.5 Read-only getters and public methods

| Member | Notes |
| ------ | ----- |
| `open` (getter) | Is the dialog open? |
| `dialogId` (getter) | id of the rendered dialog. |
| `fieldId` (getter) | id of the rendered text field. |
| `openDialog()` | Open the dialog, seeding pending state from the committed value (§5.2). No-op while `disabled` or `readonly`. |
| `closeDialog(refocus = true)` | Close without committing. `value` is untouched. |
| `renderButtonContent()` | Overridable hook building the trigger's content. Default: the `CALENDAR` glyph, `aria-hidden`. |

### 4.6 `renderButtonContent()` — the custom-rendering hook

Light DOM has no `<slot>`, so subclassing stands in for the Svelte
`children` snippet, following `share-picker`'s `renderButtonContent()`
precedent exactly. Override it to replace the glyph; whatever it returns
is placed inside the trigger button. It re-runs on every
`#syncState()`, so a subclass reading `this.open` or `this.value` stays
current — the property that makes it behave like the reactive `children`
snippet the Svelte version exposes.

### 4.7 Re-exports

`index.ts` exports `DateTimePicker`, the civil-date helpers (`pad`,
`daysInMonth`, `formatIsoDate`, `parseIsoDate`, `toEpochDay`,
`fromEpochDay`, `addDays`, `addMonths`, `weekdayOf`, `isoWeek`,
`parseIsoTime`, `formatIsoTime`, `splitValue`, `joinValue`, `withinRange`,
`firstDayOfWeekFor`, `monthMatrix`, `monthNames`, `numericFieldOrder`,
`parseDateInput`, `parseTimeInput`, `nextDateTimePickerId`), the
`CALENDAR` constant, and every public type. Importing it registers
`<date-time-picker>`, idempotently.

The arithmetic is exported for the same reason as the Svelte original:
a consumer wiring `min`, `max`, `shortcuts`, or `isDateDisabled` is doing
date maths too, and the alternative is that they reach for a `Date` and
reintroduce the local-midnight bug §3 exists to prevent.

## 5. Behaviour

Everything in the Svelte spec's §5.1 (value shape), §5.4 (typed-input
parsing cascade, the `labels.invalid` announcement wiring, and the
field-`Escape` discard), §5.5 (range/veto/shortcut rules — vetoed days
are `aria-disabled` + `data-disabled`, focusable, refusing activation),
and §5.6 (locale resolution table) carries over verbatim — the parsing
and formatting functions are a line-for-line port, so re-read those
sections there rather than duplicating them here. What follows is the custom-element
idiom for opening/closing/committing (§5.2–§5.3, restated in terms of
attributes/properties/events) and the SSR/lifecycle/reactivity mechanics
this port had to add (§5.7–§5.8), which have no Svelte equivalent because
Svelte's reactivity does this automatically.

### 5.2 Opening

`openDialog()` samples today, seeds pending date/time from the committed
`value` (or the nearest selectable day to today / now snapped to
`minuteStep`), points the view at that month, opens, and moves focus to
the grid cursor — or, in `"time"` mode, to the first control in the
dialog. Calling it while `disabled` or `readonly` is a no-op. Activating
the trigger button toggles it: `openDialog()` when closed, `closeDialog()`
when open.

### 5.3 Committing and discarding

| Action | Effect |
| ------ | ------ |
| Click a day, `confirmOnSelect` true | Commit and close. |
| Click a day, `confirmOnSelect` false | Update the pending selection only. |
| Confirm button | Commit the pending selection and close. |
| Cancel button, or `closeDialog()` | Close. `value` untouched. |
| `Escape` | Close. `value` untouched. |
| Clear button (renders only when `labels.clear` is set) | Set `value` to `""`, fire `onChange` + `datetimechange`, close. |
| Click outside the dialog | Close without committing. This includes the component's own text field: the dialog claims `aria-modal="true"`, and a modal that stays open while the user edits behind it is telling assistive technology one thing and doing another. The trigger button is exempt because its own click handler toggles. |

Closing returns focus to whichever element opened the dialog — the
trigger button after a click, the **text field** after `Alt` + `Arrow
Down` — per the APG dialog pattern. Click-outside closes without moving
focus, since the user has already put it somewhere.

`onChange` / `datetimechange` fire only when the committed value actually
differs from the previous one — identical to the Svelte rule.

### 5.7 SSR and the custom-element lifecycle

No work happens before `connectedCallback()`: the constructor sets no DOM
and reads no attribute. On first connection the component samples
"today" once and seeds the initial view month/cursor from the current
`value` attribute (mirroring the Svelte original's synchronous
`initialAnchor` plus its mount-time `$effect` for "today", collapsed into
one step because a custom element has no separate SSR-render pass to
protect against a hydration mismatch — `connectedCallback` only ever
runs client-side). `nextDateTimePickerId()` mints ids from a module
counter, never `Math.random()`/`Date.now()`, matching the Svelte
original and this catalog's `nextSharePickerId()` / `nextThemePickerId()`
precedent.

After that first connection, the view month/cursor are **not**
resynchronised from `value` automatically — only `openDialog()` (and
navigation within an open dialog) touches them. This matches the Svelte
component precisely: there, `viewYear`/`viewMonth`/`cursor` are `$state`
seeded once and only ever change via explicit interaction, never via an
effect watching `value`. A `value` set from outside while the dialog is
closed updates the field display and the hidden input on the next
`#syncState()`, and the dialog will show the right month whenever it is
next opened, because `openDialog()` reseeds from the committed value
every time.

### 5.8 The `#render()` / `#syncState()` split

The load-bearing mechanism this port adds. There is no Svelte analogue —
Svelte's own reactivity does the equivalent job automatically — so this
section is the one part of the behaviour spec with no corresponding
Svelte section to defer to.

- **`#render()`** rebuilds the entire light-DOM subtree: the field, the
  trigger, the dialog, the header, the (fixed 42-cell) grid, the time
  selects, the shortcut buttons, and the footer. It **closes the dialog
  first** — a rebuild cannot preserve focus, so pretending otherwise
  would strand it on a detached node. It runs on connect, and on the
  five attributes documented as structural in §4.1's attribute table
  (`mode`, `show-week-numbers`, `hour12`, `locale`, `first-day-of-week`),
  plus assignment to the `labels` or `shortcuts` properties. Each of
  these either changes *which elements exist* (the grid vs. no grid,
  the meridiem select's presence, the week-number column, the clear
  button, the count of shortcut buttons) or invalidates content baked
  into elements at creation time in a way cheaper to recompute from
  scratch than to special-case (locale flips every weekday/month name
  and the clock convention at once).
- **`#syncState()`** writes attributes and text content onto elements
  `#render()` already created, and creates or destroys **nothing**. It
  runs for every other attribute (`label`, `value`, `min`, `max`,
  `minute-step`, `name`, `input-id`, `described-by`, `placeholder`,
  `disabled`, `readonly`, `required`, `class`), for the `isDateDisabled`
  and `formatValue` property setters, and — critically — after every
  internal interaction: opening, closing, paging the month, moving the
  roving-tabindex cursor, selecting a day, and changing the pending
  time. This is what keeps grid paging cheap: the same 42 `<button>`
  elements persist across a `PageDown`, only their `data-date`,
  `aria-label`, `data-outside`/`data-today`/`data-selected`/
  `data-disabled`, `tabindex`, and `aria-disabled` change.
- The text field's value is written defensively:
  `#syncState()` only assigns `field.value` when it actually differs
  from what is already there, because while the user is mid-edit the
  displayed text and the internal pending-typed-text state are always
  equal by construction, and reassigning an `<input>`'s `.value` to its
  own current value would still be visible to the user as a moved caret.

`parseInput`, `onChange`, `onShortcut`, and `onInvalidInput` trigger
neither: nothing rendered depends on them, and they are read only at
action time.

## 6. Accessibility

Identical contract to the Svelte spec's §6 — roles/properties table
(including the `aria-disabled` day cells, the `role="status"` invalid
region, and the instructions paragraph the dialog's `aria-describedby`
points at), keyboard contract (§6.2, ported verbatim to the grid's own
`keydown` listener and the dialog's own focus trap — the field's
`Escape` discard included), and internationalisation rule (§6.3: no
user-facing string is hardcoded, including AM/PM). The two focus rules
new to that contract are carried by port-local mechanics: closing
returns focus to the element that opened the dialog (a private opener
reference captured in `openDialog()`, falling back to the trigger), and
month/year paging refocuses the grid cursor only when
`document.activeElement` was already inside the grid table — header
prev/next buttons keep focus so they can be activated repeatedly. See [`docs/accessibility.md`](../docs/accessibility.md)
for the tradeoffs, restated for this port (they are the same four as the
Svelte original, plus the note that a structural prop change closes the
dialog — a cost `share-picker` does not have, because none of its
structural attributes can change while a list is open the way `locale`
can here).

## 7. Testing acceptance criteria

`date-time-picker.test.ts` asserts every clause below; each `test(...)`
title carries its clause number. The clause numbering and content match
the Svelte canonical's §7 exactly — the arithmetic, markup, commit,
keyboard, constraint, typed-input, time/datetime, locale, and
assistive-technology clauses (§7.1–§7.55), re-expressed against this
package's DOM and attribute surface instead of Svelte's component API. Beyond §7, the
suite also covers this catalog's idiom: attribute/property mirroring,
tri-state boolean resolution, `labels`/`shortcuts` being property-only
and returning defensive copies, the `#render()`/`#syncState()` split
preserving focus and dialog state across a non-structural change while
closing it on a structural one, `renderButtonContent()` overriding and
re-running on sync, the three paired `CustomEvent`s, the absence of any
persistence, listener cleanup on disconnect, and SSR import safety.

### Pure arithmetic (mirrors §3, §4.7)

| Clause | Test asserts |
| ------ | ------------ |
| §7.1 | `parseIsoDate` rejects impossible dates (`2026-02-31`) and accepts real ones. |
| §7.1 | `daysInMonth` handles leap years (2024-02 → 29, 2100-02 → 28). |
| §7.2 | `addDays` crosses month and year boundaries, forwards and backwards. |
| §7.2 | `addMonths` clamps rather than rolling over (2026-01-31 + 1 → 2026-02-28). |
| §7.2 | `addMonths` with a negative delta crosses the year boundary correctly. |
| §7.3 | `weekdayOf` returns 0 for Sunday. |
| §7.3 | `isoWeek` matches the ISO-8601 definition on the known-hard cases. |
| §7.4 | `toEpochDay` / `fromEpochDay` round-trip. |
| §7.5 | `splitValue` / `joinValue` round-trip per mode, and refuse a half datetime. |
| §7.6 | `monthMatrix` always returns 6 × 7 and starts on `firstDayOfWeek`. |
| §7.7 | `firstDayOfWeekFor` gives Monday for en-GB, Sunday for en-US, Monday for an unknown tag. |
| §7.8 | `parseDateInput` reads ISO, locale-ordered numerics (en-GB vs en-US differ), and written months. |
| §7.8 | `parseDateInput` returns null for junk and for impossible dates. |
| §7.9 | `parseTimeInput` reads `9:30`, `0930`, `9.30`, `1:30pm`, and rejects `25:00`. |

### Markup contract (mirrors §4.4)

| Clause | Test asserts |
| ------ | ------------ |
| §7.10 | Renders the trigger with `aria-haspopup="dialog"`, `aria-expanded="false"`, and `aria-controls` pointing at the `role="dialog"` element. |
| §7.10 | The glyph renders inside `.date-time-picker-icon` with `aria-hidden="true"`. |
| §7.11 | `aria-label` names **both** the trigger and the dialog. |
| §7.12 | The hidden input carries `name` and the ISO value; the visible field carries the formatted display. |
| §7.13 | The dialog is `hidden` until the trigger is activated. |
| §7.14 | The grid renders 6 rows × 7 day cells, with `data-outside` on adjacent-month days. |
| §7.15 | Exactly one day carries `tabindex="0"`. |
| §7.16 | The `class` attribute lands on the rendered root; `data-mode` reflects `mode`. |
| §7.17 | Today's cell carries `data-today` and `aria-current="date"`. |

### Selection and commit (mirrors §5.3)

| Clause | Test asserts |
| ------ | ------------ |
| §7.18 | Clicking a day in `"date"` mode commits, fires `onChange`, and closes. |
| §7.19 | With `confirm-on-select="false"`, clicking a day does **not** commit; Confirm does. |
| §7.20 | Cancel closes without changing `value`. |
| §7.21 | `Escape` closes without changing `value`. |
| §7.22 | The clear button renders only when `labels.clear` is set, and commits `""`. |
| §7.23 | `onChange` does not fire when the committed value is unchanged. |

### Keyboard (mirrors §6.2)

| Clause | Test asserts |
| ------ | ------------ |
| §7.24 | Arrow keys move the cursor by a day and by a week. |
| §7.25 | `Home` / `End` reach the ends of the week, respecting `firstDayOfWeek`. |
| §7.26 | `Page Up` / `Page Down` page the month; `Shift` pages the year. |
| §7.27 | `Enter` on the grid selects the cursor's day. |
| §7.28 | `Alt` + `Arrow Down` on the field opens the dialog. |

### Range, vetoes, shortcuts (mirrors §5.5)

| Clause | Test asserts |
| ------ | ------------ |
| §7.29 | Days outside `min`/`max` render `aria-disabled="true"` + `data-disabled` — never the `disabled` attribute. |
| §7.30 | `isDateDisabled` marks individual days `aria-disabled`. |
| §7.31 | Clicking a vetoed day does not commit. |
| §7.32 | A shortcut moves the pending selection and fires `onShortcut`. |
| §7.33 | A shortcut resolving to a blocked date does nothing. |

### Typed input (mirrors §5.4)

| Clause | Test asserts |
| ------ | ------------ |
| §7.34 | Typing an ISO date and blurring commits it. |
| §7.35 | Typing a locale-ordered numeric date commits the right day. |
| §7.36 | Unparseable text sets `aria-invalid` and fires `onInvalidInput` without changing `value`. |
| §7.37 | Text parsing to an out-of-range date is rejected the same way. |
| §7.38 | Clearing the field commits `""`. |
| §7.39 | A `parseInput` property overrides the built-in parser. |

### Time and datetime (mirrors §5.1)

| Clause | Test asserts |
| ------ | ------------ |
| §7.40 | `"time"` mode renders hour and minute selects and no grid. |
| §7.41 | `minuteStep` controls the minute options. |
| §7.42 | `"datetime"` mode renders both the grid and the time selects. |
| §7.43 | `"datetime"` does not commit a date with no time. |
| §7.44 | `hour12` renders a meridiem select whose labels come from the locale. |

### Locale (mirrors §5.6)

| Clause | Test asserts |
| ------ | ------------ |
| §7.45 | Weekday headings start on Monday for en-GB and Sunday for en-US. |
| §7.46 | `firstDayOfWeek` overrides the locale. |
| §7.47 | Month names and day `aria-label`s follow `locale`. |
| §7.48 | `showWeekNumbers` renders a week column with ISO week numbers. |

### Assistive technology (mirrors §4.4, §5.3, §5.4, §6)

| Clause | Test asserts |
| ------ | ------------ |
| §7.49 | The cursor lands on a vetoed day with real focus; the day is `aria-disabled`, still tabbable, refuses `Enter`, and the cursor can continue past it. |
| §7.50 | `Escape` in the field discards the pending edit, restores the committed display, clears `aria-invalid`, and commits nothing. |
| §7.51 | `labels.invalid` renders an empty `role="status"` region that fills on refusal, wired via `aria-errormessage` and appended to `aria-describedby`; absent without the label. |
| §7.52 | Closing returns focus to the field when opened by `Alt`+`Arrow Down`, and to the button when opened by click. |
| §7.53 | Paging from a header button keeps focus on that button while the cursor carries; paging from the grid moves focus with the cursor. |
| §7.54 | `labels.instructions` renders keyboard help, first in the dialog, referenced by the dialog's `aria-describedby`; absent without the label. |
| §7.55 | Clicking the text field while the dialog is open closes it without committing. |

## 8. DHCW feature parity

Unchanged from the Svelte canonical's §8 — see that table. Every row
applies to this port identically; nothing here is Svelte-specific.

## 9. Deliberate departures from DHCW

Unchanged from the Svelte canonical's §9 — see that table. All twelve
departures are carried by the ported arithmetic and DOM contract, not by
anything Svelte-specific.

## 10. Out-of-scope (future, not implemented here)

Same as the Svelte canonical's §10, plus:

- Ports to the other framework catalogs remaining after this one and
  Svelte: React, Vue, Angular, Blazor, Nunjucks/Eleventy. Svelte is
  canonical per `AGENTS/helpers.md`; each port records its own forced
  deviations the way this file records §4.1 and §4.3.

## 11. Tracking

- Package directory: `lily-design-system-html-helpers/lily-design-system-html-date-time-picker/`
- Spec version: 0.1.0
- Created: 2026-07-28
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or
  contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;

---

Lily™ and Lily Design System™ are trademarks.
