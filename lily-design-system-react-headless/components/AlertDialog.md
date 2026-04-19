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
- Controlled `open` prop for managing dialog visibility
- Conditionally rendered to remove from DOM when closed
- `aria-modal="true"` signals modal behavior to assistive technologies
- Title rendered in a `<p><strong>` element, referenced by `aria-labelledby`
- Description rendered in a `<p>` element, referenced by `aria-describedby` when present
- Consumers are responsible for focus trapping and Escape key handling

## Props

- `open`: boolean (default: false, controlled) -- whether the dialog is visible
- `title`: string (required) -- dialog heading, referenced by aria-labelledby
- `description`: string (optional) -- dialog message, referenced by aria-describedby
- `children`: ReactNode -- action buttons and additional content
- `...restProps`: Any additional HTML attributes

## Usage

Basic confirmation dialog:

```tsx

import AlertDialog from './AlertDialog';

const [showDialog, setShowDialog] = useState(false);

function handleConfirm() {
  // perform action
  setShowDialog(false);
}

function handleCancel() {
  setShowDialog(false);
}

<button onClick={() => setShowDialog(true)}>Delete item</button>

<AlertDialog
  open={showDialog}
  onChange={setShowDialog}
  title="Confirm Deletion"
  description="Are you sure you want to delete this item? This action cannot be undone."
>
  <button onClick={handleConfirm}>Yes, delete</button>
  <button onClick={handleCancel}>Cancel</button>
</AlertDialog>
```

Simple acknowledgment dialog without description:

```tsx

import AlertDialog from './AlertDialog';

const [showAlert, setShowAlert] = useState(false);

<AlertDialog open={showAlert} onChange={setShowAlert} title="Session Expired">
  <button onClick={() => setShowAlert(false)}>OK</button>
</AlertDialog>
```

## Keyboard Interactions

- Escape: Closes the dialog (consumer must implement via onKeyDown)
- Tab: Focus should be trapped within the dialog (consumer responsibility)

## ARIA

- `role="alertdialog"`
- `aria-modal="true"`
- `aria-labelledby` references the title element
- `aria-describedby` references the description element (when present)

## References

- WAI-ARIA alertdialog role: https://www.w3.org/TR/wai-aria-1.2/#alertdialog
- WAI-ARIA Alert and Message Dialogs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
