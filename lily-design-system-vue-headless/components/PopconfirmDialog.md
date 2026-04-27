# PopconfirmDialog

A popover dialog with confirm and cancel buttons. Uses `role="alertdialog"` with `aria-modal="false"` because popconfirm is a non-modal popover.

## Implementation Notes

- Headless: no CSS, no styles
- `title`, `confirmLabel`, and `cancelLabel` are **required** and non-optional in the TypeScript interface
- The component generates per-instance ids so multiple PopconfirmDialogs on the same page maintain stable aria-* references
- The dialog uses the `hidden` attribute when `open` is false

## Props

- `open`: boolean (default `false`) — whether the dialog is open
- `title`: string (**required**) — dialog heading text
- `description`: string — optional body text
- `confirmLabel`: string (**required**) — confirm button text
- `cancelLabel`: string (**required**) — cancel button text
- `...$attrs` — additional HTML attributes

## Events

- `confirm()` — emitted when the confirm button is activated
- `cancel()` — emitted when the cancel button is activated

## Usage

```vue
<PopconfirmDialog
    :open="open"
    title="Delete this item?"
    description="This action cannot be undone."
    confirm-label="Delete"
    cancel-label="Cancel"
    @confirm="onConfirm"
    @cancel="onCancel"
/>
```

## Keyboard Interactions

- `Tab` — moves focus among the buttons
- `Enter` / `Space` — activates the focused button
- Escape handling is the consumer's responsibility (popconfirm is non-modal)

## ARIA

- `role="alertdialog"`
- `aria-modal="false"` — popconfirm is not modal
- `aria-labelledby` points to the title heading
- `aria-describedby` points to the description (only when description is provided)

## When to Use

- Quick inline confirmation for low-risk destructive actions

## When Not to Use

- Modal confirmations — use `AlertDialog`
- Long-form multi-step flows — use `Dialog`

## Headless

The component renders semantic HTML and ARIA structure. Consumers supply text content and all visual styling.

## Testing

- Verify the root `popconfirm-dialog` class and `role="alertdialog"`
- Verify `aria-modal="false"`
- Verify `hidden` toggles with `open`
- Verify `aria-labelledby` / `aria-describedby` resolve to the title and description
- Verify confirm and cancel events

## References

- [WAI-ARIA Alert Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/)
- [Ant Design Popconfirm](https://ant.design/components/popconfirm)
