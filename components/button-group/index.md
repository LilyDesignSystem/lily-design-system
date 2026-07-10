# Button Group

A button group is a wrapper element that groups together related buttons,
typically a primary action with one or more secondary actions, so that
assistive technology can announce them as a single unit.

Use it whenever a small set of buttons share a common purpose — Save and
Cancel, Confirm and Discard, Previous and Next — and should be presented
to screen readers as one group.

## Implementation Notes

- Renders a `<div>` with `role="group"` so screen readers announce the buttons as a related set
- `label` prop is **required** — it sets `aria-label` so the group has an accessible name
- Children are the related buttons; the component does not constrain how many or which type
- No interactive state of its own — it is a passive grouping container
- Pass-through attributes are forwarded to the root `<div>`

## Props

- `label`: string (**required**) -- aria-label for the group
- `children`: slot -- the related buttons
- `...restProps`: any additional HTML attributes

## Usage

Basic group with a primary and secondary action:

```html
<ButtonGroup label="Form actions">
  <Button type="submit">Save</Button>
  <Button type="button">Cancel</Button>
</ButtonGroup>
```

Pagination-style group:

```html
<ButtonGroup label="Pagination controls">
  <Button>Previous</Button>
  <Button>Next</Button>
</ButtonGroup>
```

## Keyboard Interactions

- Tab moves focus through the buttons in the group
- All key handling is delegated to the contained buttons

## ARIA

- `role="group"` on the wrapping `<div>`
- `aria-label` provides the accessible name of the group

## When to Use

- Use when two or more related buttons should be announced together.
- Use to visually and semantically associate confirmation and dismissal actions.
- Use in toolbars, form footers, and dialog action rows.

## When Not to Use

- Do not use for a single button — wrap nothing.
- Do not use for navigation links — use a nav landmark instead.
- Do not use as a replacement for a `<fieldset>` of form inputs.

## Headless

Renders only structure: a `<div role="group" aria-label>` with consumer-supplied
buttons. The component supplies semantics and grouping; the consumer supplies
visual layout (horizontal stack, vertical stack, gap spacing).

## Styles

Consumer CSS targets the `button-group` class. Typical treatments include
horizontal flex layout with consistent gap, optional reversed order on
small screens, and matching visual weight between primary and secondary
buttons.

## Testing

- Verify the component renders a `<div>` with class `button-group`
- Verify `role="group"` is present
- Verify `aria-label` is present and equals the `label` prop
- Verify children render inside the group
- Verify additional HTML attributes pass through to the root `<div>`

## Advice

- **Designers**: Pair a primary button with at most two secondary buttons. Maintain consistent spacing across all groups in the product.
- **Developers**: Always supply a meaningful `label` that describes the group's purpose, not the buttons themselves (e.g. "Form actions" rather than "Save and Cancel").

## Related components

- `button` — a generic clickable button element
- `action-group` — a group of action buttons that can collapse to an overflow menu when space is constrained
- `segment-group` — a group of mutually exclusive segment options
- `toggle-group` — a group of toggle buttons for selecting options

## References

- US Web Design System Button Group: https://designsystem.digital.gov/components/button-group/
- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
- WCAG 1.3.1 Info and Relationships: https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships

---

Lily™ and Lily Design System™ are trademarks.
