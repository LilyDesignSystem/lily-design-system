# Sticky Promo Banner

A sticky promo banner is a fixed-position `<aside>` that renders at the top
or bottom edge of the viewport with a dismiss button. It uses the
`complementary` landmark role so screen readers can navigate to and from it,
and it uses inline `position: fixed` styling so consumers can adopt it
without writing CSS.

Use it for time-bound announcements, cookie/consent prompts that have been
explicitly designed as promo banners, marketing campaigns, and feature
launches.

## Implementation Notes

- Uses an `<aside>` element with `role="complementary"` and `aria-label`
- `label` is **required** — the aria-label that names the landmark
- `dismissLabel` is **required** — the aria-label for the dismiss button
- `open` defaults to `true`; when `false`, the root element renders with the `hidden` attribute
- `position` is exposed as `data-position` ("top" | "bottom", default "bottom") and applied via inline `style`
- Inline `style="position: fixed; left: 0; right: 0; top: 0;"` (top variant) or `style="position: fixed; left: 0; right: 0; bottom: 0;"` (bottom variant) — this is the only documented inline style in the design system besides what each framework needs
- The dismiss button renders only when `onDismiss`/`ondismiss` is provided
- All visible text comes from `children` for i18n flexibility

## Props

- `label`: string (**required**) -- aria-label for the aside region
- `open`: boolean (default: true) -- whether the banner is visible
- `position`: "top" | "bottom" (default: "bottom") -- sticky edge
- `dismissLabel`: string (**required**) -- aria-label for the dismiss button
- `onDismiss` / `ondismiss`: callback (optional) -- dismiss click handler
- `children`: slot -- banner content
- `...restProps`: any additional HTML attributes

## Usage

Bottom banner with dismiss handler:

```html
<StickyPromoBanner
  label="Beta program promotion"
  dismissLabel="Dismiss banner"
  ondismiss={handleDismiss}
>
  <p>Try our new beta features. <a href="/beta">Learn more</a>.</p>
</StickyPromoBanner>
```

Top banner, hidden until `open` becomes `true`:

```html
<StickyPromoBanner
  label="Maintenance window"
  position="top"
  open={isOpen}
  dismissLabel="Dismiss"
  ondismiss={() => setIsOpen(false)}
>
  <p>Scheduled maintenance Saturday 22:00–23:00 UTC.</p>
</StickyPromoBanner>
```

## Keyboard Interactions

- Tab: Move focus into the banner content and the dismiss button
- Enter / Space on the dismiss button: Dismiss the banner (calls handler)
- Escape: Not handled by default — consumers may add an Escape handler if appropriate

## ARIA

- `<aside role="complementary" aria-label={label}>` for the landmark name
- `data-position` reflects "top" | "bottom"
- Dismiss button: `<button type="button" aria-label={dismissLabel}>`
- The root element uses the native `hidden` attribute when `open` is `false`

## When to Use

- Use for promotional announcements, beta invites, feature launches, and other time-bound messages.
- Use when the message is supplementary and dismissable (not safety-critical).
- Use at the top of the viewport for high-visibility announcements; at the bottom for less intrusive promos.

## When Not to Use

- Do not use for safety-critical or blocking messages — use AlertDialog or Banner instead.
- Do not use for cookie consent unless your design explicitly treats consent as a promo (most regulators expect a more prominent surface).
- Do not use for navigation; use Header or NavigationMenu.

## Headless

Renders an `<aside>` with the complementary landmark, an inline-styled
fixed position, optional dismiss button, and any provided children. The
fixed-position inline styles are the only styling the component applies;
visual treatment, padding, animation, and z-index are the consumer's
responsibility.

## Styles

Consumer CSS targets the `sticky-promo-banner` class. Use the
`data-position="top"` and `data-position="bottom"` attribute selectors to
adjust appearance per edge. Style the inner `sticky-promo-banner-content`
and `sticky-promo-banner-dismiss` classes for layout and the dismiss icon.

## Testing

- Verify the component renders an `<aside>` element with class `sticky-promo-banner` and `role="complementary"`
- Verify `aria-label` is present and equals the `label` prop
- Verify `data-position` reflects the `position` prop (default "bottom")
- Verify inline `style` includes `position: fixed; left: 0; right: 0;` plus `top: 0` (top) or `bottom: 0` (bottom)
- Verify the `hidden` attribute is applied when `open` is `false`
- Verify the dismiss `<button>` renders only when `onDismiss`/`ondismiss` is provided
- Verify the dismiss button has `type="button"` and `aria-label` equal to the `dismissLabel` prop
- Verify the dismiss handler fires on click and on Enter/Space

## Advice

- **Designers**: Keep the message short — one sentence with one link. Reserve top placement for higher-impact announcements; default to bottom for promos.
- **Developers**: Always supply `label` and `dismissLabel`. Persist the user's dismissal in storage so the banner does not reappear on every page load.

## Related components

- `announcement-banner` — a banner highlighting important messages for all users
- `banner` — a prominent message bar across the top of a page
- `banner-box` — a banner box that is inside a banner component, using flexbox horizontal
- `government-banner` — a banner identifying a website as belonging to a government, with an expandable details panel
- `medical-banner` — a prominent message bar across the top of a page, with medical information
- `medical-banner-box` — a medical banner box that is inside a medical-banner component, using flexbox horizontal, with medical information

## References

- WAI-ARIA `complementary` role: https://www.w3.org/TR/wai-aria-1.2/#complementary
- MDN `<aside>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside
- MDN `position: fixed`: https://developer.mozilla.org/en-US/docs/Web/CSS/position#fixed_positioning
- Mozilla Protocol Design System: https://protocol.mozilla.org/

---

Lily™ and Lily Design System™ are trademarks.
