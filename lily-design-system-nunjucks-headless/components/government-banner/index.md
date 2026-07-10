# GovernmentBanner

a banner identifying a website as belonging to a government, with an
expandable details panel

## Description

GovernmentBanner is an `<aside>` complementary landmark with a short
identifying headline and a toggle button that reveals an expandable
details panel. The headless component manages the ARIA contract; the
consumer wires up the click toggle behaviour.

This component is inspired by the U.S. Web Design System (USWDS)
banner pattern.

## HTML tag

`<aside>`

## CSS class

`government-banner`

## Params

- `label` — string. **Required.** `aria-label` for the banner section.
- `headerText` — string. **Required.** Top headline text.
- `expandLabel` — string. **Required.** Toggle button text.
- `expanded` — boolean. Default `false`. Whether the details panel is open.
- `panelId` — string. Optional id for the details panel; defaults to
  `government-banner-details`.
- `text` — string. Optional escaped fallback text inside the panel.
- `html` — string. Raw HTML for the panel content.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/government-banner/macro.njk" import governmentBanner %}

{% call governmentBanner({
  label: "Official government website",
  headerText: "An official website of the United States government",
  expandLabel: "Here's how you know",
  expanded: false
}) %}
  <p>The .gov means it's official.</p>
  <p>Secure .gov websites use HTTPS.</p>
{% endcall %}
```

## Accessibility

- `<aside>` is a complementary landmark when `aria-label` is supplied.
- Toggle button uses `aria-expanded` (`"true"` or `"false"`) and
  `aria-controls` pointing at the panel `id`.
- Details panel uses the `hidden` attribute when collapsed.

## Behaviour

This is a headless component — clicking the toggle button does
nothing on its own. The consumer attaches a click handler that
re-renders (or toggles) `expanded` and updates the DOM.

## Headless

No CSS or JavaScript bundled. Sub-element classes
(`government-banner-header`, `government-banner-header-text`,
`government-banner-toggle`, `government-banner-details`) are
provided as styling hooks only.

## Testing

`components/government-banner/macro.test.js` verifies the base class,
`aria-label`, `aria-expanded`, `aria-controls`, panel `hidden`
attribute, and prop pass-through.

## References

- [USWDS: Banner](https://designsystem.digital.gov/components/banner/)
- [WAI-ARIA: aria-expanded](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded)

---

Lily™ and Lily Design System™ are trademarks.
