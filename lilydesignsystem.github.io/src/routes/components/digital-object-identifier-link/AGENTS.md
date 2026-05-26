# DigitalObjectIdentifierLink

## Metadata

- Component: digital-object-identifier-link
- PascalCase: DigitalObjectIdentifierLink
- Description: a permanent hyperlink for a Digital Object Identifier (DOI) to an electronic source
- HTML tag: <a>
- CSS class: .digital-object-identifier-link
- Interactive: yes

## Key Behaviors

- Renders an `<a>` element for hyperlink semantics
- Constructs the `href` from the DOI using the `https://doi.org/` resolver prefix
- `rel="noopener noreferrer"` for security when opening external links
- Consumer provides the display text as children, or the DOI is displayed by default
- Spreads `restProps` onto the `<a>` for consumer customization

## ARIA

- Implicit `link` role from `<a>` element with `href`
- `aria-label` can be provided via restProps for additional context

## Keyboard

- Tab: Focus the link
- Enter: Activate the link and navigate to the DOI URL

## Props

- `doi`: string (required) -- the Digital Object Identifier (e.g., "10.1000/xyz123")
- `children`: slot (optional) -- link display text; defaults to the DOI string if not provided
- `...restProps`: unknown -- additional attributes spread onto the `<a>` element

## Acceptance Criteria

- [ ] Renders <a> element with class="digital-object-identifier-link"
- [ ] href is correctly constructed from the DOI
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .digital-object-identifier-link in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/digital-object-identifier-link.html
- DOI Handbook: https://www.doi.org/hb.html
