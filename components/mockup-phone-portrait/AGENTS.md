# MockupPhonePortrait

## Metadata

- Component: mockup-phone-portrait
- PascalCase: MockupPhonePortrait
- Description: a box area that looks like a mobile phone
- HTML tag: <div>
- CSS class: .mockup-phone-portrait
- Interactive: no

## Key Behaviors

- Renders a `<div>` element as the phone frame container
- `role="img"` with `aria-label` identifies the mockup as a phone frame representation
- Consumer provides the screen content as children
- All phone visual styling is the consumer's responsibility
- Spreads `restProps` onto the `<div>` for consumer customization

## ARIA

- `role="img"` with `aria-label` identifies the mockup as a phone frame representation
- Screen readers announce the label to describe the mockup context

## Keyboard

- Tab: Focus moves to interactive elements within the phone content
- (The phone frame itself is not interactive)

## Props

- `label`: string (required) -- accessible name describing the phone mockup
- `children`: slot (required) -- content displayed within the phone screen area
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="mockup-phone-portrait"
- [ ] Has role="img" with aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .mockup-phone-portrait in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/mockup-phone-portrait.html
- WAI-ARIA img Role: https://www.w3.org/TR/wai-aria-1.2/#img
