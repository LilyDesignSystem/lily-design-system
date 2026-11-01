# PopconfirmDialog

a popover dialog with confirm and cancel buttons

This is the Angular headless implementation. See `components/popconfirm-dialog/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-popconfirm-dialog
  [open]="confirming"
  title="Delete this file?"
  description="This cannot be undone."
  confirmLabel="Delete"
  cancelLabel="Keep"
  (confirmed)="delete()"
  (cancelled)="confirming = false"
></lily-popconfirm-dialog>
```

## Files

- `PopconfirmDialog.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `PopconfirmDialog.spec.ts` — vitest + TestBed render test
