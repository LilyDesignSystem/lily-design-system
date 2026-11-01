# TourList

## Metadata

- Component: tour-list
- PascalCase: TourList
- Description: an ordered list of tour guide steps
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <ol>
- CSS class: .tour-list
- Interactive: yes

## Composition

- Pattern: Tour/List/ListItem
- Parent: tour
- Children: tour-list-item

## Key Behaviors

- Renders an `<ol>` so screen readers announce the count and ordered position of each tour step
- Is a list, not a dialog: no `role="dialog"` (it would replace the list role) and no `aria-modal`
- Rendered while `active` is true; Escape sets `active` to `false`
- Children are `TourListItem` elements, each representing one step in the guided sequence
- Stateless — does not manage which step is active; consumer drives the highlight via props or classes
- Spreads `restProps` onto the `<ol>`

## ARIA

- implicit `list` role from the `<ol>` (no `role="dialog"`, no `aria-modal`)
- `aria-label={label}` -- provides an accessible name for the list of steps
- `tabindex="-1"` -- lets the list take focus for keyboard event handling

## Keyboard

- Escape: Closes the tour by setting `active` to false

## Props

| Prop           | Type            | Default    | Description                                                                   |
| -------------- | --------------- | ---------- | ----------------------------------------------------------------------------- |
| `label`        | `string`        | (required) | Accessible name for the list via `aria-label`                                 |
| `active`       | `boolean`       | `false`    | Whether the tour is currently visible; bindable with two-way `active` binding |
| `children`     | `slot`          | (required) | Tour step content, navigation controls, and any additional UI                 |
| `...restProps` | HTML attributes |            | Additional attributes spread onto the `<ol>`                                  |

## Modality

- Decision (P18-T6): **not a dialog**. TourList is the ordered list of steps inside `tour`. `role="dialog"` on the `<ol>` removed its list semantics, and with `aria-modal="true"` it double-declared a (false) modal dialog inside `tour`. Both are removed. Any dialog semantics belong to `tour`, which is non-modal.

## Native platform

- Decision: hand-rolled because it is a list of steps, not a dialog: modality, if any, belongs to tour, which is non-modal
- Uses: <ol> (no role, no aria-modal)
- Could use: <dialog> showModal() wrapping the <ol>
- Notes: P18-T6: role="dialog" and aria-modal="true" removed, so the <ol> keeps its list semantics (step count and position) and no longer double-declares a dialog inside tour.
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Acceptance Criteria

- [ ] Renders <ol> element with class="tour-list"
- [ ] Has aria-label attribute
- [ ] Has no role="dialog" and no aria-modal (keeps list semantics)
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tour-list in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tour-list.html
- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
