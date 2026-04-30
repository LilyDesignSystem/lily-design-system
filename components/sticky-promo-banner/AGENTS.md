# StickyPromoBanner

## Metadata

- Component: sticky-promo-banner
- PascalCase: StickyPromoBanner
- Description: a fixed-position promotional banner with a dismiss button
- HTML tag: <aside>
- CSS class: .sticky-promo-banner
- Interactive: yes

## Key Behaviors

- Uses an <aside> element with role="complementary" and aria-label
- label is REQUIRED — names the landmark
- dismissLabel is REQUIRED — aria-label for the dismiss button
- open defaults to true; when false, root renders with hidden attribute
- position exposed as data-position ("top" | "bottom", default "bottom")
- Inline style="position: fixed; left: 0; right: 0; top: 0;" (top) or bottom equivalent — the only allowed inline style for this component
- Dismiss <button type="button"> renders only when onDismiss / ondismiss is provided
- All visible text comes from children for i18n

## ARIA

- <aside role="complementary" aria-label={label}> landmark
- data-position reflects "top" | "bottom"
- Dismiss button: <button type="button" aria-label={dismissLabel}>
- Native hidden attribute when open is false

## Keyboard

- Tab: Move focus into banner content and the dismiss button
- Enter / Space on dismiss button: Dismiss the banner (calls handler)
- Escape: Not handled by default — consumer may add their own

## Props

- `label`: string (REQUIRED) -- aria-label for the aside region
- `open`: boolean (default: true)
- `position`: "top" | "bottom" (default: "bottom")
- `dismissLabel`: string (REQUIRED) -- aria-label for dismiss button
- `onDismiss` / `ondismiss`: callback (optional)
- `children`: slot -- banner content
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <aside> with class="sticky-promo-banner" and role="complementary"
- [ ] aria-label present and equals label prop
- [ ] data-position reflects position prop, default "bottom"
- [ ] Inline style includes "position: fixed; left: 0; right: 0;" plus top: 0 or bottom: 0
- [ ] hidden attribute applied when open is false
- [ ] Dismiss <button type="button"> renders only when onDismiss / ondismiss provided
- [ ] Dismiss button aria-label equals dismissLabel prop
- [ ] Dismiss handler fires on click and on Enter/Space
- [ ] All user-facing strings come through props (i18n-ready)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — only documented inline positioning styles, no <style> blocks

## References

- Documentation: index.md
- CSS class: .sticky-promo-banner in css-style-sheet-template.css
- WAI-ARIA complementary: https://www.w3.org/TR/wai-aria-1.2/#complementary
- MDN <aside>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside
- Mozilla Protocol Design System: https://protocol.mozilla.org/
