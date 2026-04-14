# Mockup Phone

A mockup phone is a box area that looks like a mobile phone. It provides a visual frame that mimics a phone device, allowing designers and developers to showcase mobile content, app screenshots, or responsive designs within a realistic phone-shaped container.

This headless component uses a `<div>` element as the phone frame container. The consumer provides the phone screen content as children.

## Implementation Notes

- Renders a `<div>` element as the phone frame container
- `role="img"` with `aria-label` identifies the mockup as a decorative phone frame
- Consumer provides the screen content as children
- The component provides semantic structure only; all phone visual styling (bezel, notch, rounded corners, screen area) is the consumer's responsibility
- Spreads `restProps` onto the `<div>` for consumer customization

## Props

- `label`: string (required) -- accessible name describing the phone mockup (e.g., "Phone showing app home screen")
- `children`: slot (required) -- content displayed within the phone screen area
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

Basic phone mockup:

```html
<MockupPhone label="Phone showing app home screen">
  <img src="screenshot.png" alt="App home screen" />
</MockupPhone>
```

Phone mockup with live content:

```html
<MockupPhone label="Phone showing login form">
  <form>
    <label for="email">Email</label>
    <input type="email" id="email" />
    <button type="submit">Sign In</button>
  </form>
</MockupPhone>
```

## Keyboard Interactions

- Tab: Focus moves to interactive elements within the phone content
- (The phone frame itself is not interactive; keyboard interactions depend on the content within)

## ARIA

- `role="img"` with `aria-label` identifies the mockup as a phone frame representation
- Screen readers announce the label to describe the mockup context
- Interactive content within the mockup remains fully accessible

## When to Use

- Use for showcasing mobile app designs, screenshots, or responsive layouts within a phone-shaped frame.
- Use in design documentation, marketing pages, or portfolio sites to present mobile content.
- Use in component libraries to demonstrate mobile-specific components.
- Use in app store listing previews or promotional materials.

## When Not to Use

- Do not use for functional mobile previews -- test on real devices or browser device emulation instead.
- Do not use for tablet content -- use MockupTabletPortrait or MockupTabletLandscape instead.
- Do not use for desktop or browser content -- use MockupLaptop or MockupBrowser instead.

## Headless

This component provides a `<div>` with `role="img"` and `aria-label` for the phone frame, with zero visual styling. The consumer is responsible for all CSS including the phone bezel shape, screen area, notch or camera cutout, rounded corners, aspect ratio, shadow, and responsive sizing.

## Styles

The consumer provides all CSS styling. The component renders with a `.mockup-phone` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `mockup-phone`
- Verify `role="img"` with `aria-label` for the phone frame
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Maintain a realistic phone aspect ratio (approximately 9:19.5 for modern smartphones). Include visual details like a bezel, notch, and rounded corners. Ensure the screen content area is clearly defined and the mockup scales well across viewport sizes.
- **Developers**: Always provide a descriptive `label` prop that explains what the phone mockup is showing. Ensure any interactive content inside the mockup remains keyboard accessible and does not trap focus.

## References

- WAI-ARIA img Role: https://www.w3.org/TR/wai-aria-1.2/#img
