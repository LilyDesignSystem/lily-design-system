# AccordionListItem

## Metadata

- Component: accordion-list-item
- PascalCase: AccordionListItem
- Description: an accordion list item component
- Purpose: Holds one expandable section of an accordion, so a reader can open only what they need.
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <li>
- CSS class: .accordion-list-item
- Interactive: yes

## Composition

- Pattern: Nav/List/ListItem
- Parent: accordion-list

## Key Behaviors

- Renders an `<li>` element inside an `AccordionList`, holding a native `<details>`
- The consumer's `children` go inside the `<details>`: a `<summary>` (the header) and the content
- `open` is two-way bound to the `<details>` open state
- Spreads `restProps` onto the `<li>`

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
| `...restProps` | HTML attributes |            | Additional attributes passed to the `<li>` element                 |

## Native platform

- Decision: native
- Uses: <li> holding a <details>
- Could use: name attribute
- Notes: The <details> inside the <li> is the disclosure.
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Acceptance Criteria

- [ ] Renders <li> element with class="accordion-list-item"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Known limitations

Not in the Web Components catalog, by design. A custom element between an `<ol>` or `<ul>` and its `<li>` breaks the
content model, and the only form that avoids it, a customized built-in element, does not work in Safari. Without a
framework, write the native element with this component's class hook, or use the HTML catalog's markup. See
[the Web Components spec](https://github.com/LilyDesignSystem/lily-design-system/blob/main/lily-design-system-web-components-headless/spec/index.md).

## References

- Documentation: index.md
- CSS class: .accordion-list-item in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/accordion-list-item.html
- HTML details element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
- WAI-ARIA Accordion Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
