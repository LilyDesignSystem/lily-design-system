# Tour

a tour guide, such as for sightseeing, or pathways, or demonstrations, etc.

This is the Angular headless implementation. See `components/tour/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-tour></lily-tour>
```

## Files

- `Tour.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `Tour.spec.ts` — vitest + TestBed render test

## Modality

Non-modal: `role="dialog"` without `aria-modal`. A tour points at parts of the
real page and often asks the user to try them, so the page stays usable and
focus is not trapped. Escape sets `active` to false.
