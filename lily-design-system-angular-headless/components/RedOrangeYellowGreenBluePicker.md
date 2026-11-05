# RedOrangeYellowGreenBluePicker

a picker for selecting a five-level color status

This is the Angular headless implementation. See `components/red-orange-yellow-green-blue-picker/index.md`
in the canonical repo root for the cross-framework documentation.

The option names are the consumer's, and an empty `value` shows no status.

## Selector

```html
<lily-red-orange-yellow-green-blue-picker
  label="Rating"
  redLabel="Red"
  orangeLabel="Orange"
  yellowLabel="Yellow"
  greenLabel="Green"
  blueLabel="Blue"
  [(value)]="rating"
/>
```

## Files

- `RedOrangeYellowGreenBluePicker.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `RedOrangeYellowGreenBluePicker.spec.ts` — vitest + TestBed render test
