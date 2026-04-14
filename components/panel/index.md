# Panel

A panel is a UI component that serves as a labeled container for grouping related content, controls, or settings within an interface. The Panel component renders a semantic `<section>` element with an accessible label, creating a named region landmark that assistive technology can identify and navigate to.

Panels are commonly used in dashboards, settings pages, sidebars, and multi-section layouts to organize information into logical groups. The required label ensures each panel is identifiable, which is especially important when multiple panels appear on the same page.

## Implementation Notes

- Renders a `<section>` HTML element, which creates a landmark region when labelled
- The `label` prop is required and applied via `aria-label` to name the region
- Content is provided via the `children` slot
- Rest props are spread onto the `<section>` element
- A `<section>` with `aria-label` becomes a navigable region in screen reader landmark lists

## Props

- `label`: string (required) -- accessible name for the panel region via `aria-label`
- `children`: slot (required) -- the panel content
- `...restProps`: unknown -- additional attributes spread onto the `<section>` element

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

None -- this component is a passive container. Screen reader users can navigate to named regions using landmark navigation shortcuts.

## ARIA

- `<section aria-label="...">` -- creates a named region landmark, allowing assistive technology to list and navigate to this section
- The `aria-label` value should be concise and descriptive of the panel's content

## When to Use

- Use on confirmation pages to tell users they have successfully completed a transaction
- Use to display a brief confirmation heading like "Application complete" with optional supporting text such as a reference number
- Use to group related content into a labeled section on dashboards, settings pages, or multi-section layouts
- Use when screen reader users need to navigate between distinct content regions via landmark navigation

## When Not to Use

- Do not use to highlight important information within body content -- use InsetText, WarningCallout, or CareCard instead
- Do not use for error states or validation messages -- use ErrorSummary and ErrorMessage instead
- Do not use for notifications or status updates -- use Banner or Notification instead
- Do not use for grouping content that needs a visual container with header, body, and footer areas -- use Card instead

## Headless

The Panel headless component provides a semantic `<section>` element with `aria-label` for region landmark navigation. It handles accessible naming and landmark semantics. The consumer provides all visual styling, including borders, backgrounds, padding, and spacing.


## Styles

The consumer provides all CSS styling. The component renders with a `.panel` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `panel`
- Verify <section aria-label="...">` -- creates a named region landmark, allowing assistive technology to list and navigate to this section
- Verify The `aria-label` value should be concise and descriptive of the panel's content
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep panel labels concise and unique on each page so users can quickly distinguish between sections in a landmark list.
- **Developers**: Ensure each Panel on a page has a distinct `label` value; duplicate region names make landmark navigation confusing for screen reader users.

## References

- WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
- HTML section element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section
- WAI Landmarks: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
