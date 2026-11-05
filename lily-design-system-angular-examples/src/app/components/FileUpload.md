# FileUpload

a drag-and-drop area for uploading files

This is the Angular headless implementation. See `components/file-upload/index.md`
in the canonical repo root for the cross-framework documentation.

The status is the consumer's words, from `selectedLabel`.

## Selector

```html
<lily-file-upload label="Choose files" [multiple]="true" [selectedLabel]="chosen" (filesChange)="add($event)" />
```

## Files

- `FileUpload.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `FileUpload.spec.ts` — vitest + TestBed render test
