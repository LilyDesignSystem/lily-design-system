# MockupBrowser

A mockup browser is a decorative container that visually resembles a web browser, used to frame content in documentation, demos, or marketing pages. It provides a recognizable browser chrome around the contained content.

This headless component uses a `<div>` element with `role="img"` and `aria-label` to present the mockup as a decorative image to assistive technologies.

## Implementation Notes

- Uses `<div>` element with `role="img"` for decorative presentation
- `aria-label` describes the mockup content for screen readers
- Contains a slot for the browser content area
- Consumer styles the browser chrome (address bar, buttons, frame)

## Props

- `label`: string (required) -- accessible label describing the mockup content
- `children`: slot (required) -- the content displayed inside the browser mockup
- `...restProps`: Any additional HTML attributes

## Usage

Basic browser mockup with a screenshot:

```html
<MockupBrowser label="Example website homepage">
  <Image src="homepage.png" alt="Homepage screenshot" />
</MockupBrowser>
```

Browser mockup with live HTML content for a documentation demo:

```html
<MockupBrowser label="Login page preview">
  <div class="demo-page">
    <h1>Welcome back</h1>
    <form>
      <label for="email">Email</label>
      <input type="email" id="email" placeholder="you@example.com" />
      <button type="submit">Sign in</button>
    </form>
  </div>
</MockupBrowser>
```

Browser mockup in a marketing comparison layout:

```html
<div class="comparison-grid">
  <MockupBrowser label="Dashboard before redesign">
    <Image src="dashboard-before.png" alt="Dashboard before redesign" />
  </MockupBrowser>
  <MockupBrowser label="Dashboard after redesign">
    <Image src="dashboard-after.png" alt="Dashboard after redesign" />
  </MockupBrowser>
</div>
```

## Keyboard Interactions

- None -- mockups are decorative, not interactive

## ARIA

- `role="img"` -- presents the mockup as a single image to assistive technologies
- `aria-label` -- describes the mockup content for screen readers

## When to Use

- Use to present website designs, screenshots, or interactive demos within a recognizable browser frame.
- Use in documentation pages to show how a web application looks in context.
- Use in marketing or portfolio pages to frame web content professionally.
- Use in design system showcases to display component examples in a browser context.
- Use in tutorials or walkthroughs where a browser frame helps orient the reader.

## When Not to Use

- Do not use for functional browser embedding -- use an iframe or web view instead.
- Do not use for terminal or CLI output -- use MockupShell instead.
- Do not use for desktop application screenshots -- use MockupWindow instead.

## Headless

This component provides a `<div>` with `role="img"` and `aria-label` for accessible decorative presentation, with zero visual styling. The consumer is responsible for all CSS including browser chrome appearance, address bar, window buttons, frame border, and content area sizing.

## Styles

The consumer provides all CSS styling. The component renders with a `.mockup-browser` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `mockup-browser`
- Verify `role="img"` is present
- Verify `aria-label` is applied
- Verify child content is rendered
- Verify pass-through attributes are applied

## Advice

- **Designers**: Include recognizable browser elements (address bar, close/minimize/maximize buttons) for clear identification. Use consistent mockup sizing across the page.
- **Developers**: Always provide a descriptive `label` prop so screen readers can convey the mockup's purpose.
