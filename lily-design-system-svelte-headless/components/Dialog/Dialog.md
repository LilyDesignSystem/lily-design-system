# Dialog

A modal or non-modal dialog that overlays the main interface to communicate information or prompt users for input. Dialogs are used for confirmations, alerts, forms, settings, and any interaction that requires focused user attention. Modal dialogs block interaction with the underlying page until dismissed, while non-modal dialogs allow background interaction.

This component uses the native `<dialog>` HTML element with conditional rendering. When `open` is false, the dialog is removed from the DOM entirely. The dialog supports keyboard dismissal via the Escape key and exposes a bindable `open` prop for programmatic control of visibility.

## Implementation Notes

- Renders a native `<dialog>` element conditionally using `{#if open}`
- Uses `$bindable()` on the `open` prop for two-way binding with the parent
- The `open` HTML attribute is set directly on the dialog element (not using `.showModal()`)
- `tabindex="-1"` is set on the dialog to ensure it can receive focus and keyboard events
- Escape key handler sets `open` to false and prevents default browser behavior
- The `modal` prop controls whether `aria-modal` is set (defaults to true)
- When `modal` is false, `aria-modal` is omitted entirely (set to `undefined`)
- Accepts a `children` Snippet for dialog content including buttons, forms, or text
- Spreads `restProps` onto the `<dialog>` element for consumer customization

## Props

- `open`: boolean (default: false) -- whether the dialog is visible; bindable
- `label`: string (required) -- accessible name for the dialog
- `modal`: boolean (default: true) -- whether the dialog behaves as a modal
- `children`: Snippet (required) -- dialog body content

## Usage

```svelte
<script lang="ts">
  let showDialog = $state(false);
</script>

<button onclick={() => showDialog = true}>Open Dialog</button>

<Dialog label="Confirm action" bind:open={showDialog}>
  <p>Are you sure you want to proceed?</p>
  <button onclick={() => showDialog = false}>Cancel</button>
  <button onclick={() => { handleConfirm(); showDialog = false; }}>Confirm</button>
</Dialog>
```

```svelte
<!-- Non-modal dialog -->
<Dialog label="Notification" bind:open={showNotice} modal={false}>
  <p>Your file has been saved.</p>
</Dialog>
```

## Keyboard Interactions

- Escape: closes the dialog by setting `open` to false

## ARIA

- `role="dialog"` -- provided natively by the `<dialog>` element
- `aria-label="{label}"` -- provides an accessible name for the dialog
- `aria-modal="true"` -- present when the `modal` prop is true, indicating the dialog traps focus and blocks background interaction
- `tabindex="-1"` -- allows the dialog element itself to receive focus for keyboard event handling

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/dialog-modal/
- MDN dialog element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog
