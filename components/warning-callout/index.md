# Warning Callout

A warning callout is a component used to draw attention to important alerts or potential issues that require user attention or caution. It highlights warnings, errors, or critical information that could affect the user's experience or actions, and may include additional text or links to help users understand the issue or take corrective actions.

This headless component renders an `<aside>` element with `role="alert"`, which causes screen readers to announce the content immediately when it appears. The consumer provides the warning content as children and is responsible for all visual styling.

## Implementation Notes

- Renders an `<aside>` element with `role="alert"` for immediate screen reader announcements
- The `role="alert"` implicitly sets `aria-live="assertive"`, meaning content is announced immediately
- The `label` prop is optional since the alert content itself provides the message
- Accepts `...restProps` for forwarding additional attributes to the aside element

## Props

- `label`: string (optional) -- accessible name applied via `aria-label`; useful when multiple alerts exist on the same page
- `children`: slot (required) -- the warning content to display

## Usage

```html
<WarningCallout heading="Important">
  <p>If you have a peanut allergy, do not take this medicine.
  Talk to your doctor about alternative treatments.</p>
</WarningCallout>
```

```html
<WarningCallout heading="School, nursery or playgroup">
  <p>Tell your child's school or nursery if they have been
  diagnosed with chickenpox. Stay away from school until all
  the blisters have crusted over, usually 5 days after the
  spots first appeared.</p>
</WarningCallout>
```

## Keyboard Interactions

None -- this component is a passive container for alert content.

## ARIA

- `role="alert"` -- identifies the content as an alert; screen readers announce it immediately when it appears or changes
- `aria-label={label}` -- optional accessible name to distinguish this alert from others on the page

## When to Use

- Use for information that is time-critical and users must not miss
- Use for content that could significantly impact someone's health if overlooked
- Use to address common misconceptions or mistakes that could lead to harm
- Use on content pages where the warning stands out from surrounding body text

## When Not to Use

- Do not use on transactional pages — the pattern is untested in that context
- Do not use when directing users to contact their GP or seek medical help — use CareCard instead
- Do not use for information that is not sufficiently important — use InsetText for general callouts
- Do not use for system-level alerts or error states — use Alert or Banner instead

## Headless

This headless component provides an `<aside>` element with `role="alert"` (which implicitly sets `aria-live="assertive"`) for immediate screen reader announcements. The consumer provides all warning content as children and all visual styling including borders, background colors, and icons.


## Styles

The consumer provides all CSS styling. The component renders with a `.warning-callout` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `warning-callout`
- Verify role="alert"` -- identifies the content as an alert; screen readers announce it immediately when it appears or changes
- Verify aria-label={label}` -- optional accessible name to distinguish this alert from others on the page
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use a distinct visual treatment (e.g., amber/yellow background, warning icon) to differentiate warnings from errors and informational messages. Ensure sufficient color contrast.
- **Developers**: Content within `role="alert"` is announced immediately by screen readers when it appears or changes. Avoid dynamically adding and removing WarningCallout rapidly, as each change triggers an announcement.

## References

- WAI-ARIA Alert Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/alert/
- WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert
