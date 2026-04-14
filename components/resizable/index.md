# Resizable

Resizable is a headless container that allows users to resize its contents in one or both directions. It provides a focusable region with an accessible label, enabling keyboard users to interact with the resizable area.

Use Resizable when you need a panel, pane, or content area that users can resize, such as a code editor panel, a sidebar, or an adjustable preview area. The component exposes a `data-resize` attribute indicating the resize direction, which consumers can use to apply CSS `resize` property styling. The component itself is headless and applies no visual styling.

## Implementation Notes

- Renders a `<div>` element with `role="region"` for landmark semantics
- Sets `tabindex="0"` to make the container keyboard-focusable
- Exposes a `data-resize` attribute with the value of the `direction` prop (`"both"`, `"horizontal"`, or `"vertical"`)
- Consumer is responsible for applying CSS `resize` and `overflow` properties based on the `data-resize` attribute
- Spreads `restProps` onto the div for consumer customization

## Props

- `label`: string (required) -- accessible label for the resizable region, applied via `aria-label`
- `direction`: `"both" | "horizontal" | "vertical"` (default: `"both"`) -- which directions the container can be resized
- `children`: slot (required) -- content to render inside the resizable container
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

Resizable code editor panel:

```html
<Resizable label="Code editor" direction="both">
  <pre><code>const x = 42;</code></pre>
</Resizable>
```

Horizontally resizable sidebar:

```html
<Resizable label="Sidebar navigation" direction="horizontal">
  <nav>
    <a href="/dashboard">Dashboard</a>
    <a href="/settings">Settings</a>
  </nav>
</Resizable>
```

Vertically resizable preview area:

```html
<Resizable label="Document preview" direction="vertical">
  <iframe src="/preview" title="Document preview"></iframe>
</Resizable>
```

## Keyboard Interactions

None -- this component is a passive container. The consumer is responsible for implementing any keyboard-driven resize behavior. The `tabindex="0"` ensures the region is focusable for screen reader navigation.

## ARIA

- `role="region"` -- identifies the container as a landmark region for assistive technologies
- `aria-label={label}` -- provides an accessible name describing the resizable area

## When to Use

- Use Resizable for adjustable panels such as code editors, sidebars, or preview areas where users benefit from controlling the content size.
- Use Resizable when layout flexibility is important and content may need more or less space depending on the task.
- Use Resizable for dashboard widgets that users can expand or shrink to prioritize information.
- Use Resizable for image or document preview panes that benefit from manual sizing.

## When Not to Use

- Do not use Resizable for fixed-layout content that should not change size.
- Do not use Resizable for splitting two adjacent panels that share available space -- use Splitter instead.
- Do not use Resizable for simple visual dividers between sections -- use Separator instead.

## Headless

The Resizable headless component provides a `<div>` with `role="region"`, `aria-label`, `tabindex="0"` for keyboard focus, and a `data-resize` attribute indicating the allowed direction. The consumer provides all visual styling including CSS `resize` and `overflow` properties, drag handles, and dimension constraints.


## Styles

The consumer provides all CSS styling. The component renders with a `.resizable` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `resizable`
- Verify role="region"` -- identifies the container as a landmark region for assistive technologies
- Verify aria-label={label}` -- provides an accessible name describing the resizable area
- Verify pass-through attributes are applied

## Advice

- **Designers**: Provide a visible resize handle or grip indicator so users know the area is resizable, and set sensible minimum/maximum dimensions.
- **Developers**: Apply `overflow: auto` and the appropriate CSS `resize` value (`both`, `horizontal`, or `vertical`) based on the `data-resize` attribute.

## References

- WAI-ARIA Region Role: https://www.w3.org/TR/wai-aria-1.2/#region
- WAI-ARIA Authoring Practices - Window Splitter: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
