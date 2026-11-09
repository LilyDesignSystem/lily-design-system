# StatusTag

A small inline label that names the current state of an item — "Completed", "In review", "Cannot start yet" — typically rendered next to a row in a list, a step in a workflow, or a heading on a detail page.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

The component is intentionally a static label, not a live region: it renders a `<span>` with the status text inside and a `type` prop, rendered as `data-type`, that the theme or consumer CSS maps to colour. Crucially, the meaning is always carried by the visible text — colour is reinforcement, never the only indicator. WCAG 1.4.1 (Use of Colour) requires this for users who can't perceive colour.

`StatusTag` does not announce changes. If the status updating during the user's session is meaningful (e.g. "Awaiting review" → "Approved"), wrap the tag in a `Notification` or `Alert` with `aria-live="polite"`, or use `Toast` for a transient announcement. Use `Badge` for counts, `Tag` for non-status keyword labels.

## Implementation Notes

- Renders a `<span>` with the status text inside
- The semantics are conveyed by the visible text and (optionally) `label`, rendered as hidden text in a `screen-reader-span` because a `<span>` cannot take a name — colour alone is never the indicator
- Accepts a `type` prop (`"default"`, `"info"`, `"success"`, `"warning"`, `"error"`), rendered as `data-type` for the theme or consumer CSS, as on `alert`, `badge` and `banner`
- Spreads `restProps` onto the root `<span>`

## Props

| Prop           | Type                                                               | Default     | Description                                                                     |
| -------------- | ------------------------------------------------------------------ | ----------- | ------------------------------------------------------------------------------- |
| `type`         | `"default"` \| `"info"` \| `"success"` \| `"warning"` \| `"error"` | `"default"` | The status, rendered as `data-type`; the themes colour `.status-tag[data-type]` |
| `label`        | string (optional)                                                  | —           | Hidden text read before the content, because a `<span>` cannot take a name      |
| `children`     | slot (required)                                                    | —           | The visible status text                                                         |
| `...restProps` | HTML attributes                                                    | —           | Spread onto the root `<span>`                                                   |

## Usage

```html
<StatusTag type="success">Completed</StatusTag>
<StatusTag
  type="warning"
  label="Status:"
  >Awaiting review</StatusTag
>
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

---

Lily™ and Lily Design System™ are trademarks.
