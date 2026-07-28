# Accessibility

The control targets WCAG 2.2 AAA and follows the WAI-ARIA APG **Date
Picker Dialog** pattern. This page states the costs of that design
plainly. Several are new to this port, and none of them are fixed by
the helper.

## No usable path without JavaScript

This is the honest headline, and it is worse than every other helper in
this catalog.

`share-picker`'s destination links are real `<a href>` elements with
final URLs, so they navigate with no JavaScript at all — only the
*disclosure* is lost. The three `*-select` helpers at least paint a
correct, server-resolved value and carry it in a hidden input on form
submit, even though the value cannot be *changed* without JS.

`date-time-picker` has neither consolation. Its calendar grid, weekday
headers, period heading, and hour/minute option lists genuinely do not
exist in the server-rendered markup — not "hidden", not "present but
unusable", simply absent, because producing any of it needs
`Intl.DateTimeFormat` and civil-date arithmetic that a Nunjucks
template cannot perform (`spec/index.md` §3.2). With no client script:

- The trigger button has no click handler. It does nothing.
- The dialog stays `hidden` forever.
- The text field is a plain, unconstrained `<input type="text">`. It
  accepts anything and validates nothing.
- The hidden input still carries whatever `value` the server resolved,
  so a form that is never touched still posts a sensible default — but
  a user who wants to *change* the date has no way to.

If a hard no-JS requirement applies to your service, this control is
the wrong tool for that page. Reach for a native `<input type="date">`
/ `<input type="time">` instead — it has no dialog to fail to render,
works with assistive technology out of the box, and this package's own
`parseDateInput` / `formatIsoDate` exports are still useful for
validating whatever it posts server-side.

## The accessible name rests entirely on `aria-label`

The trigger button's only visible content is the 📅 glyph, which is
`aria-hidden="true"`. `opts.label` is therefore the button's **only**
accessible name, and it also names the dialog. Make it describe what
it collects — "Appointment date", not "Pick a date" — the same rule
`share-picker` states for its own trigger.

## The glyph is font-dependent

📅 U+1F4C5 CALENDAR, with U+FE0E requesting text (monochrome)
presentation. Where the variation selector is honoured it inherits the
page's font and colour; several platforms ignore it and render the
full-colour emoji regardless, and a font missing the codepoint entirely
renders tofu. Override it with a `{% call %}` block if your font stack
is narrow.

## A hand-rolled grid has weaker assistive-technology support than the native controls

`<input type="date">` and `<input type="time">` have years of
per-platform accessibility engineering behind them that a bespoke
`role="grid"` cannot match on day one. This control exists because
`<input type="date">` cannot be styled, cannot take `min`/`max`-driven
per-day vetoes with a custom message, cannot show shortcut buttons, and
renders differently — sometimes very differently — per browser. That
trade is usually right for a booking or scheduling flow that needs a
consistent, brandable UI; it is not free, and the native controls
remain the right default for many simpler forms.

## Date entry is hard regardless of implementation

Typing a date correctly is a genuine cognitive load for many users
regardless of how good the calendar is. The typed field exists
specifically so the calendar dialog is never the *only* route to a
value — but a hard date is still hard. Where the domain allows it,
`shortcuts` ("Today", "Next available", "+2 weeks") reduce the load
more than any amount of dialog polish.

## `min` / `max` / disabled dates need an honest message, not just a disabled button

A `<button disabled>` day tells a sighted mouse user "not selectable"
but tells almost nothing else. There is no `aria-describedby` on
individual day cells to explain *why* a date is blocked (booked?
holiday? past?) — only the full-date `aria-label` and the disabled
state itself. If the reason matters to your users, say it near the
field via `describedBy`, or in the label copy itself.

## The focus trap and roving tabindex, done for real

Unlike a component library that ships `aria-modal="true"` and calls it
done, this control implements the trap itself (`spec/index.md` §6.2):
`Tab` cannot walk out of the open dialog, `Escape` always returns focus
to the trigger, and exactly one day in the grid is ever `tabindex="0"`
— paging months carries that cursor with it rather than dropping focus
to `<body>` when the previously-focused cell stops existing.

## Keyboard

Identical to the canonical Svelte helper's contract — see
`spec/index.md` §6.2 for the full table (field `Enter` /
`Alt+ArrowDown`; grid arrows / `Home` / `End` / `PageUp` / `PageDown` /
`Shift+PageUp` / `Shift+PageDown` / `Enter` / `Space`; dialog `Escape` /
`Tab`).

## What consumer CSS still owes

The package ships no CSS, so these remain yours:

- **Visible focus** on the field, the trigger, every dialog button, and
  every day cell (WCAG 2.4.7 / 2.4.11 at AAA).
- **Target size** of at least 44×44 CSS pixels for every button and day
  cell (WCAG 2.5.5 at AAA) — a calendar grid is an easy place to render
  targets too small.
- **Contrast** of at least 7:1 for text and icons against their
  backgrounds (WCAG 1.4.6 at AAA), including the disabled state, which
  still needs to be legible even though it communicates "not
  selectable".
- **Positioning** for the dialog. The package is headless: with no CSS
  at all it renders in normal document flow, not as an overlay.
- **`prefers-reduced-motion`** if you animate the dialog open/close or
  month transitions. The helper animates nothing.

## Testing checklist

- Keyboard only: open, page months and years, arrow around the grid,
  select a day, type a date directly, `Escape` back to the trigger,
  `Tab` past it.
- Screen reader (VoiceOver / NVDA): confirm the trigger's and dialog's
  name is your `label`, the period heading announces on paging
  (`aria-live="polite"`), each day announces its full date, and typed
  invalid text is announced via `aria-invalid`.
- Force a locale change (`en-GB` vs `en-US` vs a right-to-left locale)
  and confirm month names, weekday order, and numeric parsing all
  follow it.
- Confirm the no-JS behaviour matches this page's description exactly:
  the field posts a sensible default and nothing else works.

---

Lily™ and Lily Design System™ are trademarks.
