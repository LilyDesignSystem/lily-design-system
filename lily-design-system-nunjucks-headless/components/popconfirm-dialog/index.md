# PopconfirmDialog

a popover dialog with confirm and cancel buttons

## Description

PopconfirmDialog is a lightweight, non-modal confirmation popover. It
renders a `<div role="alertdialog" aria-modal="false">` containing a
title, an optional description, a cancel button, and a confirm
button.

Use it for low-risk in-place confirmations (e.g., "Delete this row?").
For destructive blocking confirmations, prefer the modal `AlertDialog`.

## HTML tag

`<div>` with `role="alertdialog"`

## CSS class

`popconfirm-dialog`

## Params

- `open` — boolean. Default `false`. When `false`, the root is
  rendered with `hidden`.
- `title` — string. **Required.** Heading text rendered into
  `<h2 class="popconfirm-dialog-title">`.
- `description` — string. Optional body text rendered into
  `<p class="popconfirm-dialog-description">`.
- `confirmLabel` — string. **Required.** Confirm button text.
- `cancelLabel` — string. **Required.** Cancel button text.
- `id` — string. Default `"popconfirm-dialog"`. Used as a stable id
  stem; `aria-labelledby` becomes `{id}-title`, `aria-describedby`
  becomes `{id}-description`.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes on the root element.

## Usage

```njk
{% from "components/popconfirm-dialog/macro.njk" import popconfirmDialog %}

{{ popconfirmDialog({
  open: true,
  id: "delete-row-1",
  title: "Delete this row?",
  description: "This action cannot be undone.",
  confirmLabel: "Delete",
  cancelLabel: "Cancel"
}) }}
```

## Behavior

The macro renders both buttons unconditionally. Consumers wire click
handlers (e.g., via `data-action` attributes or event delegation) to
trigger confirm and cancel actions and to set `open` to `false`.

## Accessibility

- `role="alertdialog"` plus `aria-modal="false"` indicates this is a
  non-modal alert dialog.
- `aria-labelledby` always points to the title.
- `aria-describedby` is added only when `description` is supplied.
- Cancel is rendered before Confirm in the DOM so that the default
  focus order is safe.

## Headless

No CSS or JavaScript is bundled. Consumers handle open/close state,
positioning, focus management, and click handlers.

## Testing

`components/popconfirm-dialog/macro.test.js` verifies the role,
labelledby/describedby wiring, button order/labels, the `hidden`
attribute reflecting `open`, and pass-through.

## References

- [WAI-ARIA: alertdialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/)
- [Ant Design: Popconfirm](https://ant.design/components/popconfirm)
