# Tag

A tag is a small component used to label, categorize, or indicate the status of an item. Tags are commonly used in content management systems, product listings, article metadata, and filtering interfaces to visually group or classify content. They typically display short text such as category names, keywords, status labels, or attribute values.

Tags help users quickly scan and identify relevant information, and are presented as inline elements alongside other content. This headless component renders as a `<span>` with `role="status"` and an accessible label, providing semantic structure for screen reader announcements while consumers apply their own visual styling.

## Implementation Notes

- Renders as a `<span>` element with `role="status"` and `aria-label`
- `role="status"` creates an implicit live region, so screen readers announce content changes
- All visible content is provided through the `children` snippet
- Uses Svelte 5 `$props()` for prop destructuring with rest props spread
- No hardcoded strings; all text comes through props for internationalization

## Props

- `label`: string (required) -- accessible label for screen readers via `aria-label`
- `children`: Snippet (required) -- the tag's visible content (text, etc.)
- `...restProps`: any -- additional HTML attributes spread onto the `<span>` element

## Usage

```svelte
<Tag label="Category">Design</Tag>
```

```svelte
<Tag label="Status">Active</Tag>
```

```svelte
<Tag label="Priority: High">High</Tag>
```

## Keyboard Interactions

- None -- tags are informational, not interactive

## ARIA

- `role="status"` -- identifies this as a live region for screen reader announcements of content changes
- `aria-label` -- provides an accessible name from the `label` prop, giving expanded context beyond the visible tag text

## References

- WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status
