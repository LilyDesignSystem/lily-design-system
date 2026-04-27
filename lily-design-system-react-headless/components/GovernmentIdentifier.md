# GovernmentIdentifier

An identifier section that anchors a government site to its parent agency, with optional logo, agency name, description, and a nested navigation of required links. Inspired by the USWDS Identifier component.

## Implementation Notes

- Root element is `<section>` with `aria-label`
- Required-links region is a nested `<nav>` (rendered only when `children` are supplied)
- Logo `<img>` renders only when `logoUrl` is provided
- Agency name is wrapped in `<a>` only when `agencyHref` is provided

## Props

- `label`: string (**required**) — `aria-label` for the section and the nested `<nav>`
- `agencyName`: string (**required**) — parent agency name
- `agencyHref`: string (optional) — when provided, agency name is wrapped in `<a>`
- `logoUrl`: string (optional) — agency logo image src
- `logoAlt`: string (optional) — logo alt text
- `description`: string (optional) — agency description text
- `children`: ReactNode (optional) — required-links list content
- `className`: string (optional) — appended after the root `government-identifier` class
- `...restProps`: any additional HTML attributes passed to the `<section>`

## Usage

```tsx
<GovernmentIdentifier
  label="Agency identifier"
  agencyName="General Services Administration"
  agencyHref="https://gsa.gov"
  logoUrl="/gsa-logo.svg"
  logoAlt="GSA logo"
  description="An official website of the GSA."
>
  <ul>
    <li><a href="/about">About</a></li>
    <li><a href="/accessibility">Accessibility</a></li>
    <li><a href="/foia">FOIA</a></li>
  </ul>
</GovernmentIdentifier>
```

## ARIA

- `<section>` region with `aria-label`
- Nested `<nav>` with matching `aria-label` for required links
- Logo image alt text supplied via `logoAlt`

## References

- [USWDS Identifier](https://designsystem.digital.gov/components/identifier/)
