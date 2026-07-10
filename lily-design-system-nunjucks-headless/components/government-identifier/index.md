# GovernmentIdentifier

an identifier section with a parent agency logo, agency name, and
required government links

## Description

GovernmentIdentifier is a `<section>` region landmark that displays
the parent agency's logo, name, optional description, and a list of
required government links (FOIA, Privacy, Accessibility, etc.).

This component is inspired by the U.S. Web Design System (USWDS)
identifier pattern.

## HTML tag

`<section>`

## CSS class

`government-identifier`

## Params

- `label` — string. **Required.** `aria-label` for the section and
  the inner `<nav>` of required links.
- `agencyName` — string. **Required.** Parent agency name.
- `agencyHref` — string. When provided, agency name is wrapped in an
  `<a>`.
- `logoUrl` — string. Agency logo image src.
- `logoAlt` — string. Logo alt text.
- `description` — string. Agency description text.
- `text` — string. Optional fallback text inside the nav.
- `html` — string. Raw HTML for the required-links nav.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/government-identifier/macro.njk" import governmentIdentifier %}

{% call governmentIdentifier({
  label: "Agency identifier",
  agencyName: "U.S. General Services Administration",
  agencyHref: "https://www.gsa.gov",
  logoUrl: "/logo.svg",
  logoAlt: "GSA logo",
  description: "An independent agency"
}) %}
  <ul>
    <li><a href="/about">About</a></li>
    <li><a href="/foia">FOIA requests</a></li>
    <li><a href="/accessibility">Accessibility statement</a></li>
  </ul>
{% endcall %}
```

## Accessibility

- `<section>` with `aria-label` is a region landmark.
- Inner `<nav>` is a navigation landmark, also named via `aria-label`.
- Logo `<img>` requires an `alt` attribute (defaults to empty for
  decorative use, but supplying meaningful `logoAlt` is encouraged).

## Headless

No CSS or JavaScript bundled. Sub-element classes
(`government-identifier-masthead`, `government-identifier-logo`,
`government-identifier-agency`, `government-identifier-description`,
`government-identifier-links`) are styling hooks only.

## Testing

`components/government-identifier/macro.test.js` verifies the base
class, `aria-label`, optional logo and description, conditional `<a>`
on the agency name, nav landmark, and prop pass-through.

## References

- [USWDS: Identifier](https://designsystem.digital.gov/components/identifier/)

---

Lily™ and Lily Design System™ are trademarks.
