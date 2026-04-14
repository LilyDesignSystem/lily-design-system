# MockupWatch

A mockup watch is a decorative container that visually resembles a smart watch, used to frame content in documentation, demos, or marketing pages.

This headless component uses a `<div>` element with `role="img"` and `aria-label` to present the mockup as a decorative image to assistive technologies.

## Implementation Notes

- Uses `<div>` element with `role="img"` for decorative presentation
- `aria-label` describes the mockup content for screen readers
- Contains a slot for the watch screen content area

## Props

- `label`: string (required) -- accessible label describing the mockup content
- `children`: slot (required) -- the content displayed inside the watch screen
- `...restProps`: Any additional HTML attributes

## Usage

Basic watch mockup with a screenshot:

```html
<MockupWatch label="Fitness tracking app">
  <Image src="fitness-watch.png" alt="Fitness app on watch" />
</MockupWatch>
```

Watch mockup showing a notification preview:

```html
<MockupWatch label="Watch notification for incoming message">
  <div class="notification-preview">
    <strong>New message</strong>
    <p>Hey, are you free for lunch?</p>
  </div>
</MockupWatch>
```

Watch mockup in a multi-device showcase:

```html
<div class="device-family">
  <MockupWatch label="Heart rate on watch">
    <Image src="heart-rate-watch.png" alt="Heart rate display on watch" />
  </MockupWatch>
  <MockupPhone label="Heart rate history on phone">
    <Image src="heart-rate-phone.png" alt="Heart rate history chart on phone" />
  </MockupPhone>
</div>
```

## Keyboard Interactions

- None -- mockups are decorative, not interactive

## ARIA

- `role="img"` -- presents the mockup as a single image to assistive technologies
- `aria-label` -- describes the mockup content for screen readers

## When to Use

- Use to showcase smart watch app designs, notifications, or glanceable interfaces.
- Use in documentation or marketing pages to frame wearable content.
- Use in health and fitness app demos where the watch form factor is important.
- Use in design system showcases to demonstrate watch-optimized micro-interactions.

## When Not to Use

- Do not use for phone-sized content -- use MockupPhone instead.
- Do not use for non-wearable content that needs more screen space -- use MockupPhone or MockupTabletPortrait instead.
- Do not use for functional embedded content -- use appropriate interactive components instead.

## Headless

This component provides a `<div>` with `role="img"` and `aria-label` for accessible decorative presentation, with zero visual styling. The consumer is responsible for all CSS including watch frame, bezel, crown, screen shape, and content area sizing.

## Styles

The consumer provides all CSS styling. The component renders with a `.mockup-watch` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `mockup-watch`
- Verify `role="img"` is present
- Verify `aria-label` is applied
- Verify child content is rendered
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use a small, compact display area that reflects real watch screen dimensions. Consider round or square screen shapes to match target devices.
- **Developers**: Always provide a descriptive `label` prop so screen readers can convey the mockup's purpose.
