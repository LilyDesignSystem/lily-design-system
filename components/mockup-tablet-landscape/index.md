# MockupTabletLandscape

A mockup tablet landscape is a decorative container that visually resembles a tablet computer in landscape orientation, used to frame content in documentation, demos, or marketing pages.

This headless component uses a `<div>` element with `role="img"` and `aria-label` to present the mockup as a decorative image to assistive technologies.

## Implementation Notes

- Uses `<div>` element with `role="img"` for decorative presentation
- `aria-label` describes the mockup content for screen readers
- Contains a slot for the tablet screen content area
- Consumer styles the tablet chrome (bezel, home button, screen area)

## Props

- `label`: string (required) -- accessible label describing the mockup content
- `children`: slot (required) -- the content displayed inside the tablet screen
- `...restProps`: Any additional HTML attributes

## Usage

Basic tablet landscape mockup:

```html
<MockupTabletLandscape label="App in landscape mode">
  <Image src="app-landscape.png" alt="App screenshot in landscape" />
</MockupTabletLandscape>
```

Tablet mockup for a video player demo:

```html
<MockupTabletLandscape label="Video streaming app in landscape mode">
  <div class="video-player-demo">
    <Image src="video-player.png" alt="Video player showing nature documentary" />
    <div class="controls">
      <button>Play</button>
      <progress value="35" max="100"></progress>
    </div>
  </div>
</MockupTabletLandscape>
```

Tablet mockup in a device comparison layout:

```html
<div class="device-showcase">
  <MockupPhone label="Mobile view of the calendar app">
    <Image src="calendar-phone.png" alt="Calendar app on phone" />
  </MockupPhone>
  <MockupTabletLandscape label="Tablet landscape view of the calendar app">
    <Image src="calendar-tablet.png" alt="Calendar app on tablet in landscape" />
  </MockupTabletLandscape>
</div>
```

## Keyboard Interactions

- None -- mockups are decorative, not interactive

## ARIA

- `role="img"` -- presents the mockup as a single image to assistive technologies
- `aria-label` -- describes the mockup content for screen readers

## When to Use

- Use to showcase tablet-optimized designs in landscape orientation.
- Use in documentation or marketing pages to frame tablet content.
- Use for displaying video players, dashboards, or wide-format layouts in a tablet context.
- Use in education or enterprise app demos where landscape is the primary orientation.

## When Not to Use

- Do not use for portrait-oriented tablet content -- use MockupTabletPortrait instead.
- Do not use for phone-sized content -- use MockupPhone instead.
- Do not use for desktop or browser content -- use MockupLaptop or MockupBrowser instead.

## Headless

This component provides a `<div>` with `role="img"` and `aria-label` for accessible decorative presentation, with zero visual styling. The consumer is responsible for all CSS including tablet frame appearance, bezel, screen area, and landscape aspect ratio.

## Styles

The consumer provides all CSS styling. The component renders with a `.mockup-tablet-landscape` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `mockup-tablet-landscape`
- Verify `role="img"` is present
- Verify `aria-label` is applied
- Verify child content is rendered
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use a landscape aspect ratio (e.g., 4:3 or 16:10) that matches common tablet displays. Include visible bezel for device recognition.
- **Developers**: Always provide a descriptive `label` prop so screen readers can convey the mockup's purpose.
