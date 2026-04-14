# MockupTabletPortrait

A mockup tablet portrait is a decorative container that visually resembles a tablet computer in portrait orientation, used to frame content in documentation, demos, or marketing pages.

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

Basic tablet portrait mockup:

```html
<MockupTabletPortrait label="Reading app in portrait mode">
  <Image src="reader-portrait.png" alt="Reading app screenshot in portrait" />
</MockupTabletPortrait>
```

Tablet portrait mockup for an e-commerce product page:

```html
<MockupTabletPortrait label="Online store product page on tablet">
  <div class="product-page">
    <Image src="product-photo.jpg" alt="Running shoes product photo" />
    <h2>Trail Runner Pro</h2>
    <p>$129.99</p>
    <button>Add to Cart</button>
  </div>
</MockupTabletPortrait>
```

Tablet portrait mockup in a responsive design showcase:

```html
<div class="responsive-showcase">
  <MockupPhone label="Mobile view of the news feed">
    <Image src="news-phone.png" alt="News feed on phone" />
  </MockupPhone>
  <MockupTabletPortrait label="Tablet portrait view of the news feed">
    <Image src="news-tablet.png" alt="News feed on tablet in portrait" />
  </MockupTabletPortrait>
</div>
```

## Keyboard Interactions

- None -- mockups are decorative, not interactive

## ARIA

- `role="img"` -- presents the mockup as a single image to assistive technologies
- `aria-label` -- describes the mockup content for screen readers

## When to Use

- Use to showcase tablet-optimized designs in portrait orientation.
- Use in documentation or marketing pages to frame tablet content.
- Use for reading apps, vertical scrolling interfaces, or forms designed for portrait tablets.
- Use in e-commerce or content apps where portrait mode is the primary orientation.

## When Not to Use

- Do not use for landscape-oriented tablet content -- use MockupTabletLandscape instead.
- Do not use for phone-sized content -- use MockupPhone instead.
- Do not use for desktop or browser content -- use MockupLaptop or MockupBrowser instead.

## Headless

This component provides a `<div>` with `role="img"` and `aria-label` for accessible decorative presentation, with zero visual styling. The consumer is responsible for all CSS including tablet frame appearance, bezel, screen area, and portrait aspect ratio.

## Styles

The consumer provides all CSS styling. The component renders with a `.mockup-tablet-portrait` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `mockup-tablet-portrait`
- Verify `role="img"` is present
- Verify `aria-label` is applied
- Verify child content is rendered
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use a portrait aspect ratio (e.g., 3:4 or 10:16) that matches common tablet displays. Include visible bezel for device recognition.
- **Developers**: Always provide a descriptive `label` prop so screen readers can convey the mockup's purpose.
