# TimelineList

## Metadata

- Component: timeline-list
- PascalCase: TimelineList
- Description: an ordered list of chronological events or milestones
- HTML tag: <ol>
- CSS class: .timeline-list
- Interactive: no

## Composition

- Pattern: List/ListItem
- Children: timeline-list-item

## Key Behaviors

- Renders an `<ol>` so screen readers announce the count and ordered position of each timeline event
- Children are `TimelineListItem` elements, each representing one chronological event
- Stateless wrapper — no scroll behaviour, expand/collapse, or filtering is included
- Spreads `restProps` onto the `<ol>`

## ARIA

- Semantic `<ol>` for ordered/chronological content
- `aria-label` provides accessible name for the list
- Consumers should use `<time>` elements with `datetime` attributes for machine-readable dates within items

## Keyboard

- None directly -- standard list navigation by screen readers
- Tab moves focus between any interactive elements (links, buttons) within timeline items

## Props

| Prop           | Type            | Default    | Description                                  |
| -------------- | --------------- | ---------- | -------------------------------------------- |
| `label`        | `string`        | (required) | Accessible label via `aria-label`            |
| `children`     | `slot`       | (required) | Timeline items (should be `<li>` elements)   |
| `...restProps` | HTML attributes |            | Additional attributes spread onto the `<ol>` |

## Acceptance Criteria

- [ ] Renders <ol> element with class="timeline-list"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .timeline-list in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/timeline-list.html
- HTML `<time>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
- WAI-ARIA list role: https://www.w3.org/TR/wai-aria-1.2/#list
