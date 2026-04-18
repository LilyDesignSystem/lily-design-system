# TimelineListItem

A timeline list item is a single event entry within a TimelineList. It renders a semantic `<li>` element with an optional `<time>` element for machine-readable dates and a heading for the visible date text, followed by descriptive content provided through the children snippet.

Used for project milestones, activity feeds, order histories, or any chronological sequence of events. The component supports both dated events (with `datetime` and `heading` props) and undated entries (children only).

## Implementation Notes

- Renders as `<li>` for proper semantics within a TimelineList `<ol>`
- Optionally renders a `<time>` element when `datetime` or `heading` is provided
- The `datetime` prop provides a machine-readable ISO date string
- The `heading` prop provides the visible human-readable date text
- Spreads `...restProps` on the root `<li>` element
- Compound component: must be used inside a TimelineList

## Props

- `datetime`: string (default: "") -- ISO date/time string for the `<time>` element
- `heading`: string (default: "") -- visible date/time text inside the `<time>` element
- `children`: Snippet (required) -- event description content
- `...restProps`: Any additional HTML attributes spread onto the `<li>`

## Usage

```svelte
<TimelineList label="Order history">
  <TimelineListItem datetime="2024-01-15" heading="January 15, 2024">
    Order placed
  </TimelineListItem>
  <TimelineListItem datetime="2024-01-16" heading="January 16, 2024">
    Order shipped
  </TimelineListItem>
  <TimelineListItem datetime="2024-01-19" heading="January 19, 2024">
    Order delivered
  </TimelineListItem>
</TimelineList>
```

Without dates:

```svelte
<TimelineList label="Status updates">
  <TimelineListItem>Pending review</TimelineListItem>
  <TimelineListItem>Approved</TimelineListItem>
</TimelineList>
```

## Keyboard Interactions

- None directly -- standard list item with no interactive behavior

## ARIA

- Semantic `<li>` provides list item semantics within the parent `<ol>`
- `<time>` element with `datetime` attribute provides machine-readable date
- Screen readers announce list position from the parent `<ol>`

## References

- HTML `<time>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
- WAI-ARIA listitem role: https://www.w3.org/TR/wai-aria-1.2/#listitem
