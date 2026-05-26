# Banner

## Metadata

- Component: banner
- PascalCase: Banner
- Description: a prominent message bar across the top of a page
- HTML tag: <div>
- CSS class: .banner
- Interactive: yes

## Key Behaviors

- Renders as `<div role="region" aria-live="polite">` for screen reader announcements
- Uses reactive state rune to track visibility; dismissing sets `visible` to `false`
- Dismissible banners render a `<button type="button">` with a configurable `aria-label`
- `data-type` attribute exposes the variant (info, success, warning, error) for consumer CSS
- The `dismiss()` function sets visibility to false and calls the `onclose` callback
- Uses `children` slot for flexible banner content rendering
- Spreads `...restProps` on the root `<div>` element for consumer extensibility
- Entire banner is conditionally rendered with conditional rendering
- No hardcoded user-facing strings; all text comes through props and children

## ARIA

- `role="region"` -- establishes the banner as a landmark region for assistive technology navigation
- `aria-live="polite"` -- ensures screen readers announce banner content without interrupting the current reading
- `aria-label={closeLabel}` -- provides the accessible name for the dismiss button when present

## Keyboard

- Tab: Focus the dismiss button (when `dismissible` is `true`)
- Enter/Space: Activate the dismiss button to hide the banner

## Props

- `type`: `"info"` | `"success"` | `"warning"` | `"error"` (default: `"info"`) -- banner variant for semantic meaning, exposed as `data-type`
- `dismissible`: boolean (default: `false`) -- whether the banner can be dismissed
- `onclose`: `() => void` (optional) -- callback invoked when the banner is dismissed
- `closeLabel`: string (optional) -- accessible label for the dismiss button via `aria-label`
- `children`: slot (required) -- the banner content
- `...restProps`: any additional HTML attributes spread onto the root `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="banner"
- [ ] Has aria-label attribute
- [ ] Has role="region"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .banner in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/banner.html
- WAI-ARIA banner role: https://www.w3.org/TR/wai-aria-1.2/#banner
- WAI-ARIA alert role (for urgent banners): https://www.w3.org/TR/wai-aria-1.2/#alert
- WAI-ARIA live regions: https://www.w3.org/TR/wai-aria-1.2/#aria-live
