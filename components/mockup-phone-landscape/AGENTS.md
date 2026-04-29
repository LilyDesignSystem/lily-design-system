# MockupPhoneLandscape

## Metadata

- Component: mockup-phone-landscape
- PascalCase: MockupPhoneLandscape
- Description: a box area that looks like a mobile phone in landscape orientation
- HTML tag: <div>
- CSS class: .mockup-phone-landscape
- Interactive: no

## Key Behaviors

- Renders a `<div>` element with class `mockup-phone-landscape`
- Accepts a `children` slot for the screen content rendered inside the device frame
- Companion to `MockupPhonePortrait` for portrait orientation
- Spreads `restProps` onto the `<div>` for consumer customization

## ARIA

- No specific ARIA — decorative wrapper. Apply `role="img"` on the inner image if needed

## Keyboard

- No keyboard interactions — this is a passive decorative container

## Props

- `className`: string (optional) — extra CSS classes appended to `mockup-phone-landscape`
- `children`: slot — content rendered inside the simulated phone screen

## Acceptance Criteria

- [ ] Renders `<div>` element with class="mockup-phone-landscape"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.mockup-phone-landscape` in css-style-sheet-template.css
