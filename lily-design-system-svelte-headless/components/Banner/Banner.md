# Banner

A banner is a prominent component used to display important messages, updates, or calls to action at the top or bottom of an interface. Often spanning the full width of the screen, banners are designed to catch the user's attention without fully interrupting their experience. They are commonly used for announcements, cookie consent, warnings, promotions, or system alerts.

Banners may be persistent or dismissible, depending on the message's importance. This component supports four semantic variants (info, success, warning, error) exposed via a `data-type` attribute, and an optional dismiss button that hides the banner and invokes a callback. The `aria-live="polite"` region ensures screen readers announce banner content without interrupting the user.

## Implementation Notes

- Renders as `<div role="region" aria-live="polite">` for screen reader announcements
- Uses Svelte 5 `$state()` rune to track visibility; dismissing sets `visible` to `false`
- Dismissible banners render a `<button type="button">` with a configurable `aria-label`
- `data-type` attribute exposes the variant (info, success, warning, error) for consumer CSS
- The `dismiss()` function sets visibility to false and calls the `onclose` callback
- Uses `children` Snippet for flexible banner content rendering
- Spreads `...restProps` on the root `<div>` element for consumer extensibility
- Entire banner is conditionally rendered with `{#if visible}`
- No hardcoded user-facing strings; all text comes through props and children

## Props

- `type`: `"info"` | `"success"` | `"warning"` | `"error"` (default: `"info"`) -- banner variant for semantic meaning, exposed as `data-type`
- `dismissible`: boolean (default: `false`) -- whether the banner can be dismissed
- `onclose`: `() => void` (optional) -- callback invoked when the banner is dismissed
- `closeLabel`: string (optional) -- accessible label for the dismiss button via `aria-label`
- `children`: Snippet (required) -- the banner content
- `...restProps`: any additional HTML attributes spread onto the root `<div>` element

## Usage

```svelte
<Banner>Important announcement here.</Banner>
```

```svelte
<Banner type="warning" dismissible closeLabel="Dismiss" onclose={handleDismiss}>
    Your session will expire soon.
</Banner>
```

## Keyboard Interactions

- Tab: Focus the dismiss button (when `dismissible` is `true`)
- Enter/Space: Activate the dismiss button to hide the banner

## ARIA

- `role="region"` -- establishes the banner as a landmark region for assistive technology navigation
- `aria-live="polite"` -- ensures screen readers announce banner content without interrupting the current reading
- `aria-label={closeLabel}` -- provides the accessible name for the dismiss button when present

## References

- WAI-ARIA banner role: https://www.w3.org/TR/wai-aria-1.2/#banner
- WAI-ARIA alert role (for urgent banners): https://www.w3.org/TR/wai-aria-1.2/#alert
- WAI-ARIA live regions: https://www.w3.org/TR/wai-aria-1.2/#aria-live
