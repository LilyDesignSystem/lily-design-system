# Alert

An alert is a UI/UX component designed to capture the user's attention and
convey important information, such as warnings, errors, confirmations, or status
updates. Alerts interrupt the user's workflow to ensure visibility and are
commonly used for critical feedback or decision points -- such as confirming
deletion or notifying of failed actions. They should be clear, concise, and
appropriately styled (e.g., color-coded for severity by the consumer) to avoid
confusion or unnecessary disruption.

This component renders as a `<div>` with ARIA live region attributes for
automatic screen reader announcements. It supports different severity types
(info, success, warning, error) exposed via a `data-type` attribute that
consumers can use for styling. An optional heading is rendered with `<strong>`
emphasis without assuming a heading level.

## Implementation Notes

- Uses `role="alert"` with `aria-live="assertive"` by default for immediate screen reader announcements
- Supports `role="status"` with `aria-live="polite"` for less urgent messages
- `aria-atomic="true"` ensures the entire alert is re-read when content changes
- `data-type` attribute exposes severity type for CSS styling by consumers
- Heading rendered as `<p><strong>` for semantic emphasis without assuming heading level
- The `live` prop can override the default aria-live value derived from the role

## Props

- `type`: "info" | "success" | "warning" | "error" (default: "info") -- severity type
- `heading`: string (optional) -- heading text for the alert
- `role`: "alert" | "status" (default: "alert") -- ARIA role
- `live`: "assertive" | "polite" | "off" (optional) -- override for aria-live politeness
- `children`: slot (required) -- the alert content
- `...restProps`: Any additional HTML attributes spread onto the `<div>`

## Usage

Session expiry warning:

```html
<Alert type="warning" heading="Session expiring">
  Your session will expire in 5 minutes. Save your work to avoid losing changes.
</Alert>
```

Form submission confirmation:

```html
<Alert type="success" heading="Appointment confirmed">
  Your appointment for 14 March 2026 at 10:00 has been booked successfully.
</Alert>
```

Error feedback after a failed action:

```html
<Alert type="error" heading="Payment failed">
  We could not process your payment. Check your card details and try again.
</Alert>
```

Polite status update using `role="status"`:

```html
<Alert role="status">3 of 12 records loaded.</Alert>
```

## Keyboard Interactions

- None -- alerts are passive announcements, not interactive elements

## ARIA

- `role="alert"` or `role="status"` for live region semantics
- `aria-live="assertive"` (default for alert role) or `aria-live="polite"` (default for status role)
- `aria-atomic="true"` ensures the entire region is re-announced on any change

## When to Use

- Use for important status messages that need to be announced to screen readers via `role="alert"`, such as form submission confirmations or system status changes.
- Use for time-sensitive information such as session expiry warnings or connectivity status updates.
- Use when the message does not require user interaction -- it is informational only and dismisses itself or persists passively.
- Use `role="status"` with `aria-live="polite"` for lower-priority updates that should not interrupt the user's current task.
- Use the `type` prop to communicate severity (info, success, warning, error) through `data-type` for consumer styling.

## When Not to Use

- Do not use for messages requiring user acknowledgment before continuing -- use AlertDialog instead.
- Do not use for page-level service announcements or banners that span the full width -- use Banner instead.
- Do not use for inline form field validation errors -- use ErrorMessage and ErrorSummary instead.
- Do not use for persistent warnings within content pages -- use WarningCallout instead.

## Headless

This component provides ARIA live region semantics (`role="alert"` or `role="status"`), `aria-atomic`, and a `data-type` attribute for severity variants, with zero visual styling. The consumer is responsible for all CSS including background colors, border styles, icons, typography, and spacing for each severity level.


## Styles

The consumer provides all CSS styling. The component renders with a `.alert` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `alert`
- Verify role="alert"` or `role="status"` for live region semantics
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use consistent color coding across severity types (info, success, warning, error) and pair colors with icons so that meaning is not conveyed by color alone.
- **Developers**: Use `role="alert"` with `aria-live="assertive"` for critical messages and `role="status"` with `aria-live="polite"` for non-urgent updates to avoid disrupting the user unnecessarily.

## References

- WAI-ARIA Alert Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/alert/
- WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert
- WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status
