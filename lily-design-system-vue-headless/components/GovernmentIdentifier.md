# GovernmentIdentifier

An identifier section with a parent agency logo, agency name, and required government links. Renders `<section class="government-identifier">` with a masthead area and a nested `<nav>` for required links.

## Implementation Notes

- Headless: no CSS, no styles
- `label` and `agencyName` are **required**
- Agency name is wrapped in `<a>` only when `agencyHref` is provided
- The required-links `<nav>` carries the same `aria-label` for screen readers

## Props

- `label`: string (**required**) — aria-label for the section and nav
- `agencyName`: string (**required**)
- `agencyHref`: string (optional)
- `logoUrl`: string (optional)
- `logoAlt`: string (optional)
- `description`: string (optional)
- default slot — required-links content (typically a `<ul>` of links)

## Usage

```vue
<GovernmentIdentifier
    label="Agency identifier"
    agencyName="General Services Administration"
    agencyHref="https://gsa.gov"
    logoUrl="/gsa.svg"
    logoAlt="GSA logo"
    description="An official website of the GSA"
>
    <ul>
        <li><a href="/about">About</a></li>
        <li><a href="/foia">FOIA requests</a></li>
    </ul>
</GovernmentIdentifier>
```

## ARIA

- `<section>` provides a region landmark with `aria-label`
- Inner `<nav>` provides a navigation landmark with `aria-label`

## When to Use

- At the bottom of any government website to identify the parent agency and required links

## Headless

No CSS is provided. The consumer styles the masthead, logo, and link list.

## Testing

- Verify root `government-identifier` class
- Verify region landmark with aria-label
- Verify agency name renders as link only when href is provided
- Verify image renders only when logoUrl is provided
- Verify nav landmark with aria-label
- Verify slot children render in the nav

## References

- [USWDS Identifier](https://designsystem.digital.gov/components/identifier/)
