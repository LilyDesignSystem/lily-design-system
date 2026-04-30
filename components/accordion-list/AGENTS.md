# accordion list

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

## ARIA

- Semantic `<ol>` element provides ordered list semantics for assistive technology
- List structure conveys that the accordion sections are related and ordered

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
