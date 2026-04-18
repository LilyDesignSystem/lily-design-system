# AlertDialog

An alert dialog is a modal dialog that interrupts the user's workflow to
communicate critical information and require a response. Unlike regular dialogs,
alert dialogs demand immediate attention -- they are used for important warnings,
confirmations of destructive actions, or error conditions that must be
acknowledged before the user can continue.

Alert dialogs are distinguished from standard dialogs by the `alertdialog` ARIA
role, which signals to assistive technologies that the content requires the
user's immediate attention. Common uses include confirming irreversible actions
(e.g., "Delete this item?"), warning about unsaved changes, or displaying
critical error messages that require acknowledgment.

## Implementation Notes

- Uses native HTML `<dialog>` element with the `open` attribute for visibility
- `role="alertdialog"` distinguishes from regular dialogs -- indicates critical content requiring acknowledgment
- `$bindable()` open prop for two-way binding of dialog visibility
- Conditionally rendered with `{#if open}` to remove from DOM when closed
- `aria-modal="true"` signals modal behavior to assistive technologies
- Title rendered in a `<p><strong>` element, referenced by `aria-labelledby`
- Description rendered in a `<p>` element, referenced by `aria-describedby` when present
- Consumers are responsible for focus trapping and Escape key handling

## Props

- `open`: boolean (default: false, bindable) -- whether the dialog is visible
- `title`: string (required) -- dialog heading, referenced by aria-labelledby
- `description`: string (optional) -- dialog message, referenced by aria-describedby
- `children`: Snippet -- action buttons and additional content
- `...restProps`: Any additional HTML attributes

## Usage

Basic confirmation dialog:

```svelte
<script lang="ts">
  import AlertDialog from './AlertDialog.svelte';

  let showDialog = $state(false);

  function handleConfirm() {
    // perform action
    showDialog = false;
  }

  function handleCancel() {
    showDialog = false;
  }
</script>

<button onclick={() => showDialog = true}>Delete item</button>

<AlertDialog
  bind:open={showDialog}
  title="Confirm Deletion"
  description="Are you sure you want to delete this item? This action cannot be undone."
>
  <button onclick={handleConfirm}>Yes, delete</button>
  <button onclick={handleCancel}>Cancel</button>
</AlertDialog>
```

Simple acknowledgment dialog without description:

```svelte
<script lang="ts">
  import AlertDialog from './AlertDialog.svelte';

  let showAlert = $state(false);
</script>

<AlertDialog bind:open={showAlert} title="Session Expired">
  <button onclick={() => showAlert = false}>OK</button>
</AlertDialog>
```

## Keyboard Interactions

- Escape: Closes the dialog (consumer must implement via onkeydown)
- Tab: Focus should be trapped within the dialog (consumer responsibility)

## ARIA

- `role="alertdialog"`
- `aria-modal="true"`
- `aria-labelledby` references the title element
- `aria-describedby` references the description element (when present)

## References

- WAI-ARIA alertdialog role: https://www.w3.org/TR/wai-aria-1.2/#alertdialog
- WAI-ARIA Alert and Message Dialogs Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/alertdialog/
