# Dialog

## Overview

A modal or non-modal dialog that overlays the main interface to communicate
information or prompt users for input. Uses the native <dialog> element with
conditional rendering. Common use cases include confirmations, alerts, forms,
settings, and any interaction requiring focused user attention.

## What it does

A modal or non-modal dialog window.

## When to use

- Use for modal or non-modal content that requires focused attention.

## When not to use

- Do not use for simple confirmations that can be expressed inline.

## Usage

```svelte
<Dialog label="Confirm" bind:open>Content here</Dialog>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `open` | boolean, default false | Whether the dialog is visible; bindable. |
| `label` | string, required | Accessible name for the dialog. |
| `modal` | boolean, default true | Whether the dialog behaves as a modal. |
| `children` | Snippet, required | Dialog body content. |
| `...restProps` | additional HTML attributes spread onto the <dialog> element |  |

## Examples

```svelte
<!-- Confirmation dialog -->
<Dialog label="Confirm action" bind:open={showDialog}>
  <p>Are you sure you want to proceed?</p>
  <button onclick={() => showDialog = false}>Cancel</button>
  <button onclick={() => { handleConfirm(); showDialog = false; }}>Confirm</button>
</Dialog>

<!-- Non-modal dialog -->
<Dialog label="Notification" bind:open={showNotice} modal={false}>
  <p>Your file has been saved.</p>
</Dialog>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Dialog from "$lib/components/Dialog/Dialog.svelte";
</script>

<Dialog label="Confirm" bind:open>Content here</Dialog>
```

## Keyboard

- Escape: closes the dialog by setting open to false

## Accessibility

- role="dialog" provided natively by the <dialog> element
- aria-label provides the accessible name
- aria-modal="true" when modal prop is true, indicating focus trap
- tabindex="-1" allows the dialog to receive focus for keyboard events

## Internationalization

- The label prop accepts any string; consumers provide localized text

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/dialog-modal/
- MDN dialog element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog
