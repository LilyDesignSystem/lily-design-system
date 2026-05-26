# AnnouncementBanner

A persistent, page-level banner for service-wide messages — scheduled maintenance, public-interest news, regulatory notices — that every user should see while the message is active.

The component renders a `<div role="region">` so the banner is a labeled landmark in the page outline, named by the required `label` prop. Two optional behaviours layer on top:

- `dismissible` adds a close `<button>` so users can hide a non-critical banner once they have read it; the consumer decides whether the dismissal is remembered (cookie, local storage, server flag).
- `live` promotes the region to `aria-live="polite"` so screen readers announce content changes (e.g. updated maintenance ETA) without interrupting the user.

Reach for `AnnouncementBanner` when the message is broad and persistent. Use `Alert` for status tied to a specific section or action, `Notification` / `Toast` for transient confirmations, and `PhaseBanner` specifically for alpha/beta service phase messaging.

## Implementation Notes

- Renders a `<div role="region">` with an `aria-label` so screen readers announce the banner as a labeled landmark
- Optional `dismissible` mode renders a close `<button>` that hides the banner when activated
- Accepts `children` slot for the announcement content (text, links, icons composed by the consumer)
- When `live` is true, the region also gets `aria-live="polite"` so dynamic content changes are announced
- Spreads `restProps` onto the root `<div>` for consumer customization

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `label` | string (required) | — | Accessible region label |
| `live` | boolean | false | Whether the region announces dynamic changes via `aria-live="polite"` |
| `dismissible` | boolean | false | Whether to render a dismiss button |
| `dismissLabel` | string | "Dismiss" | Accessible label for the dismiss button |
| `onDismiss` | callback | — | Fired when the user dismisses the banner |
| `children` | slot (required) | — | Banner content |
| `...restProps` | HTML attributes | — | Spread onto the root `<div>` |

## Usage

```html
<AnnouncementBanner label="Service announcement" dismissible>
  <p>Maintenance is scheduled for Sunday between 2am and 4am.</p>
</AnnouncementBanner>
```

## Keyboard Interactions

- Tab moves focus to the dismiss button when present
- Enter or Space activates the dismiss button (native browser behaviour)

## ARIA

- `role="region"` makes the banner a labeled landmark
- `aria-label` (from `label`) names the region
- `aria-live="polite"` (when `live=true`) announces content changes without interrupting the user
- Dismiss button has `aria-label` for the close action

## When to Use

- Communicating service-wide messages such as scheduled maintenance, important news, or new feature launches
- Surfacing time-sensitive information that all users should see

## When Not to Use

- Use `Alert` for in-flow status messages tied to a specific action or section
- Use `Notification` for transient toast-style messages
- Use `PhaseBanner` to indicate the development phase of a service
- Use `MedicalBanner` for clinical safety information

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.announcement-banner` as the root class. No default styles are included.

## Related components

- `banner` — generic top-of-page banner
- `phase-banner` — service development phase indicator
- `alert` — in-flow status message
- `notification` — transient toast

## References

- [WAI-ARIA region role](https://www.w3.org/TR/wai-aria-1.2/#region)
- [MDN aria-live](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live)
