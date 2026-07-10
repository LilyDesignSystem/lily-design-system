# SharePage

A labeled group of share controls — typically email, copy-link, and one or two social platforms — letting readers send the current page to others without leaving it.

The component is a thin headless wrapper: it renders a `role="group"` container with an accessible label, then renders one button or link per configured service. Social platforms render as anchors that open the platform's share endpoint with the URL and title pre-filled; copy-link renders as a `<button>` that calls the Clipboard API (with a textarea-select fallback for older browsers) and announces success via an `aria-live="polite"` region. The list of services is configurable so consumers can add, remove, or reorder share targets to match their audience.

For mobile-first contexts where the OS share sheet is preferable, prefer the native Web Share API (`navigator.share`) over this component.

## Implementation Notes

- Renders a labeled group of share buttons (or links) for the current page URL
- Each share target (e.g. email, Twitter/X, Facebook, copy-link) is rendered as a `<button>` or `<a>` depending on the action
- The list of `services` is configurable; consumers wire each service's share URL or copy-to-clipboard handler
- Includes a copy-link button that uses the Clipboard API; falls back to a textarea-and-select fallback when the API is unavailable
- Spreads `restProps` onto the root `<div>`

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `label` | string (required) | — | Accessible label for the share group (e.g. "Share this page") |
| `url` | string (required) | — | URL to share |
| `title` | string | — | Page title shared alongside the URL |
| `services` | array of `{ id: string; label: string; href?: string; onClick?: () => void }` | [email, copy, x, facebook] | Services to render |
| `...restProps` | HTML attributes | — | Spread onto the root `<div>` |

## Usage

```html
<SharePage label="Share this page" url={pageUrl} title={pageTitle} />
```

## Keyboard Interactions

- Tab cycles through each share control
- Enter or Space activates the focused control (native button behaviour)

## ARIA

- Wrapper has `role="group"` with `aria-label` so the share controls are announced as a related set
- Each share control has its own `aria-label` (e.g. "Share on email")
- The copy-link button announces success via a transient `aria-live="polite"` region

## When to Use

- Allowing users to share an article, service page, or piece of guidance via email or social platforms
- Providing a quick "copy link" button on long-form content

## When Not to Use

- Use the platform's native Web Share API (`navigator.share`) for mobile-first contexts when a unified share sheet is preferable

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.share-page` as the root class. No default styles are included.

## Related components

- `clipboard-copy-button` — single copy-to-clipboard action
- `button-group` — grouped action buttons

## References

- [MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [MDN Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)

---

Lily™ and Lily Design System™ are trademarks.
