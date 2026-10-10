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
  never drops onto an unrendered cell. Focus follows the cursor only for
  grid paging (`PageUp`/`PageDown`); paging from the header buttons
  leaves focus on the header button, so "next month" can be activated
  repeatedly without the user being yanked into the grid.
- Vetoed days (outside `Min`/`Max`, or refused by `IsDateDisabled`) are
  `aria-disabled="true"` — **never** the `disabled` attribute. A
  `disabled` button refuses focus, so arrowing the roving cursor across a
  blocked week would go silent for a screen reader while the visible
  focus stayed behind, and the "exactly one tabbable day" invariant would
  break. `aria-disabled` keeps the day focusable and announced as
  unavailable; activation is refused in the handler instead. (`data-disabled`
  rides along for consumer CSS — style with `[data-disabled]`, not
  `:disabled`.)
- Closing the dialog returns focus to whichever element opened it — the
  trigger button after a click, the **text field** after
  `Alt`+`ArrowDown` — per the APG dialog pattern. Always refocusing the
  button would strand a keyboard user one Tab stop past where they were.
  Click-outside closes without moving focus, since the user has already
  put it somewhere — and "outside" includes the component's own text
  field, because a dialog claiming `aria-modal="true"` that stays open
  while the user edits the field behind it is telling assistive
  technology one thing and doing another.
- Typed text is never silently corrected. Unparseable or out-of-range
  input is marked `aria-invalid="true"` and left exactly as typed, so a
  screen reader user gets a clear, honest state rather than a value that
  quietly changed underneath them. `Escape` in the field discards a
  pending edit and clears the invalid state, committing nothing —
  mirroring the dialog's own Escape contract.
- Supply `Labels.Invalid` and the refusal is *announced*, not just
  marked: a `role="status"` live region — present in the DOM before it
  has content, because a live region born with its message is routinely
  not announced at all — fills with your message, wired to the field via
  `aria-errormessage` and appended to `aria-describedby` (after your own
  `DescribedBy`) for the assistive technologies that read the older
  attribute only.
- Supply `Labels.Instructions` and the dialog carries keyboard help as
  its first child, referenced by the dialog's `aria-describedby`, so a
  screen reader speaks it once on open — the APG date-picker example
  ships exactly this affordance. Both labels are optional and render
  nothing when absent: the component never invents an English
  announcement.
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

**Focus decisions ride on code paths, not on `document.activeElement`.**
Blazor cannot read the active element without a JS round trip, so two
canonical behaviours are decided differently here with the same outcome:
close refocuses the field or the trigger according to which of the two
open paths ran (`Alt`+`ArrowDown` vs. click — the only two ways in), and
month/year paging refocuses the grid cursor only when the paging
originated from the grid's own `PageUp`/`PageDown` handling, never from a
header-button click. One visible difference from the canonical Svelte
build: if focus is sitting in the grid and the user *clicks* a header
button (whose mousedown default is suppressed), focus stays on the reused
grid cell rather than being re-pointed at the carried cursor. Focus is
never lost either way.

**The field's `Escape` cannot stop propagation.** The canonical
implementation stops the keystroke when it discards a pending edit, so a
surrounding consumer dialog does not also close on what was, to the user,
a text-editing key. `@onkeydown:stopPropagation` is a static, per-render
declaration that would swallow every key, so this port discards the edit
but lets the keystroke propagate — a consumer hosting the picker inside
their own Escape-closable dialog should be aware.

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
- `Labels.Invalid` and `Labels.Instructions` are supplied (and
  translated). Both are optional, but without `Invalid` a refused typed
  date is marked and never announced, and without `Instructions` the
  dialog opens with no keyboard help.
- Vetoed-day styling targets `[data-disabled]` or
  `[aria-disabled="true"]` — a `:disabled` selector no longer matches
  anything in the grid.
- The page hosting the control has an interactive render mode.
- `IsDateDisabled` and `Min`/`Max` genuinely reflect the booking rules —
  a picker that can select an impossible date will fail later, downstream,
  somewhere harder to trace back to the form.
- If you override the glyph via `ChildContent`, it stays `aria-hidden` and
  the accessible name still comes from `Label`.

---

Lily™ and Lily Design System™ are trademarks.
