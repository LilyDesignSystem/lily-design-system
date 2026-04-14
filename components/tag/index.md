# Tag

A tag is a small component used to label, categorize, or indicate the status of an item. Tags are commonly used in content management systems, product listings, article metadata, and filtering interfaces to visually group or classify content. They typically display short text such as category names, keywords, status labels, or attribute values.

Tags help users quickly scan and identify relevant information, and are presented as inline elements alongside other content. This headless component renders as a `<span>` with `role="status"` and an accessible label, providing semantic structure for screen reader announcements while consumers apply their own visual styling.

## Implementation Notes

- Renders as a `<span>` element with `role="status"` and `aria-label`
- `role="status"` creates an implicit live region, so screen readers announce content changes
- All visible content is provided through the `children` slot
- Uses props for prop destructuring with rest props spread
- No hardcoded strings; all text comes through props for internationalization

## Props

- `label`: string (required) -- accessible label for screen readers via `aria-label`
- `children`: slot (required) -- the tag's visible content (text, etc.)
- `...restProps`: any -- additional HTML attributes spread onto the `<span>` element

## Usage

```html
<Tag label="Status: Completed">Completed</Tag>
```

```html
<Tag label="Status: Overdue">Overdue</Tag>
```

```html
<Tag label="Status: Active">Active</Tag>
```

```html
<Tag label="Status: Inactive">Inactive</Tag>
```

## Keyboard Interactions

- None -- tags are informational, not interactive

## ARIA

- `role="status"` -- identifies this as a live region for screen reader announcements of content changes
- `aria-label` -- provides an accessible name from the `label` prop, giving expanded context beyond the visible tag text

## When to Use

- Use when it is useful for users to know the status of an item, such as "Completed", "Active", or "Urgent"
- Use when items can have more than one status and users need to distinguish between them at a glance
- Use adjective-based labels (e.g. "Active", "Overdue") to avoid implying the tag is interactive
- Use within task lists, tables, or summary cards to communicate progress or state

## When Not to Use

- Do not use as interactive elements -- tags are read-only status indicators, not buttons or links
- Do not use when a single status is always the same for every item -- there is nothing to distinguish
- Do not use for categorisation or filtering labels -- use Badge instead for labelling and categorising
- Do not use too many statuses -- keep the number minimal so users can remember their meaning

## Headless

This headless component renders a `<span>` with `role="status"` and `aria-label`, creating an implicit live region for screen reader announcements. The consumer provides all visual styling including background color, border radius, padding, and typography.


## Styles

The consumer provides all CSS styling. The component renders with a `.tag` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<span>` element with class `tag`
- Verify role="status"` -- identifies this as a live region for screen reader announcements of content changes
- Verify aria-label` -- provides an accessible name from the `label` prop, giving expanded context beyond the visible tag text
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use color-coding consistently to distinguish tag categories, but do not rely on color alone -- include text labels. Keep tags compact with consistent padding and font size.
- **Developers**: Use the `label` prop to provide expanded context for screen readers beyond the visible tag text (e.g., `label="Priority: High"` with visible text "High"). Be aware that `role="status"` creates a live region, so dynamic content changes will be announced.

## Composition

Tag is designed to be used as a child of TagGroup. The TagGroup provides a `role="group"` container with an accessible label, while each Tag provides an individual labeled status element within the group.

## References

- WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status
