# RedAmberGreenPicker

A picker for selecting a red/amber/green status.

A `<fieldset role="radiogroup">` of 3 native radios (red, amber, green) sharing one `name`, as `five-star-rating-picker` is: the radios give the keys (the arrows move and check, Space checks), form submission and form reset. Each option's visible text is the consumer's, through the required status label: there is no English default, and without it an option shows its value.

See [components/red-amber-green-picker/index.md](../../components/red-amber-green-picker/index.md) for the cross-framework documentation.

## Selector

```html
<lily-red-amber-green-picker
  label="Project status"
  [statusLabel]="statusText"
  [(value)]="status"
/>
```

`statusText` is a component method, e.g. `statusText = (s: string) => this.labels[s];`.

## Files

- `RedAmberGreenPicker.ts` — standalone Angular component (signal inputs, OnPush)
- `RedAmberGreenPicker.spec.ts` — vitest + TestBed test

---

Lily™ and Lily Design System™ are trademarks.
