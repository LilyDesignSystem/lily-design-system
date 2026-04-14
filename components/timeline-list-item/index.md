# Timeline List Item

A timeline list item is a single entry within a TimelineList, rendered as a semantic `<li>` element. Each item typically contains a timestamp (via the `<time>` element) and a description of the event or milestone.

## Help

Use TimelineListItem for individual entries within a TimelineList. Common scenarios include project milestones, order status updates, activity feed entries, and historical events. Each item should represent a single event or point in time.

## Syntax

```html
<TimelineListItem>
  <!-- event content -->
</TimelineListItem>
```

## Usage

Timeline entry with semantic time element:

```html
<TimelineList label="Order history">
    <TimelineListItem>
        <time datetime="2024-01-15">January 15, 2024</time>
        <p>Order placed</p>
    </TimelineListItem>
    <TimelineListItem>
        <time datetime="2024-01-16">January 16, 2024</time>
        <p>Order shipped</p>
    </TimelineListItem>
</TimelineList>
```

Timeline entry with status data attribute for conditional styling:

```html
<TimelineListItem data-status="completed">
    <time datetime="2024-03-01T10:30">10:30 AM</time>
    <p>User completed onboarding</p>
</TimelineListItem>
```

## Props

| Prop           | Type            | Default    | Description                                          |
| -------------- | --------------- | ---------- | ---------------------------------------------------- |
| `children`     | `slot`       | (required) | Content for the timeline entry                       |
| `...restProps` | HTML attributes |            | Additional attributes spread onto the `<li>` element |

## Examples

Activity feed item:

```html
<TimelineListItem data-status="completed">
  <time datetime="2024-03-01T10:30">10:30 AM</time>
  <p>User completed onboarding</p>
</TimelineListItem>
```

## Keyboard Interactions

- None directly -- standard list item navigation by screen readers
- Tab moves focus between any interactive elements (links, buttons) within the item

## ARIA

- Semantic `<li>` element within an `<ol>` conveys ordered list item semantics
- Consumers should use `<time>` elements with `datetime` attributes for machine-readable dates
## When to Use

- Use inside TimelineList to represent one event or milestone with a date and description.
- Use when each entry represents a distinct point in time with a timestamp and description.
- Use for individual project milestones, order status updates, or activity feed entries.

## When Not to Use

- Do not use outside TimelineList -- it renders an `<li>` that requires an `<ol>` context.
- Do not use for chat messages -- use ChatMessage instead.
- Do not use for task items with checkboxes -- use CheckListItem or TaskListItem instead.

## Headless

This headless component provides a semantic `<li>` element for a single chronological entry within an ordered list. The consumer provides all content (timestamps, descriptions, icons) and all visual styling including markers, connectors, and layout.


## Styles

The consumer provides all CSS styling. The component renders with a `.timeline-list-item` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<li>` element with class `timeline-list-item`
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Give each item a clear visual marker (dot, icon, or number) and a prominent timestamp to reinforce the timeline sequence.
- **Developers**: Include `<time datetime="...">` elements for machine-readable dates. Use `data-*` attributes for status indicators that can drive conditional styling.

## Composition

TimelineListItem is a child of TimelineList, following the List/ListItem pattern. Each TimelineListItem represents one chronological event within the parent TimelineList container.

## References

- HTML `<li>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
- HTML `<time>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
