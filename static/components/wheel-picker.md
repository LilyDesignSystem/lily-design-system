# WheelPicker

A single-select listbox, vertical by default, where the selection follows the cursor, in the manner of a scroll wheel: moving with the arrow keys, typing, or clicking an option chooses it. Use it to pick one of a short list (an hour, a minute, a month, a year) where a long `<select>` is awkward. Several wheels make one value, such as a time, in a `Fieldset` (the several-wheels pattern in `AGENTS/components.md`).

**Status:** experimental — implemented and unit-tested in all nine headless catalogs (2026-10-23). Blazor, Nunjucks and plain HTML differ; see "Per-library notes".

## Implementation Notes

- Renders `<div class="wheel-picker {class}">` holding `<div class="wheel-picker-list" role="listbox" aria-orientation tabindex="0">` (`aria-orientation` is `vertical`, or `horizontal` with `orientation="horizontal"`) of `<div class="wheel-picker-option" role="option" aria-selected>` elements
- DOM focus stays on the list; the cursor is `aria-activedescendant`. Selection follows the cursor, so there is no commit key (APG listbox, "selection follows focus")
- The keys, the skipping of disabled options, the wrap rule and type-ahead are the pure `shared/wheel-picker.ts`
- Centres the chosen option by scrolling the list by the distance between the two middles (`scrollTop`, or `scrollLeft` when horizontal, which also works right-to-left): only the list scrolls, never the page, and never animated
- Forms: with `name`, a hidden input carries the value. It is disabled while the picker is, so a disabled picker is not submitted; `form` names a form elsewhere; a form reset puts the picker back to the value it was given first and reports the change. Native validation (`required`) does not apply to a hidden input: validate the value in your form code
- The wheel look (scroll snapping, a fading edge, a 3-D tilt, momentum on touch) is the consumer's CSS. Dragging and touch inertia are plain scrolling of `.wheel-picker-list`
- Scrolling chooses: when the user turns the wheel (a mouse wheel, a touch, the scroll bar) and it settles (`scrollend`, or 150 ms after the last `scroll`), the enabled option nearest the middle becomes the value, and `onChange` fires once, never for each option passed. A scroll with no gesture before it, such as the component's own centring, chooses nothing. `watchWheelScroll` and `wheelIndexNearest` in `shared/wheel-picker.ts`
- The 63 reference themes style it as a scroll-snapping list of five rows with the chosen option filled and bold. Two rows of block padding let the first and last options rest in the centre, and the list is `position: relative` so the centring script measures from it
- Add the class `wheel-picker-drum` to the root and the themes turn each option like a drum, on a CSS scroll-driven animation: no script, and a flat list without `animation-timeline` support or with reduced motion

## Props

| Prop           | Type                                       | Default      | Description                                                           |
| -------------- | ------------------------------------------ | ------------ | --------------------------------------------------------------------- |
| `class`        | string                                     | `""`         | Appended to the base class                                            |
| `label`        | string (required)                          | —            | Accessible name                                                       |
| `options`      | `{ value, label, disabled? }[]` (required) | —            | The choices                                                           |
| `value`        | string                                     | `""`         | The chosen option's value. Bindable; empty or unknown chooses nothing |
| `loop`         | boolean                                    | `false`      | Arrow keys wrap from the last enabled option to the first and back    |
| `pageSize`     | number                                     | `5`          | Enabled options PageUp / PageDown move by                             |
| `disabled`     | boolean                                    | `false`      | Not focusable; ignores keys and clicks; the hidden input is disabled  |
| `orientation`  | `"vertical"` \| `"horizontal"`             | `"vertical"` | The axis the options run along, and which arrows move                 |
| `name`         | string                                     | —            | Adds a hidden input carrying the value                                |
| `form`         | string                                     | —            | The id of the form the hidden input belongs to                        |
| `onChange`     | `(value) => void`                          | —            | Once per change                                                       |
| `...restProps` | HTML attributes                            | —            | Spread onto the root `<div>`                                          |

## Usage

```svelte
<WheelPicker
  label="Month"
  options={months}
  bind:value={month}
/>
```

```css
/* consumer CSS: the 63 themes already do this */
.wheel-picker-list {
  --row: 2.75em;
  position: relative; /* the component centres an option by its offsetTop */
  box-sizing: border-box;
  block-size: calc(var(--row) * 5);
  padding-block: calc(var(--row) * 2); /* so the first and last options can reach the centre */
  overflow-y: auto;
  scroll-snap-type: y mandatory;
}
.wheel-picker-option {
  min-block-size: var(--row);
  scroll-snap-align: center;
}
.wheel-picker-option[aria-selected="true"] {
  font-weight: 600;
}
```

## Per-library notes

- **Svelte** `bind:value`; **React** controlled (`value` and `onChange`); **Vue** `v-model`; **Angular** `[(value)]`, no rest-props spread; **Web Components** reads child `<option>` elements (or the `options` property) and fires `change`; **Alpine** `lilyWheelPicker({ options, value, orientation, … })` fires `change` with `{ value }`; the hidden input is the snippet's `<input type="hidden" x-ref="input" x-bind="input">`, with your `name` and `form`.
- **HTML**: the options are in the markup (set `aria-orientation="horizontal"` on the list for a horizontal wheel); the snippet's `<script>` handles the keys, clicks, the hidden input (disabled while the list is `aria-disabled`) and form reset, and fires a bubbling `change` with `detail.value`. The key model inside the script is generated from the shared module between its `BEGIN`/`END` markers.
- **Nunjucks**: the macro renders the markup contract (selected option, `aria-activedescendant`, `aria-orientation`, `data-loop`, `data-page-size`), and `components/widget-init.js` wires the keys and form reset.
- **Blazor** (no JS interop): `@bind-Value`, key model `WheelPickerKeys`. A handler cannot call `preventDefault` for only some keys, so the arrow and page keys also scroll the list (give `.wheel-picker-list` `overflow: hidden` to stop that), and the chosen option is not re-centred by script. Scrolling does not choose. A horizontal wheel's arrows are not swapped right-to-left, and a form reset does not put the picker back, because the component reads neither `dir` nor the form.

## Keyboard Interactions

| Key                    | Action                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| ArrowDown / ArrowUp    | Choose the next / previous enabled option (wrap only with `loop`)                         |
| ArrowRight / ArrowLeft | Horizontal: the next / previous enabled option; swapped right-to-left (the nearest `dir`) |
| Home / End             | Choose the first / last enabled option                                                    |
| PageDown / PageUp      | Move by `pageSize` enabled options, clamped                                               |
| A printable character  | Type-ahead over the labels                                                                |
| Tab                    | Leave the control                                                                         |

## ARIA

- `role="listbox"`, `aria-label`, `aria-orientation` (`vertical` or `horizontal`), `aria-activedescendant` (the chosen option), `aria-disabled` when disabled
- Options: `role="option"`, `aria-selected`, `aria-disabled` when disabled

## When to Use

- Choosing one value from a short, ordered list: hours, minutes, months, years, quantities
- Time and date entry where the reader scrolls or types to the value
- When a visible, scannable list is better than opening a dropdown

## When Not to Use

- Use `Select` or `Combobox` — for a long list, or one the reader should search
- Use `RadioGroup` — for two to five choices that should all be visible at once
- Use `Slider` — for a continuous or very wide numeric range
- Use `DateTimePicker` — for a full date and time; its time controls are native selects
- Do not use it for several selections: it is single-select

## Headless

This component decides the roles, the keys and the chosen value. It decides no height, snapping, fading, colour or motion; the consumer's CSS supplies the wheel look.

## Styles

Target `.wheel-picker`, `.wheel-picker-list` (give it a height, `position: relative`, `overflow-y: auto` and `scroll-snap-type: y mandatory`, with block padding of half the list less half a row so the ends can reach the centre) and `.wheel-picker-option` (`scroll-snap-align: center`). The themes offer a drum on `.wheel-picker-drum`, built only from `transform`, never `opacity`, so every option keeps its contrast. Style the chosen option with `[aria-selected="true"]` and a disabled one with `[aria-disabled="true"]`. Never remove the list's focus ring. Under `prefers-reduced-motion`, drop any scroll smoothing, fade or tilt.

## Testing

- Base class first, then the consumer class; a vertical, named listbox
- One option per entry, exactly one `aria-selected`, none for an unknown value; `aria-activedescendant` names it
- Arrow, Home, End and Page keys move the choice, skip disabled options, clamp or wrap with `loop`
- Type-ahead chooses the matching option
- Handled keys prevent the default action
- Clicking chooses an enabled option; a disabled one does nothing; the held option is a no-op
- Disabled: not focusable, ignores keys and clicks
- Hidden input only with `name`, carrying the value; disabled with the picker; `form` reaches it; form reset restores the first value
- Horizontal: ArrowRight / ArrowLeft move, swapped right-to-left; ArrowDown does not; rest props reach the root
- Scrolling with a gesture and settling chooses the middle option once; a scroll with no gesture chooses nothing; a disabled option is skipped; a disabled picker ignores scrolling

## Advice

Give the list a fixed height showing three to seven options, so the chosen one has neighbours on both sides. Keep labels short and put the unit in `label`, not in every option. For a form field, give the picker a visible label and `name`.

A wheel is easy to use with a pointer and keyboard but is a poor fit for screen-magnifier users who see one option at a time: for a long list, offer a `Select` instead.

## Related components

- `listbox`
- `select`
- `combobox`
- `date-time-picker`
- `slider`

## References

- [WAI-ARIA APG: Listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
- [MDN: CSS scroll snap](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap)

---

Lily™ and Lily Design System™ are trademarks.
