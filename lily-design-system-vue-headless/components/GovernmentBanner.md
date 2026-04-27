# GovernmentBanner

A banner identifying a website as belonging to a government, with an expandable details panel. Renders `<aside class="government-banner">` containing a `<header>` with a toggle button and a `<div>` panel referenced via `aria-controls`.

## Implementation Notes

- Headless: no CSS, no styles
- `label`, `headerText`, and `expandLabel` are **required**
- The consumer controls `expanded`; the component emits `toggle` and never mutates state internally
- Panel id is generated with `Math.random` so multiple banners coexist safely

## Props

- `label`: string (**required**) — aria-label for the aside
- `headerText`: string (**required**) — top headline text
- `expandLabel`: string (**required**) — toggle button text
- `expanded`: boolean (default `false`)
- default slot — details panel content

## Events

- `toggle(event: MouseEvent)` — fired when the toggle button is clicked

## Usage

```vue
<GovernmentBanner
    label="Official government website"
    headerText="An official website of the United States government"
    expandLabel="Here's how you know"
    :expanded="open"
    @toggle="open = !open"
>
    <p>The .gov means it's official.</p>
    <p>HTTPS keeps your connection private.</p>
</GovernmentBanner>
```

## ARIA

- `<aside>` provides a complementary landmark
- `aria-label` names the landmark
- Toggle button has `aria-expanded` and `aria-controls` linking to the panel
- Panel uses native `hidden` attribute when collapsed

## When to Use

- At the top of any government website to identify the site as official

## Headless

No CSS is provided. The consumer styles the bar, columns, icons, and animation.

## Testing

- Verify root `government-banner` class
- Verify aria-expanded reflects the `expanded` prop
- Verify aria-controls references the panel id
- Verify panel is hidden when collapsed
- Verify the toggle event fires on click

## References

- [USWDS Banner](https://designsystem.digital.gov/components/banner/)
