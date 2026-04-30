# GovernmentIdentifier

## Metadata

- Component: government-identifier
- PascalCase: GovernmentIdentifier
- Description: an identifier section with a parent agency logo, agency name, and required government links
- HTML tag: <section>
- CSS class: .government-identifier
- Interactive: no (children may be interactive)

## Key Behaviors

- Renders a `<section>` with class `government-identifier` and `aria-label`
- `label` prop is REQUIRED and sets `aria-label`
- `agencyName` prop is REQUIRED and rendered inside the masthead
- When `agencyHref` is provided, agency name is wrapped in an `<a>`
- Optional `logoUrl` + `logoAlt` render an `<img>` in the masthead
- Optional `description` renders a paragraph in the masthead
- Children render inside `<nav class="government-identifier-links">` with `aria-label`

## ARIA

- `<section>` with `aria-label` -- labeled region landmark
- Inner `<nav>` with `aria-label` -- labeled navigation landmark
- Image `alt` provides accessible text for the logo

## Keyboard

- Tab: moves focus through the agency link and child links
- All key handling is delegated to native interactive elements

## Props

- `label`: string (REQUIRED) -- aria-label for the section
- `agencyName`: string (REQUIRED) -- parent agency name
- `agencyHref`: string (optional) -- agency site link
- `logoUrl`: string (optional) -- logo src
- `logoAlt`: string (optional) -- logo alt
- `description`: string (optional) -- description text
- `children`: slot -- required-links list content
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <section> with class="government-identifier"
- [ ] aria-label on the section equals the label prop
- [ ] agencyName is rendered in the masthead
- [ ] Agency name is wrapped in <a> when agencyHref is provided
- [ ] Logo image renders only when logoUrl is provided
- [ ] Description paragraph renders only when description is provided
- [ ] Children render inside <nav class="government-identifier-links">
- [ ] Inner <nav> has aria-label matching label
- [ ] Additional HTML attributes pass through to the root element
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .government-identifier in css-style-sheet-template.css
- US Web Design System Identifier: https://designsystem.digital.gov/components/identifier/
- WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
