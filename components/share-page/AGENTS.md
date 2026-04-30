# SharePage

## Metadata

- Component: share-page
- PascalCase: SharePage
- Description: a component for sharing the page on social media
- HTML tag: <div>
- CSS class: .share-page
- Interactive: yes

## Key Behaviors

- Renders a labeled group of share buttons (or links) for the current page URL
- Each share target (e.g. email, Twitter/X, Facebook, copy-link) is rendered as a `<button>` or `<a>` depending on the action
- The list of `services` is configurable; consumers wire each service's share URL or copy-to-clipboard handler
- Includes a copy-link button that uses the Clipboard API; falls back to a textarea-and-select fallback when the API is unavailable
- Spreads `restProps` onto the root `<div>`

## ARIA

- Wrapper has `role="group"` with `aria-label` so the share controls are announced as a related set
- Each share control has its own `aria-label` (e.g. "Share on email")
- The copy-link button announces success via a transient `aria-live="polite"` region

## Keyboard

- Tab cycles through each share control
- Enter or Space activates the focused control (native button behaviour)

## Props

- `label`: string (required) (default: —) — Accessible label for the share group (e.g. "Share this page")
- `url`: string (required) (default: —) — URL to share
- `title`: string (default: —) — Page title shared alongside the URL
- `services`: array of `{ id: string; label: string; href?: string; onClick?: () => void }` (default: [email, copy, x, facebook]) — Services to render
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="share-page"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.share-page` in css-style-sheet-template.css
- [MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [MDN Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)
