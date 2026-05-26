# AccordionList

## Metadata

- Component: accordion-list
- PascalCase: AccordionList
- Description: an accordion ordered list of list item components
- HTML tag: <ol>
- CSS class: .accordion-list
- Interactive: no

## Composition

- Pattern: Nav/List/ListItem
- Parent: accordion-nav
- Children: accordion-list-item

## Key Behaviors

- Renders an `<ol>` element so screen readers announce the count and ordered position of each accordion section
- Children are `AccordionListItem` elements, each wrapping one collapsible section
- Spreads `restProps` onto the `<ol>` so consumers can attach arbitrary attributes
- No state of its own — each child item manages its own open/closed state

## ARIA

- Semantic `<ol>` element provides ordered list semantics for assistive technology
- List structure conveys that the accordion sections are related and ordered

## Keyboard

- No keyboard interactions — this is a passive element

## Props

| Prop           | Type            | Default    | Description                                          |
| -------------- | --------------- | ---------- | ---------------------------------------------------- |
| `children`     | `slot`          | (required) | AccordionListItem elements to render inside the list |
| `...restProps` | HTML attributes |            | Additional attributes spread onto the `<ol>` element |

## Acceptance Criteria

- [ ] Renders <ol> element with class="accordion-list"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .accordion-list in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/accordion-list.html
- WAI-ARIA Accordion Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
- HTML `<ol>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol
