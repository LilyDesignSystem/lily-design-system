# Accessibility

WCAG 2.2 AAA is the target, following the **WAI-ARIA APG Date Picker
Dialog** pattern. This document states what the control does well and
what it costs — the costs are real and are not talked around.

## What it does

- The trigger's and dialog's accessible name both come from the
  consumer-supplied `Label`, so they localise with your copy.
- `aria-haspopup="dialog"` / `aria-expanded` / `aria-controls` on the
  trigger; `role="dialog"` / `aria-modal="true"` / `aria-label` on the
  dialog; `role="grid"` / `aria-labelledby` on the calendar table,
  pointing at the `aria-live="polite"` month/year heading.
- Weekday column headers carry `abbr` with the FULL weekday name, so a
  screen reader announcing the column says "Monday" where the eye reads
  "Mo".
- Each day button's `aria-label` is the full date ("Sunday 1 March 2026"),
  `aria-current="date"` marks today, and the gridcell's `aria-selected`
  tracks the pending selection.
- A genuine **focus trap**. `aria-modal="true"` is a promise the browser
  does not enforce on its own; an untrapped dialog tells a screen reader
  the rest of the page is inert while Tab quietly walks into it anyway.
  This control installs a real Tab-handling listener — see the Blazor
  notes below for why that had to be JavaScript rather than a Razor
  `@onkeydown` attribute.
- A roving `tabindex`: exactly one day is tabbable, and paging the month
  carries the cursor with it (clamped to the shorter month), so focus
  never drops onto an unrendered cell.
- Typed text is never silently corrected. Unparseable or out-of-range
  input is marked `aria-invalid="true"` and left exactly as typed, so a
  screen reader user gets a clear, honest state rather than a value that
  quietly changed underneath them.
- No user-facing string is hardcoded — including AM/PM, which comes from
  `DateTimeFormatInfo.AMDesignator` / `PMDesignator` for the resolved
  locale, not an English default.

## What it costs

**A hand-rolled grid has weaker assistive-technology support than
`<input type="date">`.** The native control is well-tested across screen
readers and gets platform-level date-entry affordances (a numeric
keypad on mobile, OS-level date pickers) for free. This control exists
because `<input type="date">` cannot be constrained the way clinical and
administrative bookings need to be (locale-correct display independent of
the OS locale, `IsDateDisabled`, shortcuts, week numbers) — but the
tradeoff is real, and `<input type="date">` remains the right default for
many simpler services.

**The trigger is icon-only.** Its accessible name rests entirely on
`Label`. If `Label` is wrong, missing, or untranslated, sighted and
non-sighted users alike have nothing else to go on, since 📅 is not
self-evidently "pick a date" without one.

**The glyph is font-dependent.** 📅 (U+1F4C5) with the text-presentation
selector (U+FE0E) is still a pictograph rather than an in-font glyph like
`SharePicker`'s ➤ or `ThemePicker`'s ◑; several platforms honour the
selector and render it monochrome, some do not and show the full-colour
emoji instead. Override it with `ChildContent` if your font stack does
not render it acceptably.

**Date entry is hard for users with cognitive disabilities, regardless of
implementation.** The typed field exists partly so the calendar grid is
never the only route to a value — but no date-entry UI, native or
custom, is effortless for every user. Consider whether your form actually
needs an exact date, or whether a coarser input (a month, a relative
range) would serve better.

## Blazor-specific notes

**The Tab focus trap is genuine JavaScript, not a Razor `@onkeydown`
handler.** Whether Tab's default action should be prevented depends on
`document.activeElement` at the instant of the keypress — knowable only
synchronously in the browser. Blazor's `@onkeydown:preventDefault`
directive is a static, per-render declaration; it cannot vary per key or
per condition, and applying it unconditionally to every keydown reaching
the dialog would also block ordinary mid-dialog Tab progression. The trap
is therefore one small `IJSRuntime`-installed keydown listener attached
directly to the dialog element (idempotent, guarded by a marker property),
which redirects focus only at the two edges and needs no callback into
.NET — every other Tab keeps its native action, exactly like the
canonical Svelte implementation's own `onDialogKeydown`.

**Grid-navigation keys are not `preventDefault`ed.** For the same reason
as the Tab trap — Blazor cannot conditionally prevent default per key from
a declarative attribute — arrow keys, `Home`/`End`, and `PageUp`/`PageDown`
may also scroll the page behind the grid on some browsers. This is the
same, already-documented tradeoff `SharePicker`'s own arrow-key handling
accepts.

**Outside-dismissal is a root `focusout`, not a document click.** This
package ships no document-level click listener (the same precedent
`SharePicker` and `TextSizePicker` set), so the dialog closes when focus
leaves the root rather than on a click outside it. In practice clicking
away moves focus away, so pointer dismissal still works.

**Mousedown's default is suppressed on the grid, header, shortcuts, and
footer**, so that clicking one button while a *different* button already
holds focus does not fire the root `focusout` (and therefore the outside-
dismissal heuristic above) before the click's own handler runs. It is
deliberately **not** applied to the time `<select>`s — suppressing a
`<select>`'s own mousedown default stops it opening by click in most
browsers. The consequence: clicking directly into an hour/minute/meridiem
`<select>` while a day button still holds focus can, on some browsers,
trigger the dismissal heuristic before the select opens. Tabbing to the
select, or a second click, works normally. If this matters for your
users, consider steering keyboard users to `Tab` into the time controls
rather than relying on a first click.

**Static SSR renders the markup but cannot operate the control.** Under a
static-SSR page, `OnAfterRenderAsync` never fires, so the Tab trap is
never installed and no focus moves happen — the trigger would open a
dialog that cannot trap Tab and cannot move the roving tabindex under
keyboard use. Give a page that uses this control an interactive render
mode (`InteractiveServer`, `InteractiveWebAssembly`, or `InteractiveAuto`).

## What to check in review

- `Label` is supplied, translated, and names the field's purpose ("Pick an
  appointment date"), not just "date".
- Every entry `Labels` requires for the chosen `Mode` is supplied and
  translated — `Hour`/`Minute` for any mode with a time, `Meridiem` when a
  12-hour clock will render, `Week` when `ShowWeekNumbers` is set.
- The page hosting the control has an interactive render mode.
- `IsDateDisabled` and `Min`/`Max` genuinely reflect the booking rules —
  a picker that can select an impossible date will fail later, downstream,
  somewhere harder to trace back to the form.
- If you override the glyph via `ChildContent`, it stays `aria-hidden` and
  the accessible name still comes from `Label`.

---

Lily™ and Lily Design System™ are trademarks.
