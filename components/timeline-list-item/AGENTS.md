# TimelineListItem

## Metadata

- Component: timeline-list-item
- PascalCase: TimelineListItem
- Description: one event in a timeline list
- Purpose: Holds one event on a timeline.
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
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

| Prop              | Type                                 | Default    | Description                                                                                                                                                                                                                                                   |
| ----------------- | ------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`        | `slot`                               | (required) | Content for the timeline entry                                                                                                                                                                                                                                |
| `datetime`        | `string`                             | `""`       | ISO date or time for the `<time>` element                                                                                                                                                                                                                     |
| `heading`         | `string`                             | `""`       | Visible date or time text for the `<time>` element                                                                                                                                                                                                            |
| `entryState`      | `"withheld"` \| `"entered-in-error"` |            | A withheld entry keeps its date and shows only `entryStateLabel`; one entered in error keeps its content struck through in `<del class="timeline-list-item-entry">`, with `entryStateLabel`. Rendered as `data-entry-state`; neither is ever silently removed |
| `entryStateLabel` | `string`                             |            | That state in the consumer's words, in `-entry-state`; required with `entryState` (a development warning says so)                                                                                                                                             |
| `...restProps`    | HTML attributes                      |            | Additional attributes spread onto the `<li>` element                                                                                                                                                                                                          |

## Acceptance Criteria

- [ ] Renders <li> element with class="timeline-list-item"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .timeline-list-item in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/timeline-list-item.html
- HTML `<li>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
- HTML `<time>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
