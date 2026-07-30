# Accessibility — `<date-time-picker>` (HTML helper)

What this control does, what it costs, and when you should not use it.
Contract in [`../spec/index.md` §6](../spec/index.md#6-accessibility).

## The honest headline

**`<input type="date">` is more accessible than this component**, and for
many services it is the right answer. It is a native control: screen
readers have bespoke support for it, it gets the platform's own picker
(including the mobile date wheel), it needs no CSS, and it cannot break.

Use this component when you need something the native control genuinely
cannot do:

- disable individual dates (`isDateDisabled`) — closed clinics, booked
  slots, bank holidays;
- quick-pick shortcuts;
- ISO week numbers;
- a locale that differs from the user's OS setting — the native picker
  always follows the OS, which is wrong for a bilingual service where
  the user has chosen Welsh in your app but runs an English phone;
- one consistent appearance across browsers, when that is a real
  requirement and not a preference.

If none of those apply, use the native control.

## And for memorable dates, use neither

For a date of birth, use three separate text inputs (day, month, year) —
the pattern NHS and GOV.UK both settled on. Nobody wants to page a
calendar grid back forty years, and a calendar implies "choose a date"
when the question is "tell us a date you already know".

## What this control does

- **WAI-ARIA APG Date Picker Dialog** roles throughout: `role="dialog"`
  with `aria-modal`, `role="grid"`, `role="gridcell"` with
  `aria-selected`, roving `tabindex`, `aria-current="date"` on today.
- **A real focus trap.** `aria-modal="true"` tells assistive technology
  that everything outside the dialog is inert. The browser does not
  enforce that, so the dialog's own `keydown` handler does. DHCW's
  picker declares `aria-modal` and traps nothing — which is worse than
  not declaring it, because the user is told the page is inert while Tab
  walks straight into it.
- **Every day cell has a full accessible name.** "Sunday 15 March 2026",
  from `Intl`, not "15".
- **Weekday columns announce in full.** `abbr="Monday"` on a header that
  reads "Mo".
- **The month heading is a polite live region.** Paging months announces
  the new month without interrupting.
- **The cursor never gets lost.** Paging carries the roving tabindex
  into the new month, clamped to a real day. Without that, focus falls
  to `<body>` and a keyboard user has to start again.
- **Typed entry always works.** The calendar is never the only route in.
  This matters most for screen-reader and switch users, for whom a grid
  is 42 stops and a text field is one.
- **No colour-only meaning.** Today, selected, outside-month, and
  disabled are each carried by an ARIA property (`aria-current`,
  `aria-selected`, `aria-disabled`) as well as by a `data-*` hook for
  your CSS.
- **Vetoed days stay focusable and announce as unavailable.** They carry
  `aria-disabled="true"` plus `data-disabled`, never the `disabled`
  attribute — a `disabled` button refuses focus, so arrowing the roving
  cursor across a blocked week would go silent for a screen reader while
  the visible focus stayed behind. Activation is refused in the select
  handler instead. Style them with `[data-disabled]`; a `:disabled`
  selector will not match.
- **Refused input can be announced, not just marked.** Supply
  `labels.invalid` and a `role="status"` live region — present in the
  DOM but empty while the field is valid — fills with your message when
  typed text is rejected, wired to the field via `aria-errormessage` and
  appended to `aria-describedby`. Without the label the component stays
  silent rather than inventing English, so supply it.
- **The dialog can explain its own keyboard.** Supply
  `labels.instructions` and the dialog renders it first and points
  `aria-describedby` at it, so a screen reader speaks it once on open —
  the affordance the APG date-picker example ships.
- **Closing returns focus to the element that opened the dialog.** The
  trigger button after a click, the text field after `Alt`+`↓` — per the
  APG dialog rule. Click-outside closes without moving focus, since the
  user has already put it somewhere.
- **Header paging never steals focus.** Activating "next month" leaves
  focus on "next month", so it can be pressed repeatedly; only grid
  `Page Up`/`Page Down` carries focus with the cursor, because the cell
  it sat on is no longer rendered.
- **Focus is never destroyed by an internal state change.** Opening,
  closing, paging the month, and selecting a day all update the same
  persistent DOM nodes in place (the `#render()` / `#syncState()` split
  — see `spec/index.md` §5.8), so the roving-tabindex cell you are
  focused on is never replaced out from under you mid-interaction.

## The costs, stated plainly

### 1. A hand-rolled grid has weaker support than a native control

Every assistive technology handles `role="grid"` slightly differently,
and some handle a 42-cell grid inside a dialog badly. This follows the
APG, which is the best available guidance, but "follows the APG" is not
the same as "works as well as the native control". Test with the screen
readers your users actually use.

### 2. The trigger is icon-only

Its entire accessible name is your `label` attribute. If you pass
something vague, a screen-reader user gets something vague. Name the
field, not the widget: "Choose an appointment date", not "Calendar".

### 3. The glyph is a font-dependent character

📅 U+1F4C5 is not a bundled asset — it is a character, and it renders in
whatever font resolves it. The U+FE0E variation selector requests a
monochrome form and several platforms ignore it. If your brand needs a
specific mark, override `renderButtonContent()` (a subclass method,
since light DOM has no `<slot>`) with your own SVG.

The glyph is `aria-hidden`, so it is never the accessible name.

### 4. Date entry is hard, full stop

WCAG has no success criterion for this, but users with cognitive
disabilities, users with dyscalculia, and users under stress all find
date entry difficult regardless of the widget. Mitigations that actually
help:

- supply `shortcuts` for the common answers;
- set `placeholder` to a real example in your format;
- use `described-by` to point at a hint that shows the format;
- keep `min`/`max` tight so wrong answers are impossible rather than
  merely discouraged;
- never make the calendar the only route — the text field is there for
  a reason.

### 5. You own the visible focus indicator

The package ships no CSS, so it ships no focus ring. WCAG 2.4.7 is your
responsibility. Every one of these needs a visible focus style:
`.date-time-picker-input`, `.date-time-picker-button`, the four nav
buttons, `.date-time-picker-day`, the time `<select>`s, the shortcuts,
and the three footer buttons.

The day grid is the one people forget. A roving tabindex means only one
day is focusable, and if that day has no focus ring the keyboard user
has no idea where they are in the calendar at all.

### 6. Target size

WCAG 2.5.8 (AA) asks for 24 × 24 CSS pixels; 2.5.5 (AAA) asks for
44 × 44. A 7-column grid of 44px targets is 308px wide before padding,
wider than a 320px viewport allows once you add dialog chrome. If you
are targeting AAA — as Lily is — let the dialog go full-width on small
screens. That is a CSS decision, and it is yours.

### 7. A structural attribute change closes the dialog

`mode`, `show-week-numbers`, `hour12`, `locale`, and `first-day-of-week`
each rebuild the dialog's DOM (`spec/index.md` §5.8), and a rebuild
cannot preserve focus, so it closes first. This is a cost the Svelte
original does not pay — its reactivity patches these values in place —
and one `share-picker` does not have, because none of its structural
attributes can plausibly change while its list is open the way `locale`
can here. Avoid changing these five while a user might have the dialog
open; they are meant to be set once at setup, not toggled live.

## Testing checklist

- [ ] Tab to the field, type a date, press Enter. Value commits.
- [ ] Type junk, press Enter, then `Escape`. The committed value comes
      back and the invalid state clears — nothing was committed.
- [ ] `Alt` + `↓` opens the dialog; focus lands on a day.
- [ ] Arrow around the grid. Focus is always visible — including on a
      blocked day, which announces as unavailable and refuses Enter.
- [ ] `Page Down` past the end of the month. Focus follows.
- [ ] Click "next month" twice. Focus stays on "next month" both times.
- [ ] `Tab` repeatedly inside the dialog. Focus never leaves it.
- [ ] `Escape` closes and returns focus to whatever opened the dialog —
      the field after `Alt` + `↓`, the button after a click; the value
      is unchanged.
- [ ] With a screen reader: the day cell announces the full date, the
      month heading announces on page, blocked days announce as
      unavailable, a refused typed date announces `labels.invalid`, and
      the dialog speaks `labels.instructions` once on open.
- [ ] At 200% zoom and at 320px width, the dialog is usable.
- [ ] In forced-colours mode, selected and today are still
      distinguishable.

---

Lily™ and Lily Design System™ are trademarks.
