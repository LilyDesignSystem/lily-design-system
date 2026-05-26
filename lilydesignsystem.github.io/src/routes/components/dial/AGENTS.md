# Dial

## Metadata

- Component: dial
- PascalCase: Dial
- Description: a rotary dial control for selecting a value
- HTML tag: <div>
- CSS class: .dial
- Interactive: yes

## Key Behaviors

- Renders a `<div>` with `role="slider"` since there is no native dial HTML element
- Supports two-way binding on the `value` prop with the parent
- Internal `clamp()` function ensures the value always stays within the `min`/`max` range
- Keyboard handler supports both fine (arrow keys) and coarse (Shift+arrow) adjustment
- Home and End keys jump directly to `min` and `max` bounds
- The `tabindex` is set to `0` when enabled (focusable) or `-1` when disabled (not focusable)
- `aria-disabled` is only set when the dial is disabled; omitted otherwise

## ARIA

- `role="slider"` -- indicates a range input control
- `aria-label="{label}"` -- provides an accessible name for the dial
- `aria-valuenow="{value}"` -- communicates the current value to assistive technology
- `aria-valuemin="{min}"` -- communicates the minimum allowed value
- `aria-valuemax="{max}"` -- communicates the maximum allowed value
- `aria-disabled="true"` -- present only when the dial is disabled

## Keyboard

- ArrowRight / ArrowUp: increase value by one step
- ArrowLeft / ArrowDown: decrease value by one step
- Shift + ArrowRight / ArrowUp: increase value by 10 steps
- Shift + ArrowLeft / ArrowDown: decrease value by 10 steps
- Home: set value to minimum
- End: set value to maximum

## Props

- `value`: number (default: 0) -- current dial value; bindable
- `min`: number (default: 0) -- minimum allowed value
- `max`: number (default: 100) -- maximum allowed value
- `step`: number (default: 1) -- increment per key press
- `label`: string (required) -- accessible name for the dial
- `disabled`: boolean (default: false) -- whether the dial is disabled

## Acceptance Criteria

- [ ] Renders <div> element with class="dial"
- [ ] Has aria-label attribute
- [ ] Has role="slider"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .dial in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/dial.html
- WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
- WAI-ARIA slider role: https://www.w3.org/TR/wai-aria-1.2/#slider
