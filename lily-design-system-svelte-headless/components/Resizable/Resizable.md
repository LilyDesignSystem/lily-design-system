# Resizable

Resizable is a headless container that allows users to resize its contents in one or both directions. It provides a focusable region with an accessible label, enabling keyboard users to interact with the resizable area.

Use Resizable when you need a panel, pane, or content area that users can resize, such as a code editor panel, a sidebar, or an adjustable preview area. The component exposes a `data-resize` attribute indicating the resize direction, which consumers can use to apply CSS `resize` property styling. The component itself is headless and applies no visual styling.

## Implementation Notes

- Renders a `<div>` element with `role="region"` for landmark semantics
- Sets `tabindex="0"` to make the container keyboard-focusable
- Exposes a `data-resize` attribute with the value of the `direction` prop (`"both"`, `"horizontal"`, or `"vertical"`)
- Consumer is responsible for applying CSS `resize` and `overflow` properties based on the `data-resize` attribute
- Spreads `restProps` onto the div for consumer customization
- Uses Svelte 5 `$props()` with TypeScript typing

## Props

- `label`: string (required) -- accessible label for the resizable region, applied via `aria-label`
- `direction`: `"both" | "horizontal" | "vertical"` (default: `"both"`) -- which directions the container can be resized
- `children`: Snippet (required) -- content to render inside the resizable container
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```svelte
<Resizable label="Resizable panel" direction="both">
  <p>Content</p>
</Resizable>
```

## Keyboard Interactions

None -- this component is a passive container. The consumer is responsible for implementing any keyboard-driven resize behavior. The `tabindex="0"` ensures the region is focusable for screen reader navigation.

## ARIA

- `role="region"` -- identifies the container as a landmark region for assistive technologies
- `aria-label={label}` -- provides an accessible name describing the resizable area

## References

- WAI-ARIA Region Role: https://www.w3.org/TR/wai-aria-1.2/#region
- WAI-ARIA Authoring Practices - Window Splitter: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
