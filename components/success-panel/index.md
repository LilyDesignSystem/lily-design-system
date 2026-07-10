# SuccessPanel

The dominant element on a confirmation page — a prominent panel that says, in plain language, that a multi-step task has finished, and (optionally) shows a reference number and what happens next.

The component is built around a configurable heading (defaulting to `<h1>` because the confirmation panel is normally the page's main heading) and a body slot for follow-up information: confirmation reference, what to expect next, links to related services, contact details. The wrapping `<div>` is exposed as `role="alert"` with `aria-live="polite"` so screen readers announce the heading when the page loads, even if focus has not yet been moved into it.

This is heavier than `Alert` (which is for inline status inside a longer page) and `Notification` / `Toast` (which are transient). Reach for `SuccessPanel` only at the end of a discrete task — form submission, payment, booking, account creation — when the page changes role from "perform task" to "confirm task complete".

## Implementation Notes

- Renders a `<div role="alert" aria-live="polite">` so completion is announced to assistive technology
- Contains a heading (configurable level) and a message body slot
- Optionally renders a follow-up actions area (links/buttons) inside the panel
- Best placed at the top of the post-submission page, replacing the form
- Spreads `restProps` onto the root `<div>`

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `title` | string (required) | — | Confirmation headline |
| `headingLevel` | 1 | 2 | 3 | 4 | 5 | 6 | 1 | Heading level used for `title` |
| `reference` | string | — | Optional reference number shown beneath the title |
| `children` | slot | — | Body content (next steps, links, etc.) |
| `...restProps` | HTML attributes | — | Spread onto the root `<div>` |

## Usage

```html
<SuccessPanel title="Application complete" reference="HDJ2123F">
  <p>We have sent you a confirmation email.</p>
</SuccessPanel>
```

## Keyboard Interactions

- No keyboard interactions on the panel itself
- Focus is moved to the panel by the consumer when navigating to the confirmation page so screen readers announce it immediately

## ARIA

- `role="alert"` exposes the panel as an alert region
- `aria-live="polite"` ensures the heading and body are announced when the panel renders
- Heading level is configurable via the `headingLevel` prop (default `<h1>` — confirmation pages typically use the panel as the page's main heading)

## When to Use

- Confirming completion of a multi-step transaction (form submission, payment, booking)
- Communicating that a destructive or irreversible action succeeded

## When Not to Use

- Use `Alert` for inline success messages within a longer page
- Use `Notification` or `Toast` for transient confirmations
- Use `Banner` for non-task-confirmation announcements

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.success-panel` as the root class. No default styles are included.

## Related components

- `alert` — inline status messaging
- `notification` — transient confirmation
- `info-state` — empty/error/info state composition

## References

- [GOV.UK Confirmation pages pattern](https://design-system.service.gov.uk/patterns/confirmation-pages/)
- [WAI-ARIA alert role](https://www.w3.org/TR/wai-aria-1.2/#alert)

---

Lily™ and Lily Design System™ are trademarks.
