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

## When to Use

- In marketing pages, documentation, or component galleries to frame a screenshot or video as a horizontally-held phone — useful for video, games, or split-screen UI.
- When a portrait frame would crop or distort wide content; the landscape frame preserves the wide aspect ratio.
- Alongside `MockupPhonePortrait` to show both orientations of the same app or screen.

## When Not to Use

- Do not use to frame portrait-oriented screenshots — use `MockupPhonePortrait`.
- Do not use to render an actual interactive device frame — this is a decorative wrapper, not a viewport emulator.
- Do not use for tablet content — use `MockupTabletLandscape` or `MockupTabletPortrait`.
- Do not use for desktop browser screenshots — use `MockupBrowser` or `MockupWindow`.

## Headless

This headless component renders semantic HTML. The consumer provides all visual styling. No CSS, animations, or layout are included — the consumer composes those.

## Styles

The component renders with `.mockup-phone-landscape` as the root class. No default styles are included.

## Related components

- `mockup-browser` — a box area that looks like a web browser
- `mockup-laptop` — a box area that looks like a laptop computer
- `mockup-phone-portrait` — a box area that looks like a mobile phone
- `mockup-shell` — a box area that looks like a terminal shell
- `mockup-tablet-landscape` — a box area that looks like a tablet computer in landscape mode
- `mockup-tablet-portrait` — a box area that looks like a tablet computer in portrait mode

## References

- Documentation: index.md
- CSS class: `.mockup-phone-landscape` in css-style-sheet-template.css
