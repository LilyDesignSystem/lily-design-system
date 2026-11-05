# ClipboardCopyButton

a button that copies text to the clipboard

This is the Angular headless implementation. See `components/clipboard-copy-button/index.md`
in the canonical repo root for the cross-framework documentation.

`data-copied` is true for two seconds after a copy. Copying needs a secure context, so listen for `copyError`.

## Selector

```html
<lily-clipboard-copy-button
  [text]="link"
  label="Copy link"
  (copySuccess)="copied()"
  >Copy</lily-clipboard-copy-button
>
```

## Files

- `ClipboardCopyButton.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `ClipboardCopyButton.spec.ts` — vitest + TestBed render test
