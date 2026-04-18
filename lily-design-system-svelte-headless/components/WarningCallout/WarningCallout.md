# WarningCallout

A warning callout is a component used to draw attention to important alerts or potential issues that require user attention or caution. It highlights warnings, errors, or critical information that could affect the user's experience or actions, and may include additional text or links to help users understand the issue or take corrective actions.

This headless component renders an `<aside>` element with `role="alert"`, which causes screen readers to announce the content immediately when it appears. The consumer provides the warning content as children and is responsible for all visual styling.

## Implementation Notes

- Renders an `<aside>` element with `role="alert"` for immediate screen reader announcements
- The `role="alert"` implicitly sets `aria-live="assertive"`, meaning content is announced immediately
- The `label` prop is optional since the alert content itself provides the message
- Accepts `...restProps` for forwarding additional attributes to the aside element

## Props

- `label`: string (optional) -- accessible name applied via `aria-label`; useful when multiple alerts exist on the same page
- `children`: Snippet (required) -- the warning content to display

## Usage

```svelte
<WarningCallout label="Warning">
    <p>Your session is about to expire.</p>
</WarningCallout>
```

```svelte
<WarningCallout>
    <p>Unsaved changes will be lost.</p>
</WarningCallout>
```

## Keyboard Interactions

None -- this component is a passive container for alert content.

## ARIA

- `role="alert"` -- identifies the content as an alert; screen readers announce it immediately when it appears or changes
- `aria-label={label}` -- optional accessible name to distinguish this alert from others on the page

## References

- WAI-ARIA Alert Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/alert/
- WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert
