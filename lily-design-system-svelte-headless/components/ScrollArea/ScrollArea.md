# ScrollArea

ScrollArea is a headless scrollable container that provides keyboard accessibility for overflowing content. It renders a focusable region so keyboard users can scroll through content using standard scrolling keys without needing a mouse.

Use ScrollArea when you have content that may overflow its container, such as long lists, code blocks, chat messages, or data tables. The component provides the semantic structure and keyboard focus needed for accessible scrolling, while the consumer controls all visual styling including overflow behavior, dimensions, and scrollbar appearance.

## Implementation Notes

- Renders a `<div>` element with `role="region"` to create an accessible landmark
- Sets `tabindex="0"` to make the container focusable, enabling keyboard scrolling (arrow keys, Page Up/Down, Home/End)
- Consumer must apply CSS `overflow` and dimension properties to enable actual scrolling behavior
- Spreads `restProps` onto the div for consumer customization
- Uses Svelte 5 `$props()` with TypeScript typing

## Props

- `label`: string (required) -- accessible label for the scrollable region, applied via `aria-label`
- `children`: Snippet (required) -- scrollable content to render inside the container
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```svelte
<ScrollArea label="Scrollable content">
  <p>Long content...</p>
</ScrollArea>
```

## Keyboard Interactions

- Tab: Moves focus to the scroll area container
- Arrow Up / Arrow Down: Scrolls content vertically (native browser behavior when focused)
- Arrow Left / Arrow Right: Scrolls content horizontally (native browser behavior when focused)
- Page Up / Page Down: Scrolls content by one page (native browser behavior when focused)
- Home / End: Scrolls to the beginning or end of content (native browser behavior when focused)

## ARIA

- `role="region"` -- identifies the container as a landmark region so assistive technologies can announce it
- `aria-label={label}` -- provides an accessible name describing what content is scrollable

## References

- WAI-ARIA Region Role: https://www.w3.org/TR/wai-aria-1.2/#region
- WCAG 2.1 Reflow: https://www.w3.org/WAI/WCAG21/Understanding/reflow.html
