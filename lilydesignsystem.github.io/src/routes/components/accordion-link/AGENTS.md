# AccordionLink

## Metadata

- Component: accordion-link
- PascalCase: AccordionLink
- Description: an accordion link
- Purpose: Names one section of an accordion as a link to its own page, so the section can be bookmarked and shared.
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
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

## Known limitations

### Disabled links and link look-alikes

A link has no disabled state: the `disabled` attribute has no effect. Prefer not rendering an unavailable link. When the unavailable item must remain visible, set `aria-disabled="true"`, omit `href` (or guard every pointer and keyboard activation if the URL must remain), and use `tabindex="-1"` so it is not a misleading tab stop. Add `role="link"` when an anchor without `href` must retain link semantics.

Use a native `<button>` for an action. Styling an anchor as a button does not give it button keyboard or disabled behavior.

## References

- Documentation: index.md
- CSS class: .accordion-link in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/accordion-link.html
- WAI-ARIA Accordion Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
