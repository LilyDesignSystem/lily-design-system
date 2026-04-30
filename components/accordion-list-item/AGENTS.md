# AccordionListItem

## Metadata

- Component: accordion-list-item
- PascalCase: AccordionListItem
- Description: an accordion list item component
- HTML tag: <li>
- CSS class: .accordion-list-item
- Interactive: yes

## Composition

- Pattern: Nav/List/ListItem
- Parent: accordion-list

## ARIA

- Native `<details>` / `<summary>` provide implicit disclosure widget semantics
- Browser automatically manages expanded/collapsed state announcement

## Keyboard

- Tab: Focus the summary element
- Enter / Space: Toggle open/close (browser default for `<details>`)

## Props

| Prop           | Type            | Default    | Description                                                        |
| -------------- | --------------- | ---------- | ------------------------------------------------------------------ |
| `summary`      | `string`        | (required) | Text for the summary/header line                                   |
| `open`         | `boolean`       | `false`    | Whether the item is expanded; bindable with two-way `open` binding |
| `children`     | `slot`          | (required) | Detail content rendered when expanded                              |
| `...restProps` | HTML attributes |            | Additional attributes passed to the `<details>` element            |

## Acceptance Criteria

- [ ] Renders <li> element with class="accordion-list-item"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .accordion-list-item in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/accordion-list-item.html
- HTML details element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
- WAI-ARIA Accordion Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
