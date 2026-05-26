# SliderButton

## Metadata

- Component: slider-button
- PascalCase: SliderButton
- Description: a button with a slider that the user needs to slide to confirm
- HTML tag: <button>
- CSS class: .slider-button
- Interactive: yes

## Key Behaviors

- Uses `<button>` element for semantic button behavior
- Internal slider track requires drag-to-confirm interaction
- Activates only when slider reaches 100%
- Resets slider position if released before completion

## ARIA

- Implicit `button` role from `<button>` element
- `aria-label` -- describes the confirmation action
- `aria-valuenow` -- current slider position percentage

## Keyboard

- Tab: Focus the slider button
- Arrow Right: Move slider toward completion
- Arrow Left: Move slider toward start
- Enter: Activate immediately (accessibility fallback)

## Props

- `label`: string (required) -- accessible label describing the confirmation action
- `disabled`: boolean (default: false) -- whether the slider button is disabled
- `onconfirm`: callback (optional) -- handler called when slider completes
- `children`: slot -- button label content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <button> element with class="slider-button"
- [ ] Has aria-label attribute
- [ ] Slider interaction triggers onconfirm at completion
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .slider-button in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/slider-button.html
