# Banner Box

BannerBox is a headless layout component designed to be placed inside a Banner component. It renders a `<div>` that the consumer styles with flexbox horizontal layout (`display: flex; flex-direction: row`) to arrange banner content items side by side, such as a message and action buttons.

This component is useful for structuring banner content into a horizontal row, aligning text, icons, and action buttons within a banner message bar.

## Implementation Notes

- Renders a `<div>` element with class `banner-box`
- Intended to be placed inside a Banner component
- Consumer applies flexbox horizontal styles via the `.banner-box` CSS class
- Uses `children` slot for flexible content rendering
- Spreads `restProps` onto the `<div>` element for consumer extensibility

## Props

- `label`: string (optional) -- accessible name applied via `aria-label` if needed
- `children`: slot (required) -- the banner box content
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```html
<Banner label="Site notice" type="info">
  <BannerBox>
    <span>We are upgrading our servers on Saturday 12 April from 02:00 to 06:00.</span>
    <a href="/status">Check status</a>
  </BannerBox>
</Banner>
```

```html
<Banner label="Session warning" type="warning" dismissible closeLabel="Dismiss">
  <BannerBox>
    <span>Your session will expire in 5 minutes.</span>
    <button type="button">Extend session</button>
  </BannerBox>
</Banner>
```

```html
<Banner label="Cookie consent" type="info">
  <BannerBox>
    <p>We use cookies to improve your experience.</p>
    <button type="button">Accept</button>
    <button type="button">Reject</button>
  </BannerBox>
</Banner>
```

## Keyboard Interactions

- None (passive layout element)

## ARIA

- No additional ARIA attributes required; the parent Banner provides the landmark role and aria-live region
- Optional `aria-label` via `label` prop if the box needs an accessible name

## Composition

BannerBox is a child of Banner:

```
Banner
  └── BannerBox (flexbox horizontal row)
        ├── message content
        └── action buttons
```

## When to Use

- Use inside a Banner to create a horizontal flexbox container for banner content
- Use to arrange banner text and action buttons side by side in a single row
- Use to group an icon, a message, and a dismiss or action button within a Banner
- Use when the Banner needs a consistent horizontal layout across different banner types
- Use to separate content zones within a Banner, such as left-aligned text and right-aligned controls

## When Not to Use

- Do not use outside a Banner -- use a standard `<div>` or layout component for non-banner horizontal layouts
- Do not use for medical banners -- use MedicalBannerBox inside MedicalBanner instead
- Do not use for vertical stacking of banner content -- apply column-direction styles directly to the Banner or use multiple BannerBox elements

## Headless

This headless component provides a `<div>` with a `.banner-box` class for consumer CSS targeting. The consumer is responsible for all flexbox styling including `display: flex`, `flex-direction: row`, alignment, gap, and any responsive behavior.

## Styles

The consumer provides all CSS styling. The component renders with a `.banner-box` class for targeting. Typical consumer styles include `display: flex; flex-direction: row; align-items: center; gap: 1rem;`. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `banner-box`
- Verify it renders children content
- Verify pass-through attributes are applied to the `<div>`

## Advice

- **Designers**: Use BannerBox to create a horizontal layout within banners. Consider responsive behavior -- the consumer may want to switch to vertical stacking on narrow screens.
- **Developers**: Apply `display: flex; flex-direction: row;` to `.banner-box` in your CSS. Use `align-items: center` for vertical centering and `gap` for spacing between items.

## References

- Parent component: Banner
- CSS Flexbox: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout
