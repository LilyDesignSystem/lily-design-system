# FileDialog

A file dialog provides a modal dialog for file-related operations such as opening, saving, or managing files. It renders a native `<dialog>` element conditionally based on its `open` state, with accessible labelling and keyboard dismissal support.

This component is useful in applications that need custom file operation interfaces, such as file managers, document editors, or content management systems. The consumer provides all dialog content -- file lists, action buttons, and navigation controls -- as children.

## Implementation Notes

- Conditionally renders a `<dialog open>` element only when `open` is true
- Uses `$bindable()` on the `open` prop for two-way state binding
- Uses the native `<dialog>` HTML element with the `open` attribute
- Sets `tabindex="-1"` to allow the dialog to receive focus programmatically
- Escape key handler sets `open` to `false`
- Spreads `restProps` onto the `<dialog>` for consumer customization

## Props

- `label`: string (required) -- accessible name for the dialog, applied as `aria-label`
- `open`: boolean (default: false) -- whether the dialog is visible, bindable via `bind:open`
- `children`: Snippet (required) -- dialog content

## Usage

```svelte
<FileDialog label="Open file" bind:open>
  <ul>
    <li>document.txt</li>
    <li>image.png</li>
  </ul>
  <button onclick={() => open = false}>Cancel</button>
</FileDialog>
```

## Keyboard Interactions

- Escape: closes the dialog by setting `open` to `false`

## ARIA

- `aria-label={label}` -- provides an accessible name for the dialog
- Native `<dialog>` element -- provides implicit `role="dialog"` semantics

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/dialog-modal/
- MDN dialog element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
