# Slider

## Metadata

- Component: slider
- PascalCase: Slider
- Description: a draggable control for selecting a value along a track
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <input>
- CSS class: .slider
- Interactive: yes

## Key Behaviors

- Uses a native `<input type="range">` element for built-in browser slider behavior
- Supports two-way binding on the `value` prop
- Accepts `...restProps` for forwarding additional attributes to the input element
- No internal state management beyond the bindable value -- relies on native input behavior

## ARIA

- `aria-label={label}` -- provides an accessible name for the slider
- `aria-valuetext` (optional, via rest props) -- a human-readable value such as "50 percent" or "£20" when the bare number is not meaningful; the consumer formats it (with `Intl.NumberFormat`) and updates it with the value, because the component holds no locale

## Keyboard

- Left Arrow / Down Arrow: Decrease value by one step
- Right Arrow / Up Arrow: Increase value by one step
- Home: Set to minimum value
- End: Set to maximum value
- Page Up: Increase by a larger step (browser-dependent)
- Page Down: Decrease by a larger step (browser-dependent)

The `<input type="range">` supplies all of these natively, with the implicit `slider` role and the `aria-valuemin`, `aria-valuemax` and `aria-valuenow` values; the component adds no key handling. A rubber-band or spring effect on the thumb is consumer CSS and must stop under `prefers-reduced-motion` (see `motion-picker`'s `data-motion`).

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: number (default: 50) -- current slider value; bindable
- `min`: number (default: 0) -- minimum allowed value
- `max`: number (default: 100) -- maximum allowed value
- `step`: number (default: 1) -- increment between allowed values
- `disabled`: boolean (default: false) -- whether the slider is disabled

## Acceptance Criteria

- [ ] Renders an <input type="range"> element with class="slider"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .slider in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/slider.html
- WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
- MDN input type="range": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range
