# Slider

## Metadata

- Component: slider
- PascalCase: Slider
- Description: a draggable control for selecting a value along a track
- HTML tag: <div>
- CSS class: .slider
- Interactive: yes

## Key Behaviors

- Uses a native `<input type="range">` element for built-in browser slider behavior
- Supports two-way binding on the `value` prop
- Accepts `...restProps` for forwarding additional attributes to the input element
- No internal state management beyond the bindable value -- relies on native input behavior

## ARIA

- `aria-label={label}` -- provides an accessible name for the slider

## Keyboard

- Left Arrow / Down Arrow: Decrease value by one step
- Right Arrow / Up Arrow: Increase value by one step
- Home: Set to minimum value
- End: Set to maximum value
- Page Up: Increase by a larger step (browser-dependent)
- Page Down: Decrease by a larger step (browser-dependent)

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: number (default: 50) -- current slider value; bindable
- `min`: number (default: 0) -- minimum allowed value
- `max`: number (default: 100) -- maximum allowed value
- `step`: number (default: 1) -- increment between allowed values
- `disabled`: boolean (default: false) -- whether the slider is disabled

## Acceptance Criteria

- [ ] Renders <div> element with class="slider"
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
