# Lessons from detent and svelte-detent (planned work)

## Summary

Lily's `wheel-picker` has the roles and keys of a listbox, but turning the wheel does not choose anything. Scrolling it with a
mouse wheel, a trackpad or a finger only moves the view. The value changes only on a click, a key or typing, so the filled option
scrolls away and the one now in the centre is not the one chosen. This topic plans that fix and six smaller items. They come
from a review on 2026-11-10 of two wheel pickers:

- [detent](https://github.com/hayderkg/detent) (`@hayderkg/detent`, MIT, React, pre-release), with a styled `<Detent>`, a headless
  `useDetent` hook and a framework-free `createEngine`.
- [svelte-detent](https://github.com/orefalo/svelte-detent) (MIT, Svelte 5, pre-release; [demo](https://orefalo.github.io/svelte-detent)),
  an unofficial port of detent. Its README says the port was done with Claude Code.

Both projects are styled libraries built on their own physics engine. The animation they ship is exactly what Lily's headless layer
excludes, so most of their surface is declined below. Their input, form and accessibility handling is careful, though, and that
part transfers. Nothing here is built yet: each item is an open acceptance criterion, and a task in
[tasks.md](../../tasks.md#phase-26--wheel-picker-lessons-from-detent-2026-11-10).

## Scope

### In scope

- The `wheel-picker` contract in all nine catalogs: what selects, when the value is reported, form behaviour, orientation.
- The wheel look as a theme recipe, written in CSS.
- Composing several wheels into one control, such as a time or a date.
- A rule for animated text, taken from `DetentText` and `DetentNumber`.

### Explicitly out of scope

- A physics engine, and per-frame JavaScript of any kind.
- Visual effects: indicator shapes and materials, refraction, motion blur, tilt, elastic rows, grip, centre light, depth.
- Haptics and sound.
- Rolling-text and odometer components as Lily components.

## Principles and rules

- **The centre is the value.** A wheel that the hand turns must choose what it lands on. Otherwise the control lies: the row in the
  middle is not the one submitted.
- **Native scrolling, not an engine.** detent rejects `scroll-snap` so that a throw lands on a row "with no visible correction". Lily
  keeps native scrolling with `scroll-snap`. The browser's inertia follows the platform's own settings, costs no script per frame,
  and works with zoom, assistive pointer devices and `prefers-reduced-motion` without code. A slightly visible snap is the price, and
  it is worth paying.
- **Report once, at rest.** detent fires `onChange` when the wheel settles, not for every row it passes, and announces the selection
  only then. Lily's `onChange` is already once per change; scrolling must keep that rule.
- **No live region.** detent renders an announcer beside the listbox. Lily's listbox moves `aria-activedescendant`, which screen
  readers already speak, so a second announcement would say the same thing twice. Lily does not add one.
- **The look is CSS.** detent writes `--offset`, `--abs-offset`, `--progress` and `--selected` on every row every frame. CSS
  scroll-driven animations (`animation-timeline: view()`) give a theme the same drum with no script. Lily uses those, as progressive
  enhancement, and only under `prefers-reduced-motion: no-preference`.

## What each project offers, and the decision

| detent / svelte-detent                                                                                                                                          | Lily today (`wheel-picker`)                                                                      | Decision                                                                                                                                                                                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Drag, throw, mouse wheel and trackpad all turn the wheel, and where it lands is the value                                                                       | Scrolling moves the view only; the value changes on click, keys or typing                        | **Adopt** (item 1). Choose the option nearest the centre when scrolling settles                                                                                                                                                            |
| `onChange` when the wheel settles; `changeOn="tick"` to follow every row passed                                                                                 | `onChange` once per change, from keys and clicks                                                 | **Adopt** the settle rule as part of item 1. **Decline** `changeOn="tick"`: a value that changes for every row a throw passes invites the consumer to do work on each, which loops (see the picker rule in [helpers](../helpers/index.md)) |
| The first and last items rest in the centre                                                                                                                     | The themes give the list no block padding, so the first and last options cannot reach the centre | **Adopt** (item 2), in the 63 themes                                                                                                                                                                                                       |
| `name` submits the key; a `disabled` wheel is left out of the form; form reset turns it back to `defaultValue`; a `form` attribute for a wheel outside its form | A hidden input with `name`; it is submitted while the picker is disabled; reset is not handled   | **Adopt** (item 3)                                                                                                                                                                                                                         |
| Vertical or horizontal; ← and → swap in right-to-left                                                                                                           | Vertical only                                                                                    | **Maintainer decision** (item 4). Build it when a horizontal use is real. `segment-group` and `carousel` cover most horizontal cases                                                                                                       |
| A drum, fading and depth from per-row CSS variables written every frame                                                                                         | The themes draw a scroll-snapping list with the chosen option filled                             | **Adapt** (item 5): an opt-in theme recipe using scroll-driven animations, with no script                                                                                                                                                  |
| `wheelMode`: a notched mouse wheel moves one row per notch; a trackpad keeps momentum                                                                           | Native scrolling: a notch scrolls a line height, and mandatory snapping rounds it to a row       | **Adapt** (item 5): try `scroll-snap-stop: always` and record whether it helps or makes trackpad flicks tedious. No script to tell wheels from trackpads                                                                                   |
| Time pickers, date pickers and slot reels built from several wheels                                                                                             | One wheel; `date-time-picker` does not yet use it                                                | **Adopt** (item 6): a composition pattern, and the open `date-time-picker` wiring                                                                                                                                                          |
| Rows render any markup (`item` snippet, `getLabel` for typeahead and announcements)                                                                             | `{ value, label, disabled? }`, plain text                                                        | **Defer**. An `option` role flattens its content for assistive technology, so rich rows add little. Revisit if a consumer asks                                                                                                             |
| `DetentText` and `DetentNumber`: real text in the DOM at rest, an `aria-hidden` copy while it rolls, reduced motion respected, no announcement unless asked     | No rule for animated text; consumers animate as they like                                        | **Adopt as a rule** (item 7), not as components                                                                                                                                                                                            |
| `keyAcceleration`: a held arrow speeds up after 2 s and 4 s                                                                                                     | One option per key repeat, at the operating system's repeat rate                                 | **Decline**. The repeat rate is the user's own setting, and speeding up makes the target easy to overshoot. The APG listbox pattern does not call for it; PageDown and End already cover distance                                          |
| Virtualization, `onEndReached`, loading rows, header, footer and empty-state rows                                                                               | Renders every option                                                                             | **Decline**. A wheel is for a short list (both projects say so too: "With long lists people search rather than scroll"). Long lists belong in `combobox` or `select`                                                                       |
| Physics engine; haptics (Vibration API) and tick sound; indicator shapes, materials, refraction, motion blur, tilt, elastic rows, grip                          | None                                                                                             | **Decline**: animation and styling, outside the headless layer. A consumer can hook haptics or sound to `onChange`                                                                                                                         |
| A `disabled` wheel that only displays, such as an odometer                                                                                                      | `disabled` removes the wheel from the tab order and ignores input                                | **Already met**                                                                                                                                                                                                                            |
| Selection identity survives inserted items (`getKey`)                                                                                                           | The value is the option's `value` string, not its index                                          | **Already met**                                                                                                                                                                                                                            |

Their own guidance, "When a wheel fits", agrees with Lily's "When Not to Use": a wheel suits a short, ordered range; for a long list
use search, and for two or three choices a segmented control. The native-platform decision also stands: on mobile, `<select>` is
already a wheel, and it is the answer for a closed picker ([native-primitives.tsv](../competitive-position/native-primitives.tsv)).

## The items

1. **Scrolling chooses.** When the list's scrolling settles, choose the enabled option whose middle is nearest the list's middle.
   Settling is the `scrollend` event; where a browser lacks it, use a short pause after the last `scroll` event. The nearest-option
   rule is a pure function in `shared/wheel-picker.ts` (for example `wheelIndexNearest(offsets, centre, disabled)`) with its own
   tests. If that option is disabled, choose the nearest enabled one and re-centre. The existing no-op rule holds: landing on the
   option already held fires nothing. The script's own centring sets `scrollTop`, which also ends in `scrollend`; because it lands on
   the held option, that is a no-op and cannot loop. Blazor cannot do this without JS interop; record it beside the existing Blazor
   notes. Nunjucks gets it through `macro-keys.js`, and HTML through the snippet's script.
2. **The ends reach the centre.** In the 63 themes, give `.wheel-picker-list` block padding (or `scroll-padding-block`) of half the
   list less half a row, so the first and last options can rest in the centre. Without it, item 1 could never choose the first or
   last option by scrolling.
3. **Forms.** The hidden input is disabled when the picker is, so a disabled picker is not submitted. Form reset returns the picker
   to the value it was given first, as the editors and `filter` do since 2026-10-30. Pass a `form` attribute through to the hidden
   input. Document that native validation (`required`) does not apply to a hidden input.
4. **Orientation (maintainer decision).** An `orientation` prop, `"vertical"` by default. Horizontal sets `aria-orientation`, uses
   ArrowLeft and ArrowRight, and swaps them when the nearest `dir` is `rtl`. The key model takes the orientation and direction.
5. **A drum recipe in CSS.** Document, and offer as one opt-in theme class, a wheel look built on `animation-timeline: view()`:
   rows rotate and fade with their distance from the centre. Wrap it in `@supports (animation-timeline: view())` and
   `@media (prefers-reduced-motion: no-preference)`, so browsers without scroll-driven animations keep the flat list. Try
   `scroll-snap-stop: always` with a notched mouse wheel and with a trackpad, and record what it does.
   _Result, 2026-11-10:_ the drum is `.wheel-picker-drum` in the 63 themes, `transform` only (an `opacity` fade would drop the
   outer options' text below 4.5:1). `scroll-snap-stop: always` made no difference in Chromium to synthetic mouse-wheel events of
   100px, which moved 2.02 rows of 44px with it and without it, so it is not adopted. A real notched wheel and a trackpad were not
   tried, and synthetic events were not run in Firefox or WebKit.
6. **Several wheels as one control.** A composition pattern in `AGENTS/components.md`: a `Fieldset` named by its legend (first
   planned as a `<div role="group">`; native grouping comes first), holding one `WheelPicker` per part, each with its own `label` ("Hours", "Minutes"). The order of the parts is the
   consumer's, as for `date-field`. Then the open item in the `wheel-picker` spec: `date-time-picker` uses it for its time columns.
7. **Animated text.** A rule in `AGENTS/accessibility.md` for any text a consumer animates: the real text stays in the DOM at rest;
   an animated copy is `aria-hidden` and removed at rest; intermediate values are never announced; with reduced motion the change
   is immediate. It suits `streaming-text`, counters and timers as much as rolling digits.

## Acceptance criteria

- [ ] 1. Scrolling a `wheel-picker` and letting it settle chooses the centred option, in every catalog that has script. A real-browser
      test scrolls it and checks `aria-selected`, because jsdom does not scroll.
- [x] 2. Every theme lets the first and last options rest in the centre. _(2026-11-10.)_
- [x] 3. A disabled picker is not submitted, form reset restores the first value, and `form` reaches the hidden input. _(2026-11-10; Blazor has no reset.)_
- [x] 4. Orientation is built, or declined with a reason. _(2026-11-10: built.)_
- [x] 5. The drum recipe is documented, with a reduced-motion test, and `scroll-snap-stop` has a recorded result. _(2026-11-10; the result is under item 5.)_
- [x] 6. The several-wheels pattern is documented, and `date-time-picker` uses `wheel-picker` or records why not. _(2026-11-10: it records why not.)_
- [x] 7. The animated-text rule is in `AGENTS/accessibility.md`. _(2026-11-10; `timer` and `character-counter` do not meet it yet: P26-T8, P26-T9.)_

## Related topics

- [chanhdai-lessons](../chanhdai-lessons/index.md): item 12 added `wheel-picker` to the catalog.
- [date-time-picker](../date-time-picker/index.md): the helper that should compose it.
- [helpers](../helpers/index.md): the rule that applying a value is idempotent.
- [competitive-position](../competitive-position/index.md): the native-platform decisions.
- [accessibility](../accessibility/index.md), [responsive](../responsive/index.md).

## Sources

- [components/wheel-picker/](../../components/wheel-picker/index.md) and its [spec](../../components/wheel-picker/spec/index.md)
- [shared/wheel-picker.ts](../../shared/wheel-picker.ts)
- `lily-design-system-svelte-headless/components/WheelPicker/WheelPicker.svelte`: no scroll handler; centring by `scrollTop`
- The `.wheel-picker` rules in `themes/*.css`
- detent `README.md`, and svelte-detent `README.md` and `demo/docs/docs.md`: the sections Forms, Accessibility, Mouse wheels,
  "When a wheel fits", DetentText and DetentNumber (read 2026-11-10). The svelte-detent demo site renders by script, so its
  examples were read from the docs, not run.

---

Lily™ and Lily Design System™ are trademarks.
