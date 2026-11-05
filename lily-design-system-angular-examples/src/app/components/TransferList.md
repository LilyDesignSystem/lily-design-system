# TransferList

a dual list box for moving items between two lists

This is the Angular headless implementation. See `components/transfer-list/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-transfer-list
  label="Team members"
  sourceLabel="Available"
  targetLabel="Selected"
>
  <ul
    source
    role="listbox"
    aria-label="Available people"
  >
    …
  </ul>
  <button
    actions
    type="button"
  >
    Add
  </button>
  <ul
    target
    role="listbox"
    aria-label="Selected people"
  >
    …
  </ul>
</lily-transfer-list>
```

## Files

- `TransferList.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `TransferList.spec.ts` — vitest + TestBed render test
