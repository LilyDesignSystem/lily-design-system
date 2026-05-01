# TourList

## Metadata

- Component: tour-list
- PascalCase: TourList
- Description: an ordered list of tour guide steps
- HTML tag: <ol>
- CSS class: .tour-list
- Interactive: yes

## Composition

- Pattern: Tour/List/ListItem
- Parent: tour
- Children: tour-list-item

## Key Behaviors

- Renders an `<ol>` so screen readers announce the count and ordered position of each tour step
- Children are `TourListItem` elements, each representing one step in the guided sequence
- Stateless — does not manage which step is active; consumer drives the highlight via props or classes
- Spreads `restProps` onto the `<ol>`

## ARIA

- `role="dialog"` -- identifies the tour overlay as a dialog window
- `aria-modal="true"` -- indicates the dialog is modal and content behind it is inert
- `aria-label={label}` -- provides an accessible name describing the tour
- `tabindex="-1"` -- allows the dialog element to receive focus for keyboard event handling

## Keyboard

- Escape: Closes the tour by setting `active` to false

## Props

| Prop           | Type            | Default    | Description                                                        |
| -------------- | --------------- | ---------- | ------------------------------------------------------------------ |
| `label`        | `string`        | (required) | Accessible name for the tour dialog via `aria-label`               |
| `active`       | `boolean`       | `false`    | Whether the tour is currently visible; bindable with two-way `active` binding |
| `children`     | `slot`       | (required) | Tour step content, navigation controls, and any additional UI      |
| `...restProps` | HTML attributes |            | Additional attributes spread onto the dialog `<div>`               |

## Acceptance Criteria

- [ ] Renders <ol> element with class="tour-list"
- [ ] Has aria-label attribute
- [ ] Has role="dialog"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tour-list in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tour-list.html
- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
