# AccordionLink

## Metadata

- Component: accordion-link
- PascalCase: AccordionLink
- Description: an accordion link
- HTML tag: <a>
- CSS class: .accordion-link
- Interactive: yes

## Composition

- Pattern: Nav/List/ListItem
- Parent: accordion-list-item

## Key Behaviors

- Renders as a semantic `<a>` element for accordion navigation
- Designed to be used inside an AccordionListItem
- Supports an optional `aria-label` override for more descriptive screen reader text
- All link text is provided through the children slot
- Spreads `...restProps` onto the `<a>` element

## ARIA

- Implicit `link` role from the `<a>` element
- `aria-label` -- optional override for descriptive screen reader text, set from the `label` prop

## Keyboard

- Tab: Focus the link
- Enter: Activate the link (browser default)

## Props

- `href`: string (required) -- the URL to navigate to
- `label`: string (optional, default: undefined) -- accessible label override via `aria-label`
- `children`: slot (required) -- the link text/content
- `...restProps`: Any additional HTML attributes spread onto the `<a>`

## Acceptance Criteria

- [ ] Renders <a> element with class="accordion-link"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .accordion-link in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/accordion-link.html
- WAI-ARIA Accordion Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
