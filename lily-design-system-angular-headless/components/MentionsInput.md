# MentionsInput

a text input with at-mention autocomplete suggestions

This is the Angular headless implementation. See `components/mentions-input/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-mentions-input
  label="Comment"
  [(value)]="text"
  [expanded]="suggesting"
>
  <ul
    role="listbox"
    aria-label="People"
  >
    …
  </ul>
</lily-mentions-input>
```

## Files

- `MentionsInput.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `MentionsInput.spec.ts` — vitest + TestBed render test
