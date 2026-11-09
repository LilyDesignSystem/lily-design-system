# Panel

A panel is a UI component that serves as a labeled container for grouping related content, controls, or settings within an interface. The Panel component renders a `<div role="group">` named by its label, so assistive technology announces the panel without adding a landmark for each one.

**Status:** stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.

Panels are commonly used in dashboards, settings pages, sidebars, and multi-section layouts to organize information into logical groups. The required label ensures each panel is identifiable, which is especially important when multiple panels appear on the same page.

## Implementation Notes

- Renders a `<div role="group">`: a page of panels as `<section>` regions would flood the landmark list
- The `label` prop is required and applied via `aria-label` to name the group
- Content is provided via the `children` slot
- Rest props are spread onto the root `<div>`
- For a panel that is a major part of the page, pass `role="region"` to make it a landmark

## Props

- `label`: string (required) -- accessible name for the panel group via `aria-label`
- `children`: slot (required) -- the panel content
- `...restProps`: unknown -- additional attributes spread onto the root `<div>`

## Usage

```html
<!-- Confirmation panel on a transaction completion page -->
<Panel label="Application complete">
  <h1>Application complete</h1>
  <p>We have sent you a confirmation email to sarah.mitchell@example.com</p>
  <p>Your reference number is <strong>HDJ2123F</strong></p>
</Panel>

<!-- Appointment confirmation panel -->
<Panel label="Appointment booked">
  <h1>Appointment booked</h1>
  <p>Your appointment is on 15 March 2025 at 10:30am at City Road Medical Centre.</p>
</Panel>

<!-- Multiple panels grouping settings sections -->
<Panel label="Account information">
  <h2>Account information</h2>
  <p>Name, email, and profile details.</p>
</Panel>
<Panel label="Notification preferences">
  <h2>Notification preferences</h2>
  <p>Choose how you want to be notified.</p>
</Panel>
```

## Keyboard Interactions

None -- this component is a passive container.

## ARIA

- `<div role="group" aria-label="...">` -- a named group, announced when entered, not added to the landmark list
- The `aria-label` value should be concise and descriptive of the panel's content

## When to Use

- Use on confirmation pages to tell users they have successfully completed a transaction
- Use to display a brief confirmation heading like "Application complete" with optional supporting text such as a reference number
- Use to group related content into a labeled section on dashboards, settings pages, or multi-section layouts

## When Not to Use

- Do not use to highlight important information within body content -- use InsetText, WarningCallout, or CareCard instead
- Do not use for error states or validation messages -- use ErrorSummary and ErrorMessage instead
- Do not use for notifications or status updates -- use Banner or Notification instead
- Do not use for grouping content that needs a visual container with header, body, and footer areas -- use Card instead

## Headless

The Panel headless component provides a `<div role="group">` named by `aria-label`. It handles accessible naming. The consumer provides all visual styling, including borders, backgrounds, padding, and spacing.

## Styles

The consumer provides all CSS styling. The component renders with a `.panel` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `panel`
- Verify it renders `<div role="group">` named by its `aria-label`
- Verify The `aria-label` value should be concise and descriptive of the panel's content
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep panel labels concise and unique on each page so users can tell one panel from another.
- **Developers**: Ensure each Panel on a page has a distinct `label` value; duplicate group names are confusing for screen reader users.

## Related components

- `card` — a grouped content container with header, body, and footer areas
- `summary-box` — a boxed callout highlighting key takeaways or next steps from a longer page
- `info-state` — a composition of illustration, title, description, and action for empty, error, or info states

## References

- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

---

Lily™ and Lily Design System™ are trademarks.
