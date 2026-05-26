# PinInputDiv

## Metadata

- Component: pin-input-div
- PascalCase: PinInputDiv
- Description: a series of single-digit inputs for entering a PIN or OTP code
- HTML tag: <div>
- CSS class: .pin-input-div
- Interactive: yes

## Key Behaviors

- Renders as `<div role="group">` containing individual single-digit `<input>` elements
- Uses reactive state for internal digits array and two-way binding for combined value
- Auto-focuses next input on digit entry
- Backspace in empty input moves focus to previous input
- ArrowLeft/ArrowRight navigate between inputs
- Only accepts numeric characters (0-9)
- `inputmode="numeric"` ensures numeric keyboard on mobile devices
- `maxlength="1"` restricts each input to a single character

## ARIA

- `role="group"` with `aria-label` on the container
- Each input has `aria-label="Digit X of Y"` for positional context
- `inputmode="numeric"` for numeric keyboard on mobile

## Keyboard

- Digit entry: enters value and auto-focuses next input
- Backspace: clears current or moves to previous input
- ArrowLeft: focuses previous input
- ArrowRight: focuses next input
- Tab: standard tab navigation in/out of the group

## Props

- `label`: string (required) -- accessible label for the group via aria-label
- `length`: number (default: 4) -- number of digit inputs
- `value`: string (default: "") -- bindable combined string of all digits
- `disabled`: boolean (default: false) -- disables all inputs
- `...restProps`: Any additional HTML attributes on the group div

## Acceptance Criteria

- [ ] Renders <div> element with class="pin-input-div"
- [ ] Has aria-label attribute
- [ ] Has role="group"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .pin-input-div in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/pin-input-div.html
- WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group
