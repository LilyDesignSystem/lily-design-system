# Government Banner

A government banner is an `<aside>` placed at the very top of a page that
identifies the website as belonging to a government, with an expandable
details panel typically explaining the `.gov` domain and HTTPS lock icon.

Use it on government and public-sector sites that need to clearly signal
official status to visitors and provide trust context on demand.

## Implementation Notes

- Uses an `<aside>` element so it is announced as a complementary landmark
- `label` prop is **required** — sets `aria-label` on the `<aside>`
- `headerText` prop is **required** — the always-visible top headline
- `expandLabel` prop is **required** — text on the toggle button
- `expanded` prop controls whether the details panel is visible
- The toggle `<button>` has `aria-expanded` and `aria-controls` linking to the panel
- The panel has a stable id and `hidden` attribute when collapsed
- `onToggle` / `ontoggle` callback fires when the user activates the toggle
- Children render inside the details panel (typically two columns explaining .gov and HTTPS)

## Props

- `label`: string (**required**) -- aria-label for the banner
- `headerText`: string (**required**) -- the always-visible top headline
- `expanded`: boolean (default: false) -- whether the details panel is open
- `expandLabel`: string (**required**) -- toggle button text
- `onToggle` / `ontoggle`: callback (optional) -- toggle handler
- `children`: slot -- details panel content
- `...restProps`: any additional HTML attributes

## Usage

Default collapsed banner:

```html
<GovernmentBanner
  label="Official government website"
  headerText="An official website of the United States government"
  expandLabel="Here's how you know"
>
  <div>
    <h3>Official websites use .gov</h3>
    <p>A .gov website belongs to an official government organization.</p>
  </div>
  <div>
    <h3>Secure .gov websites use HTTPS</h3>
    <p>A lock icon means you have securely connected to the .gov website.</p>
  </div>
</GovernmentBanner>
```

## Keyboard Interactions

- Tab: focus the toggle button
- Enter: activate the toggle button
- Space: activate the toggle button
- (All handled natively by the `<button>` element)

## ARIA

- `<aside>` provides the implicit `complementary` landmark role
- `aria-label` on the `<aside>` names the landmark
- Toggle button has `aria-expanded` reflecting the panel state
- Toggle button has `aria-controls` referencing the panel id
- Panel uses the `hidden` attribute when collapsed

## When to Use

- Use at the top of every page on a government website to identify it as official.
- Use to provide on-demand explanations of government domains and HTTPS.

## When Not to Use

- Do not use on non-government sites.
- Do not use as a generic alert or notification — use `Banner` or `Alert` instead.

## Headless

Renders the structural skeleton — `<aside>` with `<header>`, toggle
`<button>`, and panel `<div>` — wired with the correct ARIA. Visual
treatment, icons, columns, and animation are entirely the consumer's
responsibility.

## Styles

Consumer CSS targets the `government-banner` class plus the inner
`government-banner-header`, `government-banner-toggle`, and
`government-banner-details` classes for fine-grained control.

## Testing

- Verify the component renders an `<aside>` element with class `government-banner`
- Verify `aria-label` is present and equals the `label` prop
- Verify the headline text equals `headerText`
- Verify the toggle button exists with the `expandLabel` text
- Verify `aria-expanded` reflects the `expanded` prop
- Verify `aria-controls` references the panel id
- Verify the panel is hidden when `expanded` is false
- Verify the panel is visible when `expanded` is true
- Verify the toggle handler fires on click

## Advice

- **Designers**: Keep the headline short and treat the toggle as a passive disclosure. Use a flag or shield glyph next to the headline for fast recognition.
- **Developers**: Generate a stable id for the panel (use `useId` in React, `crypto.randomUUID()` server-side, or a deterministic helper). Always wire the toggle handler to flip `expanded`.

## Related components

- `announcement-banner` — a banner highlighting important messages for all users
- `banner` — a prominent message bar across the top of a page
- `banner-box` — a banner box that is inside a banner component, using flexbox horizontal
- `medical-banner` — a prominent message bar across the top of a page, with medical information
- `medical-banner-box` — a medical banner box that is inside a medical-banner component, using flexbox horizontal, with medical information
- `medical-banner-box-for-advice` — a medical record banner box for advice information e.g. contacts, contexts, plans, etc.

## References

- US Web Design System Banner: https://designsystem.digital.gov/components/banner/
- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
- WCAG 4.1.2 Name, Role, Value: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value

---

Lily™ and Lily Design System™ are trademarks.
