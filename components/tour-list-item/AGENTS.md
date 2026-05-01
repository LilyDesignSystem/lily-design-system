# TourListItem

## Metadata

- Component: tour-list-item
- PascalCase: TourListItem
- Description: one step in a tour guide list
- HTML tag: <li>
- CSS class: .tour-list-item
- Interactive: no

## Composition

- Pattern: Tour/List/ListItem
- Parent: tour-list

## Key Behaviors

- Renders an `<li>` inside a `TourList`, representing one step of the tour
- Children include the step content (heading, description, illustration) composed by the consumer
- The consumer marks the active step using `aria-current="step"` or a class hook for styling
- Spreads `restProps` onto the `<li>`

## ARIA

- `role="group"` -- groups the step content semantically
- `aria-roledescription="step"` -- identifies the element as a tour step
- `aria-label` -- provides an accessible name, optionally including "Step N of M"
- `aria-current="step"` -- indicates the currently active step
- `aria-hidden="true"` -- hides inactive steps from assistive technology
- `hidden` -- hides inactive steps from visual rendering

## Keyboard

- None directly -- keyboard interactions are managed by the parent TourGuideList and by interactive elements within step content

## Props

| Prop           | Type            | Default    | Description                                             |
| -------------- | --------------- | ---------- | ------------------------------------------------------- |
| `label`        | `string`        | (required) | Accessible name for this step via `aria-label`          |
| `current`      | `boolean`       | `false`    | Whether this step is the currently visible step         |
| `stepNumber`   | `number`        | (optional) | 1-based step number (e.g. 1, 2, 3)                      |
| `totalSteps`   | `number`        | (optional) | Total number of steps in the tour                       |
| `children`     | `slot`       | (required) | Step content                                            |
| `...restProps` | HTML attributes |            | Additional attributes spread onto the container `<div>` |

## Acceptance Criteria

- [ ] Renders <li> element with class="tour-list-item"
- [ ] Has aria-label attribute
- [ ] Has role="group"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tour-list-item in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tour-list-item.html
- WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group
- WAI-ARIA aria-roledescription: https://www.w3.org/TR/wai-aria-1.2/#aria-roledescription
- WAI-ARIA aria-current: https://www.w3.org/TR/wai-aria-1.2/#aria-current
