# Tag

A tag is a small component used to label, categorize, or indicate the status of an item. Tags are commonly used in content management systems, product listings, article metadata, and filtering interfaces to visually group or classify content. They typically display short text such as category names, keywords, status labels, or attribute values.

**Status:** stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.

Tags help users quickly scan and identify relevant information, and are presented as inline elements alongside other content. This headless component renders as a `<span>` whose accessible label is screen-reader text; set `live` for a tag whose text changes in place, which makes it a `role="status"` live region. Consumers apply their own visual styling.

## Implementation Notes

- Renders as a `<span>` element; not a live region by default (decided 2026-10-11: a page of static tags should not be a page of live regions)
- `aria-label` is not allowed on a plain `<span>`, so by default the `label` is screen-reader text (`<span class="screen-reader-span">`, which the themes hide) appended after the content; the content is never hidden, since it may hold a control such as a remove button
- `live`: renders `role="status"` with `aria-label`, for a tag whose text changes in place (a job's status)

- All visible content is provided through the `children` slot
- Uses props for prop destructuring with rest props spread
- No hardcoded strings; all text comes through props for internationalization

## Props

- `label`: string (required) -- accessible label for screen readers: screen-reader text by default, `aria-label` when `live`
- `live`: boolean (default false) -- render a `role="status"` live region
- `children`: slot (required) -- the tag's visible content (text, etc.)
- `...restProps`: any -- additional HTML attributes spread onto the `<span>` element

## Usage

```html
<Tag label="status">Completed</Tag>
```

```html
<Tag label="status">Overdue</Tag>
```

```html
<Tag label="status">Active</Tag>
```

```html
<Tag label="status">Inactive</Tag>
```

## Keyboard Interactions

- None -- tags are informational, not interactive

## ARIA

- Default: no role; the `label` is screen-reader text after the content, for context the visible text lacks (visible "High", label "priority": read as "High priority")
- With `live`: `role="status"` (a polite live region) and `aria-label` from the `label` prop

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

This headless component renders a `<span>` with its `label` as screen-reader text (a `role="status"` live region only with `live`). The consumer provides all visual styling including background color, border radius, padding, and typography.

## Styles

The consumer provides all CSS styling. The component renders with a `.tag` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<span>` element with class `tag`
- Verify there is no role by default, the `label` is screen-reader text after the content, and nothing inside is aria-hidden
- Verify `live` renders role="status" with aria-label
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use color-coding consistently to distinguish tag categories, but do not rely on color alone -- include text labels. Keep tags compact with consistent padding and font size.
- **Developers**: Use the `label` prop to provide expanded context for screen readers beyond the visible tag text (e.g., `label="priority"` with visible text "High", read as "High priority"); the label is added after the visible text, not instead of it. Set `live` only when the tag's text changes in place and the change should be announced: a live region on every static tag makes a list noisy.

## Composition

Tag is designed to be used as a child of TagGroup. The TagGroup provides a `role="group"` container with an accessible label, while each Tag provides an individually labelled item within the group.

## Related components

- `tag-group` — a group of tag elements
- `tag-input` — an input for adding and removing tags
- `badge` — a small label for counts, statuses, or categories
- `status-tag` — a tag showing the current status of a task

## References

- WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status

---

Lily™ and Lily Design System™ are trademarks.
