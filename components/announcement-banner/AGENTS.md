# AnnouncementBanner

## Metadata

- Component: announcement-banner
- PascalCase: AnnouncementBanner
- Description: a banner highlighting important messages for all users
- HTML tag: <div>
- CSS class: .announcement-banner
- Interactive: no

## Key Behaviors

- Renders a `<div role="region">` with an `aria-label` so screen readers announce the banner as a labeled landmark
- Optional `dismissible` mode renders a close `<button>` that hides the banner when activated
- Accepts `children` slot for the announcement content (text, links, icons composed by the consumer)
- When `live` is true, the region also gets `aria-live="polite"` so dynamic content changes are announced
- Spreads `restProps` onto the root `<div>` for consumer customization

## ARIA

- `role="region"` makes the banner a labeled landmark
- `aria-label` (from `label`) names the region
- `aria-live="polite"` (when `live=true`) announces content changes without interrupting the user
- Dismiss button has `aria-label` for the close action

## Keyboard

- Tab moves focus to the dismiss button when present
- Enter or Space activates the dismiss button (native browser behaviour)

## Props

- `label`: string (required) (default: —) — Accessible region label
- `live`: boolean (default: false) — Whether the region announces dynamic changes via `aria-live="polite"`
- `dismissible`: boolean (default: false) — Whether to render a dismiss button
- `dismissLabel`: string (default: "Dismiss") — Accessible label for the dismiss button
- `onDismiss`: callback (default: —) — Fired when the user dismisses the banner
- `children`: slot (required) (default: —) — Banner content
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="announcement-banner"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.announcement-banner` in css-style-sheet-template.css
- [WAI-ARIA region role](https://www.w3.org/TR/wai-aria-1.2/#region)
- [MDN aria-live](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live)
