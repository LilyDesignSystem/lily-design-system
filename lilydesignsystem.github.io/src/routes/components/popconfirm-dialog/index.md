# Popconfirm Dialog

A popconfirm dialog is a non-modal popover dialog with confirm and
cancel buttons. It is anchored to a trigger element and uses
`role="alertdialog"` to announce the urgent confirmation prompt.

Use it for inline confirmations such as delete-item, discard-changes,
or remove-permission where a full modal dialog would be too disruptive.

## Implementation Notes

- Renders a `<div class="popconfirm-dialog">` with `role="alertdialog"` and `aria-modal="false"`
- `title` is **required** and renders inside `<h2 class="popconfirm-dialog-title">`
- Optional `description` renders inside `<p class="popconfirm-dialog-description">`
- `aria-labelledby` references the title id
- `aria-describedby` references the description id (only when present)
- `confirmLabel` and `cancelLabel` are **required**
- Two `<button type="button">` elements: `popconfirm-dialog-cancel` and `popconfirm-dialog-confirm`
- The container's `hidden` attribute reflects the `open` prop
- Consumer is responsible for anchoring the dialog near its trigger and managing focus

## Props

- `open`: boolean (default: false) -- whether the dialog is open
- `title`: string (**required**) -- dialog heading
- `description`: string (optional) -- body text
- `confirmLabel`: string (**required**) -- confirm button text
- `cancelLabel`: string (**required**) -- cancel button text
- `onconfirm` / `onConfirm`: callback (optional)
- `oncancel` / `onCancel`: callback (optional)
- `...restProps`: any additional HTML attributes

## Usage

```html
<PopconfirmDialog
  open={isOpen}
  title="Delete this item?"
  description="This action cannot be undone."
  confirmLabel="Delete"
  cancelLabel="Cancel"
  onconfirm={handleDelete}
  oncancel={handleCancel}
/>
```

## Keyboard Interactions

- Tab / Shift+Tab: Move focus between cancel and confirm buttons
- Enter / Space: Activate the focused button
- Escape: Consumer should close the dialog and call `oncancel`

## ARIA

- `role="alertdialog"` announces the urgent confirmation prompt
- `aria-modal="false"` reflects that popconfirm is not a modal
- `aria-labelledby` references the title id
- `aria-describedby` references the description id (when present)
- The container is `hidden` when `open` is false

## When to Use

- Use for inline confirmation of a destructive or non-reversible action.
- Use when the confirmation context is small and tightly coupled to the trigger.

## When Not to Use

- Do not use for complex confirmations that need extra fields — use a Dialog or AlertDialog.
- Do not block the entire page — use AlertDialog for fully modal alerts.

## Headless

Renders semantic alertdialog markup with no styling. Consumer manages
positioning relative to the trigger, focus management, escape handling,
and the visual treatment.

## Styles

Consumer CSS targets `popconfirm-dialog`, `popconfirm-dialog-title`,
`popconfirm-dialog-description`, `popconfirm-dialog-cancel`, and
`popconfirm-dialog-confirm`. Position the dialog adjacent to the trigger
with a callout arrow if appropriate.

## Testing

- Verify the component renders a `<div>` element with class `popconfirm-dialog`
- Verify `role="alertdialog"` and `aria-modal="false"` are set
- Verify the container is `hidden` when `open` is false
- Verify the title renders as an `<h2>` with class `popconfirm-dialog-title` and a stable id
- Verify `aria-labelledby` references the title id
- Verify `aria-describedby` references the description id only when description is provided
- Verify confirm and cancel buttons render with their labels and `type="button"`
- Verify confirm and cancel handlers fire on click

## Advice

- **Designers**: Place the dialog near the trigger with a clear callout. Keep `title` short and the description specific.
- **Developers**: Move focus to the cancel button (or confirm, depending on policy) when the dialog opens. Restore focus to the trigger when it closes.

## Related components

- `dialog` — a modal or non-modal dialog window
- `alert-dialog` — a modal dialog for urgent messages requiring user acknowledgment
- `popover` — a floating content box anchored to a trigger element

## References

- WAI-ARIA Alert Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
- Ant Design Popconfirm: https://ant.design/components/popconfirm
