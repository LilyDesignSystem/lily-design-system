# Red Amber Green View

A RAG (Red/Amber/Green) view is a component that displays a traffic-light status value as read-only text. It is used to present previously captured RAG status data in dashboards, reports, or detail views. Red indicates a critical problem, amber signals caution or minor issues, and green means everything is on track.

The component renders as a `<span>` element with an accessible label, making the status readable by screen readers and other assistive technologies. This headless component provides the semantic structure and accessibility features while allowing consumers to apply their own visual styling, such as color-coded backgrounds or text colors.

## Implementation Notes

- Renders as `<span aria-label={label}>` displaying the RAG status value as text content
- Read-only display component, not interactive
- Value defaults to an empty string when not provided
- Uses props rune for prop destructuring
- Spreads `...restProps` on the `<span>` element for consumer extensibility
- No hardcoded user-facing strings; label and value are fully configurable

## Props

- `label`: string (required) -- accessible label for screen readers via `aria-label`
- `value`: string (default: `""`) -- the RAG status to display (e.g., "red", "amber", "green")
- `...restProps`: any additional HTML attributes spread onto the `<span>` element

## Usage

Display RAG status in a project dashboard:

```html
<RedAmberGreenView label="Project status" value="green" />
```

Display dynamic status in a summary card:

```html
<SummaryList>
  <SummaryListItem>
    <dt>Health check</dt>
    <dd><RedAmberGreenView label="Health check status" value={status} /></dd>
  </SummaryListItem>
</SummaryList>
```

With data attribute for CSS color coding:

```html
<RedAmberGreenView label="Compliance status" value="amber" data-value="amber" />
```

## Keyboard Interactions

None -- this is a passive informational display, not an interactive element.

## ARIA

- `aria-label={label}` -- provides the accessible name for the status display, allowing screen readers to announce the context of the value

## When to Use

- Use to display a red/amber/green status in read-only format in dashboards and reports.
- Use in summary cards and detail views where the RAG status has already been set.
- Use when presenting historical or locked status data that should not be edited.
- Use in tables and lists to show RAG status alongside other data fields.

## When Not to Use

- Do not use when users need to select or change the status -- use [RedAmberGreenPicker](../red-amber-green-picker/) instead.
- Do not use for five-level status display -- use [RedOrangeYellowGreenBlueView](../red-orange-yellow-green-blue-view/) instead.
- Do not use for general-purpose text display -- use a `<span>` or [Badge](../badge/) instead.

## Headless

The RedAmberGreenView headless component provides a `<span>` with `aria-label` for accessible naming and displays the RAG status value as text content. The consumer provides all visual styling, including color-coded backgrounds, text colors, or badge indicators.


## Styles

The consumer provides all CSS styling. The component renders with a `.red-amber-green-view` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `red-amber-green-view`
- Verify aria-label={label}` -- provides the accessible name for the status display, allowing screen readers to announce the context of the value
- Verify pass-through attributes are applied

## Advice

- **Designers**: Pair the color indicator with a text label (e.g., "Green - On track") so the status is understandable without relying on color alone.
- **Developers**: Apply CSS styles using the text content or a `data-*` attribute to dynamically color-code the display based on the status value.

## References

- WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status
