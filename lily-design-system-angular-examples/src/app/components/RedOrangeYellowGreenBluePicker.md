# RedOrangeYellowGreenBluePicker

A picker for selecting a five-level color status.

A `<fieldset role="radiogroup">` of 5 native radios (red, orange, yellow, green, blue) sharing one `name`, as `five-star-rating-picker` is: the radios give the keys (the arrows move and check, Space checks), form submission and form reset. Each option's visible text is the consumer's, through the required status label: there is no English default, and without it an option shows its value.

See [components/red-orange-yellow-green-blue-picker/index.md](../../../../components/red-orange-yellow-green-blue-picker/index.md) for the cross-framework documentation.

## Selector

```html
<lily-red-orange-yellow-green-blue-picker
  label="Risk level"
  [statusLabel]="statusText"
  [(value)]="status"
/>
```

`statusText` is a component method, e.g. `statusText = (s: string) => this.labels[s];`.

## Files

- `RedOrangeYellowGreenBluePicker.ts` — standalone Angular component (signal inputs, OnPush)
- `RedOrangeYellowGreenBluePicker.spec.ts` — vitest + TestBed test

---

Lily™ and Lily Design System™ are trademarks.
