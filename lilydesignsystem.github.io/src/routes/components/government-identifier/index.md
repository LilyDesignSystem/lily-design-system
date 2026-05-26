# Government Identifier

A government identifier is a `<section>` placed at the bottom of a page
that identifies the parent agency, links to the agency's site, optionally
shows the agency logo and description, and exposes a `<nav>` of required
government links.

Use it on government and public-sector sites that must comply with parent
agency identification standards (e.g., 21st Century IDEA Act).

## Implementation Notes

- Uses a `<section>` element with `aria-label` to form a labeled region
- `label` prop is **required** — sets `aria-label` on the section
- `agencyName` prop is **required** — rendered inside the masthead
- When `agencyHref` is provided, the agency name is wrapped in an `<a>`
- Optional `logoUrl` + `logoAlt` render an `<img>` in the masthead
- Optional `description` renders a paragraph in the masthead
- Children render inside an inner `<nav class="government-identifier-links">` with `aria-label`

## Props

- `label`: string (**required**) -- aria-label for the section
- `agencyName`: string (**required**) -- parent agency name
- `agencyHref`: string (optional) -- link to the agency's site
- `logoUrl`: string (optional) -- agency logo src
- `logoAlt`: string (optional) -- agency logo alt text
- `description`: string (optional) -- agency description text
- `children`: slot -- required-links list content (typically a list of links)
- `...restProps`: any additional HTML attributes

## Usage

Identifier with logo, agency link, and required links:

```html
<GovernmentIdentifier
  label="Agency identifier"
  agencyName="General Services Administration"
  agencyHref="https://www.gsa.gov"
  logoUrl="/img/gsa-logo.svg"
  logoAlt="GSA logo"
  description="A U.S. General Services Administration website"
>
  <ul>
    <li><a href="/about">About this site</a></li>
    <li><a href="/accessibility">Accessibility statement</a></li>
    <li><a href="/foia">FOIA requests</a></li>
    <li><a href="/privacy">Privacy policy</a></li>
  </ul>
</GovernmentIdentifier>
```

## Keyboard Interactions

- Tab: moves focus through the agency link and child links
- All key handling is delegated to native interactive elements

## ARIA

- `<section>` with `aria-label` provides a labeled region landmark
- Inner `<nav>` with `aria-label` provides a labeled navigation landmark
- Image `alt` provides the logo's accessible text

## When to Use

- Use at the bottom of every page on a government website to identify the parent agency.
- Use to expose required government links (FOIA, accessibility, privacy, no-FEAR, etc.).

## When Not to Use

- Do not use on non-government sites — use a regular `Footer` instead.
- Do not use as the page's primary navigation.

## Headless

Renders the structural skeleton — `<section>` with masthead `<div>` and
required-links `<nav>` — wired with the correct ARIA. Visual layout,
columns, logo size, and link styling are entirely the consumer's
responsibility.

## Styles

Consumer CSS targets the `government-identifier` class plus the inner
`government-identifier-masthead`, `government-identifier-agency`,
`government-identifier-description`, and `government-identifier-links`
classes for fine-grained control.

## Testing

- Verify the component renders a `<section>` element with class `government-identifier`
- Verify `aria-label` is present and equals the `label` prop
- Verify `agencyName` is rendered in the masthead
- Verify the agency name is wrapped in an `<a>` when `agencyHref` is provided
- Verify the logo image renders only when `logoUrl` is provided
- Verify the description paragraph renders only when `description` is provided
- Verify children render inside the `<nav class="government-identifier-links">`
- Verify the inner `<nav>` has `aria-label` matching `label`
- Verify additional HTML attributes pass through to the root `<section>`

## Advice

- **Designers**: Keep the masthead layout consistent across all government sites in your portfolio. Treat the description as a single short sentence.
- **Developers**: Always pass an `<ul>` of required links as children. Always supply `logoAlt` when `logoUrl` is set.

## Related components

- `government-banner` — a banner identifying a website as belonging to a government, with an expandable details panel
- `organization` — an organization component that contains other organization-related information

## References

- US Web Design System Identifier: https://designsystem.digital.gov/components/identifier/
- 21st Century IDEA Act: https://www.congress.gov/bill/115th-congress/house-bill/5759
- WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
- WAI-ARIA navigation role: https://www.w3.org/TR/wai-aria-1.2/#navigation
