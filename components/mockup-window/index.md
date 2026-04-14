# MockupWindow

A mockup window is a decorative container that visually resembles a desktop window, used to frame content in documentation, demos, or marketing pages.

This headless component uses a `<div>` element with `role="img"` and `aria-label` to present the mockup as a decorative image to assistive technologies.

## Implementation Notes

- Uses `<div>` element with `role="img"` for decorative presentation
- `aria-label` describes the mockup content for screen readers
- Contains a slot for the window content area

## Props

- `label`: string (required) -- accessible label describing the mockup content
- `children`: slot (required) -- the content displayed inside the window mockup
- `...restProps`: Any additional HTML attributes

## Usage

Basic window mockup with a screenshot:

```html
<MockupWindow label="Application settings panel">
  <Image src="settings.png" alt="Settings panel screenshot" />
</MockupWindow>
```

Window mockup for a text editor preview:

```html
<MockupWindow label="Code editor showing HTML file">
  <CodeBlock language="html">
    &lt;h1&gt;Hello, world!&lt;/h1&gt;
  </CodeBlock>
</MockupWindow>
```

Window mockup in a feature comparison:

```html
<div class="feature-grid">
  <MockupWindow label="File manager showing grid view">
    <Image src="file-manager-grid.png" alt="File manager in grid view" />
  </MockupWindow>
  <MockupWindow label="File manager showing list view">
    <Image src="file-manager-list.png" alt="File manager in list view" />
  </MockupWindow>
</div>
```

## Keyboard Interactions

- None -- mockups are decorative, not interactive

## ARIA

- `role="img"` -- presents the mockup as a single image to assistive technologies
- `aria-label` -- describes the mockup content for screen readers

## When to Use

- Use to showcase desktop application designs, dialogs, or native software screenshots.
- Use in documentation to frame desktop-specific UI examples such as settings panels or editors.
- Use in marketing pages for native desktop applications.
- Use when the content represents a generic window without browser-specific chrome.

## When Not to Use

- Do not use for web-specific content that needs an address bar -- use MockupBrowser instead.
- Do not use for terminal or CLI output -- use MockupShell instead.
- Do not use for mobile content -- use MockupPhone instead.

## Headless

This component provides a `<div>` with `role="img"` and `aria-label` for accessible decorative presentation, with zero visual styling. The consumer is responsible for all CSS including window chrome, title bar, window control buttons, frame border, drop shadow, and content area sizing.

## Styles

The consumer provides all CSS styling. The component renders with a `.mockup-window` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `mockup-window`
- Verify `role="img"` is present
- Verify `aria-label` is applied
- Verify child content is rendered
- Verify pass-through attributes are applied

## Advice

- **Designers**: Include recognizable window elements (title bar, close/minimize/maximize buttons) for clear identification.
- **Developers**: Always provide a descriptive `label` prop so screen readers can convey the mockup's purpose.
