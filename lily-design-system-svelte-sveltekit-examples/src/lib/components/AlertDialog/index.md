# AlertDialog

## Overview

A headless modal alert dialog for critical interactions that require user
acknowledgment before continuing. Uses the native HTML <dialog> element
with the ARIA alertdialog role. Distinguished from regular Dialog by the
alertdialog role, which signals to assistive technologies that the content
requires immediate attention.

Common uses: confirming irreversible actions ("Delete this item?"),
warning about unsaved changes, or displaying critical error messages.

## What it does

A modal dialog for urgent messages requiring user acknowledgment.

## When to use

- Use for modal or non-modal content that requires focused attention.

## When not to use

- Do not use for simple confirmations that can be expressed inline.

## Usage

```svelte
<AlertDialog bind:open title="Confirm" description="Are you sure?">
  <button>Yes</button>
  <button>No</button>
</AlertDialog>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `open` | boolean, default false, bindable | Whether the dialog is visible. |
| `title` | string, required | Dialog heading, referenced by aria-labelledby. |
| `description` | string, optional | Dialog message, referenced by aria-describedby. |
| `children` | Snippet, required | Action buttons and additional content. |
| `...restProps` | additional HTML attributes spread onto <dialog> |  |

## Examples

```svelte
<!-- Confirmation dialog with description -->
<AlertDialog bind:open={showDialog} title="Confirm Deletion"
  description="This action cannot be undone.">
  <button onclick={handleConfirm}>Yes, delete</button>
  <button onclick={handleCancel}>Cancel</button>
</AlertDialog>

<!-- Simple acknowledgment dialog -->
<AlertDialog bind:open={showAlert} title="Session Expired">
  <button onclick={() => showAlert = false}>OK</button>
</AlertDialog>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import AlertDialog from "$lib/components/AlertDialog/AlertDialog.svelte";
</script>

<AlertDialog bind:open title="Confirm" description="Are you sure?">
  <button>Yes</button>
  <button>No</button>
</AlertDialog>
```

## Keyboard

- Escape: Consumer must implement via onkeydown to close the dialog
- Tab: Consumer should implement focus trapping within the dialog

## Accessibility

- role="alertdialog" signals critical content requiring acknowledgment
- aria-modal="true" indicates modal behavior to assistive technologies
- aria-labelledby references the title element
- aria-describedby references the description element (when present)
- Conditionally rendered with {#if open} to remove from DOM when closed

## Internationalization

- Title and description come through props
- Action buttons come through children snippet
- No hardcoded strings

## References

- WAI-ARIA alertdialog role: https://www.w3.org/TR/wai-aria-1.2/#alertdialog
- WAI-ARIA Alert and Message Dialogs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
