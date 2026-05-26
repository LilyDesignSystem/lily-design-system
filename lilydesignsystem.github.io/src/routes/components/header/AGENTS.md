# Header

## Metadata

- Component: header
- PascalCase: Header
- Description: a page or section header area
- HTML tag: <header>
- CSS class: .header
- Interactive: no

## Key Behaviors

- Renders a single `<header>` element as a semantic landmark
- Uses an optional `aria-label` to provide an accessible name, which is helpful when a page has multiple header regions
- Uses slot for the `children` prop
- Spreads `restProps` onto the header element for consumer extensibility

## ARIA

- `aria-label={label}` -- optionally provides an accessible name for the header landmark, useful when multiple headers exist on a page to help screen reader users distinguish between them
- The `<header>` element implicitly has `role="banner"` when it is a direct child of `<body>`, providing a page-level landmark

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (default: undefined) -- optional accessible name applied via `aria-label`, useful for distinguishing multiple headers
- `children`: slot (required) -- content rendered inside the header element
- `...restProps`: unknown -- additional attributes spread onto the header element

## Acceptance Criteria

- [ ] Renders <header> element with class="header"
- [ ] Has aria-label attribute
- [ ] Has role="banner"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .header in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/header.html
- MDN header element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header
- WAI-ARIA Banner Landmark: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
