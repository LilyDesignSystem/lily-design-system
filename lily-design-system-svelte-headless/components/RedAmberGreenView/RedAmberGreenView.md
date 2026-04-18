# RedAmberGreenView

A RAG (Red/Amber/Green) status view is a component that displays a traffic-light status value as read-only text. It is used to present previously captured RAG status data in dashboards, reports, or detail views. Red indicates a critical problem, amber signals caution or minor issues, and green means everything is on track.

The component renders as a `<span>` element with an accessible label, making the status readable by screen readers and other assistive technologies. This headless component provides the semantic structure and accessibility features while allowing consumers to apply their own visual styling, such as color-coded backgrounds or text colors.

## Implementation Notes

- Renders as `<span aria-label={label}>` displaying the RAG status value as text content
- Read-only display component, not interactive
- Value defaults to an empty string when not provided
- Uses Svelte 5 `$props()` rune for prop destructuring
- Spreads `...restProps` on the `<span>` element for consumer extensibility
- No hardcoded user-facing strings; label and value are fully configurable

## Props

- `label`: string (required) -- accessible label for screen readers via `aria-label`
- `value`: string (default: `""`) -- the RAG status to display (e.g., "red", "amber", "green")
- `...restProps`: any additional HTML attributes spread onto the `<span>` element

## Usage

```svelte
<RedAmberGreenView label="Project status" value="green" />
```

```svelte
<RedAmberGreenView label="Health check" value={status} />
```

## Keyboard Interactions

None -- this is a passive informational display, not an interactive element.

## ARIA

- `aria-label={label}` -- provides the accessible name for the status display, allowing screen readers to announce the context of the value

## References

- WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status
