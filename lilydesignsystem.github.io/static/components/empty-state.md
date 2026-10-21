# EmptyState

EmptyState is a headless container for the state shown when a list, table, search or inbox has nothing to display. The consumer supplies the heading, explanation and call to action as children; the component adds only a labelled group when a `label` is given. It carries no icon and no default text.

**Status:** beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)

## Implementation Notes

- Renders a `<div>` with the base class `empty-state`
- When `label` is provided adds `role="group"` and `aria-label={label}`; otherwise a plain `<div>`
- Not a live region -- it does not announce itself
- Spreads `restProps` onto the root

## Props

- `className`: string (default: `""`) -- CSS class name appended to the base class
- `label`: string (optional) -- accessible name; adds `role="group"`
- `children`: slot -- heading, text and action supplied by the consumer
- `...restProps`: unknown -- additional attributes spread onto the root

## Usage

```html
<EmptyState label="No messages">
  <h2>No messages yet</h2>
  <p>Messages you receive will appear here.</p>
  <Button type="button">Write a message</Button>
</EmptyState>
```

## Keyboard Interactions

- None. Any action inside is a native control with its own keyboard behaviour

## ARIA

- `role="group"` and `aria-label={label}` -- only when `label` is provided
- No `aria-live`: use `info-state` (`role="status"`) when the state must be announced

## When to Use

- Use when a list, table, search or section has no content yet and the user needs to know why and what to do next.
- Use for first-run screens and cleared inboxes.
- Use when the message and action are composed from your own heading, text and button.

## When Not to Use

- Do not use for a result that must be announced after a user action -- use `info-state`.
- Do not use for loading -- use `loading` or `skeleton`.
- Do not use for errors -- use `error-summary` or `alert`.

## Headless

This headless component renders a `<div>` and decides no visual treatment. There is no icon; the consumer supplies any illustration as children.

## Styles

The consumer provides all CSS styling via the `.empty-state` class.

## Testing

- Verify the root is a `<div>` with class `empty-state`
- Verify children render
- Verify no role or aria-label without `label`
- Verify `label` yields a labelled group
- Verify it is not a live region
- Verify pass-through attributes are applied

## Advice

- **Designers**: Say what is missing, why, and the next step. Keep it calm; an empty state is not an error.
- **Developers**: Choose a heading level that fits the page outline.

## Related components

- `info-state` — a status-announced info / empty / error / success panel
- `loading` — an indeterminate busy indicator
- `skeleton` — a placeholder for content in flight

## References

- NHS UK content style guide: https://service-manual.nhs.uk/content

---

Lily™ and Lily Design System™ are trademarks.
