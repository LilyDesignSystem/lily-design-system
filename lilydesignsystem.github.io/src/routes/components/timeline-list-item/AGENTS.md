# TimelineListItem

## Metadata

- Component: timeline-list-item
- PascalCase: TimelineListItem
- Description: one event in a timeline list
- HTML tag: <li>
- CSS class: .timeline-list-item
- Interactive: no

## Composition

- Pattern: List/ListItem
- Parent: timeline-list

## Key Behaviors

- Renders an `<li>` inside a `TimelineList`, representing one event in the chronological sequence
- Children typically include a date/time element, a title, and supporting content composed by the consumer
- For dates, prefer wrapping the timestamp in a `<time datetime="...">` element so the date is machine-readable
- Spreads `restProps` onto the `<li>`

## ARIA

- Semantic `<li>` element within an `<ol>` conveys ordered list item semantics
- Consumers should use `<time>` elements with `datetime` attributes for machine-readable dates

## Keyboard

- None directly -- standard list item navigation by screen readers
- Tab moves focus between any interactive elements (links, buttons) within the item

## Props

| Prop           | Type            | Default    | Description                                          |
| -------------- | --------------- | ---------- | ---------------------------------------------------- |
| `children`     | `slot`       | (required) | Content for the timeline entry                       |
| `...restProps` | HTML attributes |            | Additional attributes spread onto the `<li>` element |

## Acceptance Criteria

- [ ] Renders <li> element with class="timeline-list-item"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .timeline-list-item in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/timeline-list-item.html
- HTML `<li>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
- HTML `<time>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
