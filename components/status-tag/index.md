# StatusTag

A small inline label that names the current state of an item — "Completed", "In review", "Cannot start yet" — typically rendered next to a row in a list, a step in a workflow, or a heading on a detail page.

The component is intentionally a static label, not a live region: it renders a `<span>` with the status text inside and a `tone` prop that the consumer maps to colour. Crucially, the meaning is always carried by the visible text — colour is reinforcement, never the only indicator. WCAG 1.4.1 (Use of Colour) requires this for users who can't perceive colour.

`StatusTag` does not announce changes. If the status updating during the user's session is meaningful (e.g. "Awaiting review" → "Approved"), wrap the tag in a `Notification` or `Alert` with `aria-live="polite"`, or use `Toast` for a transient announcement. Use `Badge` for counts, `Tag` for non-status keyword labels.

## Implementation Notes

- Renders a `<span>` with the status text inside
- The semantics are conveyed by the visible text and (optionally) `aria-label` — colour alone is never the indicator
- Accepts a `tone` prop (e.g. `"success"`, `"warning"`, `"danger"`, `"info"`) which the consumer can use to drive class-based styling
- Spreads `restProps` onto the root `<span>`

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `label` | string (required) | — | Status text shown to users |
| `tone` | "neutral" | "success" | "warning" | "danger" | "info" | "neutral" | Tone hint used by consumers to drive styling |
| `...restProps` | HTML attributes | — | Spread onto the root `<span>` |

## Usage

```html
<StatusTag label="Completed" tone="success" />
<StatusTag label="Awaiting review" tone="warning" />
```

## Keyboard Interactions

- No keyboard interactions — this is a passive label

## ARIA

- `role="status"` is NOT applied by default — this component is a static label, not a live region
- Consumers wanting screen reader announcements when status changes should wrap the tag in a `Notification` or apply `aria-live="polite"` themselves

## When to Use

- Showing the current state of a task, application, or item in a list or table
- Annotating rows in a data table or list with their workflow status

## When Not to Use

- Use `Badge` for counts (number of items, notifications)
- Use `Tag` for category labels that aren't specifically about status
- Use `Alert` or `Notification` when status changes need to be announced

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.status-tag` as the root class. No default styles are included.

## Related components

- `badge` — count or category label
- `tag` — generic keyword tag
- `flair` — decorative emphasis

## References

- [GOV.UK Tag pattern](https://design-system.service.gov.uk/components/tag/)
