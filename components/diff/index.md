# Diff

A diff is a side-by-side comparison of two items, allowing users to visually identify differences between two versions of content. It is commonly used in code review tools, document comparison interfaces, version control systems, and before/after image comparisons.

This headless component uses a `<div>` element as the container for the two comparison panels. The consumer provides the two items to compare as children.

## Implementation Notes

- Renders a `<div>` element as the comparison container
- `role="group"` with `aria-label` identifies the comparison region
- Consumer provides two child elements representing the items to compare
- Supports labeling each side (e.g., "Before" and "After", "Original" and "Modified")
- Spreads `restProps` onto the `<div>` for consumer customization

## Props

- `label`: string (required) -- accessible name describing the comparison (e.g., "Code comparison")
- `children`: slot (required) -- two child elements representing the items to compare
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

Basic side-by-side comparison:

```html
<Diff label="Code comparison">
  <div>Original content here</div>
  <div>Modified content here</div>
</Diff>
```

Before/after image comparison:

```html
<Diff label="Image comparison">
  <figure>
    <img src="before.jpg" alt="Before redesign" />
    <figcaption>Before</figcaption>
  </figure>
  <figure>
    <img src="after.jpg" alt="After redesign" />
    <figcaption>After</figcaption>
  </figure>
</Diff>
```

## Keyboard Interactions

- Tab: Focus moves between interactive elements within the comparison panels
- (Keyboard interactions depend on the content placed within the diff panels)

## ARIA

- `role="group"` with `aria-label` identifies the comparison region
- Each side can use `aria-label` to describe its role (e.g., "Original", "Modified")
- Screen readers announce the group label to provide context for the comparison

## When to Use

- Use for comparing two versions of text, code, images, or other content side by side.
- Use in code review interfaces to show changes between file versions.
- Use for before/after comparisons in design tools or content editing.
- Avoid for displaying a single item -- use a standard content container instead.
- Consider DataTable instead when comparing structured data across multiple rows and columns.

## When Not to Use

- Do not use to display a single item — use a standard content container instead.
- Do not use when comparing structured data across many rows and columns — use `DataTable` so users can sort and scan.
- Do not use for displaying merged or already-resolved content — `Diff` is for showing the comparison itself, not the result.
- Do not use as a navigation pattern between two pages — use `BreadcrumbNav` or page links.

## Headless

This component provides a `<div>` with `role="group"` and `aria-label` for the comparison container, with zero visual styling. The consumer is responsible for all CSS including side-by-side layout, panel widths, divider styling, highlighting of differences, scroll synchronization, and responsive behavior.

## Styles

The consumer provides all CSS styling. The component renders with a `.diff` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `diff`
- Verify `role="group"` with `aria-label` for the comparison region
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use clear visual separation between the two panels (e.g., a vertical divider). Highlight additions, deletions, and modifications with distinct colors. Ensure responsive behavior for narrow viewports, such as stacking panels vertically.
- **Developers**: Always provide a descriptive `label` prop for the comparison group. Label each side clearly so screen reader users understand which content is the original and which is the modified version.

## Related components

- `code-block` — a block of formatted code with optional line numbers and line highlighting
- `table` — a table with rows and columns <table>

## References

- WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group

---

Lily™ and Lily Design System™ are trademarks.
