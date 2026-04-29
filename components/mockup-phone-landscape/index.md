# MockupPhoneLandscape

A box area that looks like a mobile phone in landscape orientation.

## Implementation Notes

- Renders a `<div>` element with class `mockup-phone-landscape`
- Accepts a `children` slot for the screen content rendered inside the device frame
- Companion to `MockupPhonePortrait` for portrait orientation
- Spreads `restProps` onto the `<div>` for consumer customization

## Props

- `className`: string (optional) — extra CSS classes appended to `mockup-phone-landscape`
- `children`: slot — content rendered inside the simulated phone screen

## Usage

```html
<MockupPhoneLandscape>
  <img src="screenshot-landscape.png" alt="App screen" />
</MockupPhoneLandscape>
```

## Keyboard Interactions

- No keyboard interactions — this is a passive decorative container

## ARIA

- No specific ARIA — decorative wrapper. Apply `role="img"` on the inner image if needed

## Headless

This headless component renders semantic HTML. The consumer provides all visual styling. No CSS, animations, or layout are included — the consumer composes those.

## Styles

The component renders with `.mockup-phone-landscape` as the root class. No default styles are included.

## References

- Documentation: index.md
- CSS class: `.mockup-phone-landscape` in css-style-sheet-template.css
