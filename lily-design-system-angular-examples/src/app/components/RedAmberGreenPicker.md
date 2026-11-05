# RedAmberGreenPicker

a picker for selecting a red/amber/green status

This is the Angular headless implementation. See `components/red-amber-green-picker/index.md`
in the canonical repo root for the cross-framework documentation.

The option names are the consumer's, and an empty `value` shows no status.

## Selector

```html
<lily-red-amber-green-picker label="Status" redLabel="Red" amberLabel="Amber" greenLabel="Green" [(value)]="status" />
```

## Files

- `RedAmberGreenPicker.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `RedAmberGreenPicker.spec.ts` — vitest + TestBed render test
