# InputWithMask

## Metadata

- Component: input-with-mask
- PascalCase: InputWithMask
- Description: an input displaying a format mask placeholder for the user to fill in
- HTML tag: <div>
- CSS class: .input-with-mask
- Interactive: yes

## Key Behaviors

- Renders a `<div>` with class `input-with-mask` and `data-mask` attribute
- `label` prop is REQUIRED and sets `aria-label` on the input
- `mask` prop is REQUIRED and rendered both as `data-mask` and as the visible decorative span
- Mask display renders as `<span class="input-with-mask-display" aria-hidden="true">`
- Input renders as `<input class="input-with-mask-control" type="text">`
- `value`, `placeholder`, `disabled` are forwarded to the input
- `onInput` / `oninput` callback fires on input change
- Mask display is decorative; accessibility relies on the input's aria-label

## ARIA

- Input has `aria-label` from the `label` prop
- Mask display has `aria-hidden="true"` (decorative)

## Keyboard

- Tab: Focus the input
- All standard text-input keyboard handling is delegated to the native `<input>`

## Props

- `label`: string (REQUIRED) -- aria-label for the input
- `mask`: string (REQUIRED) -- format mask string
- `value`: string (default: "") -- input value
- `placeholder`: string (optional)
- `disabled`: boolean (default: false)
- `onInput` / `oninput`: callback (optional)
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> with class="input-with-mask"
- [ ] data-mask attribute equals the mask prop
- [ ] Mask display span has aria-hidden="true" and renders the mask string
- [ ] Input has class="input-with-mask-control" and type="text"
- [ ] Input has aria-label equal to the label prop
- [ ] Input value reflects the value prop
- [ ] Input is disabled when disabled is true
- [ ] Input handler fires on input change
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .input-with-mask in css-style-sheet-template.css
- US Web Design System Input Mask: https://designsystem.digital.gov/components/input-mask/
- WAI-ARIA aria-hidden: https://www.w3.org/TR/wai-aria-1.2/#aria-hidden
