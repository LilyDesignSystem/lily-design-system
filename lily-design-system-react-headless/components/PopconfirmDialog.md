# PopconfirmDialog

A popover dialog with confirm and cancel buttons. Use it for in-context confirmations (e.g. "Delete this item?") that float next to the action that opened them. Unlike `Dialog` / `AlertDialog`, this component is **not modal** -- `aria-modal="false"`.

## Implementation Notes

- `title`, `confirmLabel`, `cancelLabel` are non-optional
- IDs for the title and description are generated with `useId()` so `aria-labelledby` / `aria-describedby` are stable
- `aria-describedby` is only set when `description` is provided
- Visibility is controlled by the `open` prop via the `hidden` attribute

## Props

- `open`: boolean (default: `false`)
- `title`: string (**required**)
- `description`: string (optional)
- `confirmLabel`: string (**required**)
- `cancelLabel`: string (**required**)
- `onConfirm`: (event: React.MouseEvent) => void (optional)
- `onCancel`: (event: React.MouseEvent) => void (optional)
- `...restProps`: Any additional HTML attributes passed to the root `<div>`

## Usage

```tsx
<PopconfirmDialog
  open={isOpen}
  title="Delete this item?"
  description="This action cannot be undone."
  confirmLabel="Delete"
  cancelLabel="Cancel"
  onConfirm={handleDelete}
  onCancel={handleClose}
/>
```

## Keyboard Interactions

- Tab: cycle between cancel and confirm buttons
- Enter / Space on a button: activate it

## ARIA

- `role="alertdialog"` on the root
- `aria-modal="false"` (popconfirm is not modal)
- `aria-labelledby` references the `<h2>` title
- `aria-describedby` references the `<p>` description (only when present)
