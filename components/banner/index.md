# Banner

A banner is a prominent component used to display important messages, updates, or calls to action at the top or bottom of an interface. Often spanning the full width of the screen, banners are designed to catch the user's attention without fully interrupting their experience. They are commonly used for announcements, cookie consent, warnings, promotions, or system alerts.

Banners may be persistent or dismissible, depending on the message's importance. This component supports four semantic variants (info, success, warning, error) exposed via a `data-type` attribute, and an optional dismiss button that hides the banner and invokes a callback. The `aria-live="polite"` region ensures screen readers announce banner content without interrupting the user.

## Implementation Notes

- Renders as `<div role="region" aria-live="polite">` for screen reader announcements
- Uses reactive state rune to track visibility; dismissing sets `visible` to `false`
- Dismissible banners render a `<button type="button">` with a configurable `aria-label`
- `data-type` attribute exposes the variant (info, success, warning, error) for consumer CSS
- The `dismiss()` function sets visibility to false and calls the `onclose` callback
- Uses `children` slot for flexible banner content rendering
- Spreads `...restProps` on the root `<div>` element for consumer extensibility
- Entire banner is conditionally rendered with conditional rendering
- No hardcoded user-facing strings; all text comes through props and children

## Props

- `type`: `"info"` | `"success"` | `"warning"` | `"error"` (default: `"info"`) -- banner variant for semantic meaning, exposed as `data-type`
- `dismissible`: boolean (default: `false`) -- whether the banner can be dismissed
- `onclose`: `() => void` (optional) -- callback invoked when the banner is dismissed
- `closeLabel`: string (optional) -- accessible label for the dismiss button via `aria-label`
- `children`: slot (required) -- the banner content
- `...restProps`: any additional HTML attributes spread onto the root `<div>` element

## Usage

```html
<!-- Information banner for a service-wide delay -->
<Banner type="info">
  <p>You have 7 days left to send your application.
  <a href="/applications">View application</a>.</p>
</Banner>

<!-- Success banner confirming a completed action -->
<Banner type="success">
  <p>Patient record for Sarah Mitchell has been updated.</p>
</Banner>

<!-- Dismissible warning banner with callback -->
<Banner type="warning" dismissible closeLabel="Dismiss warning" onclose={handleDismiss}>
  <p>Planned maintenance is scheduled for Saturday 12 April from 09:00 to 13:00.</p>
</Banner>
```

## Keyboard Interactions

- Tab: Focus the dismiss button (when `dismissible` is `true`)
- Enter/Space: Activate the dismiss button to hide the banner

## ARIA

- `role="region"` -- establishes the banner as a landmark region for assistive technology navigation
- `aria-live="polite"` -- ensures screen readers announce banner content without interrupting the current reading
- `aria-label={closeLabel}` -- provides the accessible name for the dismiss button when present

## When to Use

- Use to communicate important information that is not directly related to the current page content, such as service-wide delays or planned maintenance
- Use to show a success confirmation after a user completes an action, such as saving or updating a record
- Use sparingly -- evidence shows users often miss banners when overused
- Use at most one banner per page, positioned at the top of the main content area below breadcrumbs and before the h1 heading

## When Not to Use

- Do not use for information directly relevant to the current page task -- use InsetText or WarningCallout instead
- Do not use for form validation errors -- use ErrorMessage and ErrorSummary instead
- Do not use simultaneously with ErrorSummary on the same page
- Do not use for critical health warnings -- use WarningCallout or CareCard instead

## Headless

This component provides `role="region"` with `aria-live="polite"`, a `data-type` attribute for semantic variants, optional dismiss button with `aria-label`, and visibility state management, all with zero visual styling. The consumer is responsible for all CSS including background colors, text styling, dismiss button appearance, full-width layout, and position (sticky, fixed, or static).


## Styles

The consumer provides all CSS styling. The component renders with a `.banner` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `banner`
- Verify role="region"` -- establishes the banner as a landmark region for assistive technology navigation
- Verify aria-label={closeLabel}` -- provides the accessible name for the dismiss button when present
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure the dismiss button has a minimum 44x44px touch target and is visually distinct. Use color and an icon together so meaning is not conveyed by color alone.
- **Developers**: Provide a meaningful `closeLabel` prop for the dismiss button so screen reader users understand its purpose. Handle the `onclose` callback to persist dismissal state if needed.

## References

- WAI-ARIA banner role: https://www.w3.org/TR/wai-aria-1.2/#banner
- WAI-ARIA alert role (for urgent banners): https://www.w3.org/TR/wai-aria-1.2/#alert
- WAI-ARIA live regions: https://www.w3.org/TR/wai-aria-1.2/#aria-live
