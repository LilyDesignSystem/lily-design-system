# DateTimePicker (Nunjucks) — Specification

Single source of truth for the `lily-design-system-nunjucks-date-time-picker`
helper. This file drives implementation, testing, and documentation:
anything not in this spec is out of scope; anything in this spec must be
exercised by a test.

The canonical helper is the Svelte one
([`../../../lily-design-system-svelte-helpers/lily-design-system-svelte-date-time-picker/spec/index.md`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-date-time-picker/spec/index.md)).
Per `AGENTS/helpers.md`, Svelte wins where the catalogs disagree; §3.4
below records every place this port could not follow it literally, and
why.

Sibling files:

- `date-time-picker.njk` — the macro (server-rendered static chrome)
- `date-time-picker.client.js` — the runtime (Intl-driven rendering +
  interaction, native sheet, clipboard)
- `date-time-picker.test.ts` — vitest spec exercising every clause in §7
- `index.md` — user-facing guide
- `docs/accessibility.md` — tradeoffs, stated plainly

---

## 1. Goal

Give a Nunjucks application a drop-in, headless control for collecting a
**date**, a **time**, or **both**, that:

1. Renders a text field plus an icon button that opens a WAI-ARIA APG
   **Date Picker Dialog**: a month grid with a full keyboard contract.
2. Is **locale-correct by construction** — month names, weekday names,
   first day of week, numeric field order, 12- vs 24-hour clock and
   day-period names all come from `Intl`, never from a baked-in table.
3. Accepts **typed input** as well as pointer and keyboard selection.
4. Constrains selection with `min`, `max`, and a disabled-date rule.
5. Ships zero CSS — the consumer styles every visual aspect via the
   `date-time-picker` class hooks.

This is the fifth helper in this catalog and the hardest port. The
other four are icon-button controls whose interior is either static
data (the three `*-select` helpers' option lists, `share-picker`'s
destination links) or absent until the client builds it for other
reasons. This one is different in kind: its interior — the calendar
grid, the weekday headers, the period heading, the hour/minute option
lists — **cannot be produced by a template at all**, because producing
it needs `Intl.DateTimeFormat` and civil-date arithmetic, neither of
which a Nunjucks macro has access to. §3.4 gives the full account.

## 2. Non-goals

Unchanged from the canonical helper:

- **Time zones.** The value is a civil date and/or wall-clock time with
  no zone attached.
- **Seconds, or sub-minute precision.**
- **Ranges.** A start/end pair belongs to `calendar-range-picker`.
- **Recurrence.**
- **Persistence.** Unlike the three preference helpers, this does not
  write to `localStorage`: a date in a form is *data*, not a
  preference.
- **Relative-date parsing** ("tomorrow", "next Friday").
- **Shipped positioning CSS** for the dialog. The package stays
  headless.

## 3. Architectural decisions

### 3.1 Inherited from the canonical helper

- **Civil dates, never local-midnight `Date`.** All arithmetic goes
  through UTC epoch days. See the canonical spec §3 for the full
  argument; it applies unchanged here.
- **ISO 8601 is the value contract.** `YYYY-MM-DD`, `HH:MM`, or
  `YYYY-MM-DDTHH:MM`.
- **Pending state is separate from the committed value.** Selection
  inside the dialog writes to internal pending state; only Confirm (or
  a day click in `confirmOnSelect` mode) commits. Cancel and Escape
  leave the committed value untouched.
- **A real focus trap.** `aria-modal="true"` is a promise the browser
  does not keep on its own.
- **Labels arrive as one object.** `labels` maps directly onto a
  translation bundle, same as the canonical helper.
- **Fixed six-row grid.**
- **No dependencies beyond the DOM.** `date-time-picker.client.js` uses
  only `Intl` and standard DOM APIs — no date library, no framework.

### 3.2 The macro / client.js split, and why it falls differently here

Every helper in this catalog splits into a macro (markup) and a
`client.js` (behaviour). For the first four helpers the split is a
convenience: the macro *could*, in principle, render every visible
character, and the client.js exists to wire *interaction* onto
otherwise-complete markup. `share-picker` is the strongest case of
this — its destination links are real, final, and useful with no
client at all (see its `docs/ssr.md`).

`date-time-picker` cannot work that way. Rendering the calendar
requires:

- Weekday names and their order, from `Intl.DateTimeFormat` +
  `Intl.Locale.prototype.getWeekInfo` (or a locale fallback table).
- The "March 2026" period heading, from `Intl.DateTimeFormat`.
- Every day cell's number, its month membership, its
  today/selected/disabled state, and its full-date `aria-label` — all
  a function of `Intl` plus the current date.
- The hour/minute/meridiem option lists, including whether the
  meridiem select should exist at all (a locale property) and what its
  two option labels say (also a locale property).

None of this is renderable ahead of time by a template that cannot call
Intl. So unlike the other four helpers, the macro here does not render
a complete-but-inert version of the interior — it renders **no
interior at all**: an empty `<thead><tr>`, an empty `<tbody>`, an empty
`<span>` for the period, and empty `<select>` elements for hour and
minute. `date-time-picker.client.js` builds all of it, every time the
view changes (open, month/year paging), the same way the canonical
Svelte component's reactive re-render does — except imperatively,
because there is no reactivity here to lean on.

What the macro *can* and does render directly, because it needs no
Intl and no per-day computation: the trigger button, the hidden input,
the header's four navigation buttons (their `aria-label`s are static
strings from `labels`), the hour/minute `<label>`s, every shortcut
button (plain data — see §3.4 point 4), and the clear/cancel/confirm
footer.

### 3.3 SSR / no-JS story

Consequently, this helper's markup is **not usably rendered without
JavaScript**, in the same way the three `*-select` helpers are not —
but for a stronger reason. Their listbox is inert because opening it is
a JS-only affordance; this control's *entire calendar interior* does
not exist server-side at all. Only the text field participates in a
plain form post (via the hidden input, carrying whatever `value` was
supplied), and the trigger button has no handler and the dialog stays
`hidden`. See `docs/accessibility.md` for the full account of what this
costs.

### 3.4 DEVIATIONS from the canonical Svelte props

The canonical helper has four props typed as functions, plus one prop
whose *rendering* depends on a runtime computation a macro cannot make.

**1. `isDateDisabled: (isoDate: string) => boolean`.** A macro cannot
evaluate a predicate, and — per §3.2 — the calendar it would gate is
not rendered by the macro at all, so there would be nothing to apply it
to even if it could. The macro instead accepts `disabledDates`, an
array of ISO date strings, emitted as a JSON `data-lily-*` attribute.
`date-time-picker.client.js` reads it as the **baseline** disabled set
— including on a root hydrated with `autoInit()` and no custom
JavaScript at all — and a real `isDateDisabled` function passed to
`initDateTimePicker` **replaces** that baseline (not unions with it)
for rules a finite list cannot express, e.g. "no weekends". A consumer
who needs both combines them into one function of their own; the
client does not attempt to merge a list and a predicate on the
consumer's behalf, since which behaviour that should mean is not
obvious enough to guess. See `date-time-picker.njk`'s header comment
for the same account at the point of use.

**2. `formatValue: (value: string) => string`** and **`parseInput:
(text: string) => string | null`.** Purely client-side concerns —
formatting and parsing both require running JavaScript, and the macro
does not attempt to format the field's initial value at all (see
point 3). No macro-side substitute is needed; both pass straight
through as `initDateTimePicker(root, {formatValue, parseInput})`
options, identical in shape and behaviour to the canonical props.

**3. `hour12: boolean`, locale-resolved when unset.** The canonical
helper resolves this from `locale` via `Intl` when the prop is absent.
A macro cannot call `Intl`, so it cannot decide whether the meridiem
control should exist — and per §3.2, it never renders that control at
all. `date-time-picker.client.js` resolves `hour12` (from the opt, the
`data-lily-date-time-picker-hour12` attribute, or the locale, in that
order) and creates the meridiem `<label>` + `<select>` itself, only
when the resolved clock turns out to be 12-hour. Its label comes from
`labels.meridiem`, forwarded as a `data-lily-date-time-picker-meridiem-label`
attribute since the element it names does not exist at render time.

**4. `onChange` / `onShortcut` / `onInvalidInput`.** All functions, all
client-only concerns with nothing to deviate — they pass straight
through as `initDateTimePicker` callback options.

**Not a deviation: `shortcuts`.** Each shortcut is plain data (`id`,
`label`, `days`/`months`/`date` — no functions), so unlike 1–3 there is
nothing here a macro cannot render. `date-time-picker.njk` renders each
shortcut as a real `<button>` up front, exactly like any other static
list — the same way `share-picker.njk` renders `targets` directly. A
consumer building a root purely in JavaScript may still pass
`shortcuts` to `initDateTimePicker`, which then **replaces** the
pre-rendered buttons (client wins), matching `share-picker`'s
function-`href`-on-the-client precedent.

**Also not a deviation: the initial field value.** The macro renders
`opts.value` **raw** (the ISO string, unformatted) into the text
field's `value` attribute, because formatting it locale-correctly
needs `Intl`. `date-time-picker.client.js` reformats it — via
`formatValue` if supplied, else `defaultFormatValue` — the moment
`initDateTimePicker` runs, with no visible flash in practice since
hydration happens before the user can focus the field. This mirrors
§5.7 of the canonical spec, adjusted for the fact that there is no
server/client *rendering* boundary to protect here, only a
macro/client-runtime one.

## 4. Public API

### 4.1 Macro parameters

`{% from "./date-time-picker.njk" import dateTimePicker %}` →
`{{ dateTimePicker(opts) }}`

| Key               | Type          | Required | Default                       | Purpose                                                             |
| ----------------- | ------------- | -------- | ------------------------------ | -------------------------------------------------------------------- |
| `label`           | string        | yes      | —                              | Accessible name for **both** the trigger button and the dialog.     |
| `labels`          | object        | yes      | —                              | Every other user-facing string. See §4.2.                          |
| `mode`            | `"date"｜"time"｜"datetime"` | no | `"date"`                | What to collect.                                                    |
| `value`           | string        | no       | `""`                           | ISO value, rendered **raw**. See §3.4.                              |
| `locale`          | string        | no       | —                              | BCP 47 tag. Forwarded as a data attribute; init opts win.           |
| `min` / `max`     | string        | no       | —                              | Inclusive ISO date bounds.                                          |
| `disabledDates`   | array         | no       | `[]`                           | ISO date strings. See the `isDateDisabled` deviation, §3.4.1.       |
| `firstDayOfWeek`  | number        | no       | from `locale`                  | 0 = Sunday … 6 = Saturday.                                          |
| `minuteStep`      | number        | no       | `1`                            | Granularity of the minute select.                                   |
| `hour12`          | boolean       | no       | resolved from `locale` (client)| See the `hour12` deviation, §3.4.3.                                 |
| `showWeekNumbers` | boolean       | no       | `false`                        | Render an ISO-8601 week column.                                     |
| `shortcuts`       | array         | no       | `[]`                           | `{id, label, days?, months?, date?}`. Rendered directly — see §3.4. |
| `confirmOnSelect` | boolean       | no       | `mode === "date"`              | Commit and close on day click.                                     |
| `name`            | string        | no       | `"date-time"`                  | `name` of the hidden input; also the id-derivation discriminator.  |
| `id`              | string        | no       | `date-time-picker-{name}`     | Id prefix. Supply an explicit id for two instances sharing a name.  |
| `inputId`         | string        | no       | `{id}-input`                   | `id` of the text field, for a consumer `<label for>`.               |
| `describedBy`     | string        | no       | —                              | Forwarded as `aria-describedby`.                                    |
| `placeholder`     | string        | no       | —                              | Placeholder for the text field.                                     |
| `disabled` / `readonly` / `required` | boolean | no | `false`               | Field state.                                                        |
| `classes`         | string        | no       | —                              | Extra CSS classes on the root.                                      |
| `attributes`      | object        | no       | —                              | Extra HTML attributes spread onto the root.                         |
| `{% call %}` body | —             | no       | the 📅 glyph                   | Replaces the glyph inside the button.                               |

Each entry in `shortcuts`:

| Key      | Type   | Required | Purpose                                                    |
| -------- | ------ | -------- | ------------------------------------------------------------ |
| `id`     | string | yes      | Passed back to `onShortcut`.                                |
| `label`  | string | yes      | Visible button text.                                        |
| `days`   | number | no       | Days from today. Mutually exclusive with `months` / `date`. |
| `months` | number | no       | Calendar months from today.                                  |
| `date`   | string | no       | An absolute ISO date.                                        |

### 4.2 `labels`

```
labels = {
  previousYear:  string  // required — names an always-rendered button
  previousMonth: string  // required
  nextMonth:     string  // required
  nextYear:      string  // required
  confirm:       string  // required
  cancel:        string  // required
  hour:          string  // required when mode includes a time
  minute:        string  // required when mode includes a time
  meridiem:      string  // required when the resolved clock is 12-hour
  week:          string  // required when showWeekNumbers
  clear:         string  // optional — the clear button renders only when supplied
}
```

Identical in shape and requiredness to the canonical helper's
`DateTimePickerLabels`. `meridiem`'s requirement is enforced later here
than in Svelte — the macro cannot know whether the clock is 12-hour
(§3.4.3), so the gate is applied on the client, at the point the
meridiem select is actually built.

### 4.3 DOM contract

What the macro renders (elements present with no JavaScript at all):

```html
<div class="date-time-picker {classes}" data-lily-date-time-picker-root
     data-mode="date" data-lily-date-time-picker-name="{name}" …>
  <input type="hidden" name="{name}" value="{value}" data-lily-date-time-picker-hidden-input>

  <div class="date-time-picker-field">
    <input class="date-time-picker-input" id="{fieldId}" type="text"
           autocomplete="off" value="{value}" data-lily-date-time-picker-input>
    <button type="button" class="date-time-picker-button" aria-label="{label}"
            aria-haspopup="dialog" aria-expanded="false"
            aria-controls="{dialogId}" data-lily-date-time-picker-button>
      <span class="date-time-picker-icon" aria-hidden="true">&#128197;&#65038;</span>
    </button>
  </div>

  <div class="date-time-picker-dialog" id="{dialogId}" role="dialog"
       aria-modal="true" aria-label="{label}" tabindex="-1" hidden
       data-lily-date-time-picker-dialog>
    <div class="date-time-picker-header"> <!-- date modes only -->
      <button class="date-time-picker-previous-year"  aria-label="…" data-lily-date-time-picker-previous-year>…</button>
      <button class="date-time-picker-previous-month" aria-label="…" data-lily-date-time-picker-previous-month>…</button>
      <span   class="date-time-picker-period" id="{periodId}" aria-live="polite"
              data-lily-date-time-picker-period><!-- filled by client.js --></span>
      <button class="date-time-picker-next-month"     aria-label="…" data-lily-date-time-picker-next-month>…</button>
      <button class="date-time-picker-next-year"      aria-label="…" data-lily-date-time-picker-next-year>…</button>
    </div>
    <table class="date-time-picker-calendar" role="grid" aria-labelledby="{periodId}"
           data-lily-date-time-picker-calendar>
      <thead><tr data-lily-date-time-picker-weekdays>
        <th class="date-time-picker-week-heading" scope="col" abbr="…">…</th> <!-- showWeekNumbers only -->
        <!-- weekday <th>s: filled by client.js -->
      </tr></thead>
      <tbody data-lily-date-time-picker-grid><!-- day rows: filled by client.js --></tbody>
    </table>

    <div class="date-time-picker-time" data-lily-date-time-picker-time> <!-- time modes only -->
      <label class="date-time-picker-time-label" for="{hourId}">…</label>
      <select class="date-time-picker-hour" id="{hourId}" data-lily-date-time-picker-hour></select>
      <label class="date-time-picker-time-label" for="{minuteId}">…</label>
      <select class="date-time-picker-minute" id="{minuteId}" data-lily-date-time-picker-minute></select>
      <!-- meridiem label+select: created by client.js, hour12 only -->
    </div>

    <div class="date-time-picker-shortcuts" data-lily-date-time-picker-shortcuts>
      <button class="date-time-picker-shortcut" data-shortcut-id="…" data-days="…">…</button>
    </div>

    <div class="date-time-picker-footer">
      <button class="date-time-picker-clear">…</button>   <!-- labels.clear only -->
      <button class="date-time-picker-cancel">…</button>
      <button class="date-time-picker-confirm">…</button>
    </div>
  </div>
</div>
```

What `date-time-picker.client.js` additionally builds, every time the
view changes: the weekday `<th>` row, every `<tbody>` row's day
`<button>`s (with `data-date`, `data-outside`, `data-today`,
`data-selected`, `aria-label`, `aria-current`, `disabled`,
`tabindex`), the period heading's text, the hour/minute `<option>`
lists, and — when the resolved clock is 12-hour — the meridiem
`<label>` + `<select>` themselves.

CSS class hooks are otherwise identical to the canonical helper's
`date-time-picker-*` names; a consumer's CSS written against the
Svelte version's markup applies unchanged here once the client has run.

### 4.4 `date-time-picker.client.js` exports

Civil-date arithmetic: `pad`, `daysInMonth`, `formatIsoDate`,
`parseIsoDate`, `toEpochDay`, `fromEpochDay`, `addDays`, `addMonths`,
`weekdayOf`, `isoWeek`, `parseIsoTime`, `formatIsoTime`, `splitValue`,
`joinValue`, `withinRange`, `firstDayOfWeekFor`, `monthMatrix`,
`monthNames`, `numericFieldOrder`, `parseDateInput`, `parseTimeInput`.

Locale-driven formatting: `localeUsesHour12`, `dayPeriodName`,
`dayLabel`, `defaultFormatValue`.

Lifecycle: `initDateTimePicker(root, opts?)`, `autoInit(opts?)`,
`nextDateTimePickerId`, the `CALENDAR` glyph constant.

`initDateTimePicker` opts: `label`, `labels`, `locale`, `min`, `max`,
`isDateDisabled`, `firstDayOfWeek`, `minuteStep`, `hour12`,
`showWeekNumbers`, `shortcuts`, `confirmOnSelect`, `formatValue`,
`parseInput`, `onChange`, `onShortcut`, `onInvalidInput`. Init opts win
over the rendered `data-lily-*` attributes. Returns `{open, close,
commit, clear, getValue, destroy}`.

The arithmetic is exported for the same reason the canonical helper
exports it: a consumer wiring `min`, `max`, `shortcuts` or
`isDateDisabled` is doing date maths too, and the alternative is that
they reach for a `Date` and reintroduce the local-midnight bug §3.1
exists to prevent.

## 5. Behaviour

Unchanged from the canonical helper's §5, except where a clause
references a prop shape §3.4 alters. In particular:

### 5.1 Value

`value` is ISO and mode-shaped, exactly as canonical. An incomplete
`"datetime"` is never committed.

### 5.2 Opening

Identical to canonical: on open the control samples today, seeds
pending date/time from the committed value (or the nearest selectable
day / now snapped to `minuteStep`), points the view at that month, and
moves focus to the grid cursor — or, in `"time"` mode, to the first
control in the dialog. Because the grid did not exist before this
moment (§3.2), "pointing the view at that month" here means *building*
the grid for that month, not merely scrolling to it.

### 5.3 Committing and discarding

Identical table to canonical (Confirm / Cancel / Escape / Clear /
click-outside).

### 5.4 Typed input

Identical parse cascade to canonical: `parseInput` override, then ISO,
then locale-ordered numerics, then written months. Unchanged behaviour
for unparseable or out-of-range text (marked invalid, never silently
snapped).

### 5.5 Range and vetoes

`min` / `max` are inclusive, as canonical. Where canonical says
"vetoed by `isDateDisabled`", read "vetoed by the effective disabled
rule" here — the client-supplied `isDateDisabled` function when given,
else the macro's `disabledDates` list. See §3.4.1.

### 5.6 Locale resolution

Identical table to canonical (`Intl.DateTimeFormat` for names,
`getWeekInfo` + region table for first day of week, `formatToParts`
for numeric field order and the 12/24-hour clock, the `dayPeriod` part
for AM/PM names). Every one of these is overridable, exactly as
canonical — via an `initDateTimePicker` opt rather than a component
prop.

### 5.7 SSR / hydration

There is no server/client *rendering* boundary in the canonical sense —
Nunjucks output is HTML text, not a component tree a client
hydrates against. The analogous boundary here is macro-render-time vs.
`initDateTimePicker`-run-time, and §3.2/§3.3 describe it in full: the
macro renders the fixed chrome and a raw, unformatted field value; the
first call to `initDateTimePicker` builds everything Intl-dependent —
weekday header, grid (seeded from `value`, not "today", if present),
time options, and reformats the field — synchronously, before any user
interaction is possible.

## 6. Accessibility

### 6.1 Roles and properties

Identical table to the canonical helper's §6.1 — every ARIA
role/property named there is produced here too, whichever side (macro
or client) produces the element it is on.

### 6.2 Keyboard contract

Identical to canonical §6.2 in full: field `Enter` / `Alt+ArrowDown`;
grid arrows / Home / End / PageUp / PageDown / Shift+PageUp / Shift+PageDown
/ Enter / Space; dialog `Escape` / `Tab` focus trap; roving `tabindex`
on the grid.

### 6.3 Internationalisation

Identical to canonical: every string in `label` and `labels` passes
through verbatim, with no English default anywhere gating optional UI.

### 6.4 Accessibility tradeoffs

Stated plainly in [`../docs/accessibility.md`](../docs/accessibility.md),
which also carries the one tradeoff that is new to this port: **no
usable no-JS path**, discussed in §3.3 above.

## 7. Testing acceptance criteria

`date-time-picker.test.ts` asserts every clause below, mapped 1:1 onto
the canonical Svelte spec's §7.1–§7.48 (adjusted for the macro/client
split where a clause references markup that only exists after
`initDateTimePicker` runs), plus a final group of Nunjucks-specific
clauses.

### Pure arithmetic (mirrors §3, §4.4)

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
| §7.8 | `parseDateInput` reads ISO, locale-ordered numerics, and written months. |
| §7.8 | `parseDateInput` returns null for junk and for impossible dates. |
| §7.9 | `parseTimeInput` reads `9:30`, `0930`, `9.30`, `1:30pm`, and rejects `25:00`. |

### Markup contract (mirrors §4.3)

| Clause | Test asserts |
| ------ | ------------ |
| §7.10 | Renders the trigger with `aria-haspopup="dialog"`, `aria-expanded="false"`, and `aria-controls` pointing at the `role="dialog"` element — macro output alone. |
| §7.10 | The glyph renders inside `.date-time-picker-icon` with `aria-hidden="true"` — macro output alone. |
| §7.11 | `aria-label` names **both** the trigger and the dialog. |
| §7.12 | The hidden input carries `name` and the ISO value; the visible field carries the **raw** value pre-hydration and the **formatted** value after `initDateTimePicker` runs. |
| §7.13 | The dialog is `hidden` until the trigger is activated. |
| §7.14 | The grid renders 6 rows × 7 day cells, with `data-outside` on adjacent-month days, after hydration. |
| §7.15 | Exactly one day carries `tabindex="0"`. |
| §7.16 | Extra attributes spread onto the root; `data-mode` reflects `mode` — macro output alone. |
| §7.17 | A `{% call %}` body replaces the glyph — macro output alone. |

### Selection and commit (mirrors §5.3)

| Clause | Test asserts |
| ------ | ------------ |
| §7.18 | Clicking a day in `"date"` mode commits, fires `onChange`, and closes. |
| §7.19 | With `confirmOnSelect: false`, clicking a day does **not** commit; Confirm does. |
| §7.20 | Cancel closes without changing the value. |
| §7.21 | `Escape` closes without changing the value. |
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
| §7.29 | Days outside `min`/`max` render `disabled`. |
| §7.30 | `disabledDates` (the `isDateDisabled` macro substitute, §3.4.1) disables individual days. |
| §7.30 | A real `isDateDisabled` function at init time **replaces** the `disabledDates` baseline. |
| §7.31 | Clicking a disabled day does not commit. |
| §7.32 | A shortcut moves the pending selection and fires `onShortcut`. |
| §7.33 | A shortcut resolving to a blocked date does nothing. |

### Typed input (mirrors §5.4)

| Clause | Test asserts |
| ------ | ------------ |
| §7.34 | Typing an ISO date and blurring commits it. |
| §7.35 | Typing a locale-ordered numeric date commits the right day. |
| §7.36 | Unparseable text sets `aria-invalid` and fires `onInvalidInput` without changing the value. |
| §7.37 | Text parsing to an out-of-range date is rejected the same way. |
| §7.38 | Clearing the field commits `""`. |
| §7.39 | A `parseInput` opt overrides the built-in parser. |

### Time and datetime (mirrors §5.1)

| Clause | Test asserts |
| ------ | ------------ |
| §7.40 | `"time"` mode renders hour and minute selects and no grid. |
| §7.41 | `minuteStep` controls the minute options. |
| §7.42 | `"datetime"` mode renders both the grid and the time selects. |
| §7.43 | `joinValue` (and therefore commit) refuses a date with no time, or a time with no date. |
| §7.44 | `hour12` renders a meridiem select whose labels come from the locale. |

### Locale (mirrors §5.6)

| Clause | Test asserts |
| ------ | ------------ |
| §7.45 | Weekday headings start on Monday for en-GB and Sunday for en-US. |
| §7.46 | `firstDayOfWeek` overrides the locale. |
| §7.47 | Month names and day `aria-label`s follow `locale`. |
| §7.48 | `showWeekNumbers` renders a week column with ISO week numbers. |

### Nunjucks-specific surface

| Test asserts |
| ------------ |
| Ids are deterministic, derived from `name` / `id`, and identical across repeated renders (no counters, no randomness in the macro). |
| Classes and attributes land on the root. |
| The macro is pure: renders no Intl-dependent content, touches no ambient document/storage state, and persists nothing. |
| Shortcuts are rendered as real buttons by the macro with no function involved. |
| `initDateTimePicker`'s `shortcuts` opt rebuilds the shortcuts container, taking over from the macro-rendered buttons. |
| `nextDateTimePickerId` mints stable, incrementing, SSR-safe ids for a JS-built root. |
| `autoInit` wires every root on the page. |
| `initDateTimePicker` is inert on a missing or foreign root. |
| The focus trap cycles `Tab` within the dialog. |
| Clicking outside the root closes the dialog without committing. |
| `defaultFormatValue` and `dayLabel` are exported for a consumer composing their own `formatValue`. |
| The `CALENDAR` glyph constant is a unicode escape, never a bare character in source. |

## 8. Tracking

- Package directory: `lily-design-system-nunjucks-helpers/lily-design-system-nunjucks-date-time-picker/`
- Spec version: 0.1.0
- Created: 2026-07-28
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or
  contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;

---

Lily™ and Lily Design System™ are trademarks.
