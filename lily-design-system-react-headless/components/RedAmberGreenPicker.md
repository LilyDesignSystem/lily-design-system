# RedAmberGreenPicker

A picker for selecting a red/amber/green status.

A `<fieldset role="radiogroup">` of 3 native radios (red, amber, green) sharing one `name`, as `five-star-rating-picker` is: the radios give the keys (the arrows move and check, Space checks), form submission and form reset. Each option's visible text is the consumer's, through the required status label: there is no English default, and without it an option shows its value.

See [components/red-amber-green-picker/index.md](../../components/red-amber-green-picker/index.md) for the cross-framework documentation.

## Props

- `className`, `label` (required), `statusLabel` (required), `value` (default `""`), `name` (default `"status"`),
  `disabled`, `onChange(value)`; other props spread onto the fieldset.

## Usage

```tsx
const labels: Record<string, string> = { red: "Off track", amber: "At risk", green: "On track" };

<RedAmberGreenPicker
  label="Project status"
  statusLabel={(s) => labels[s]}
  value={status}
  onChange={setStatus}
/>;
```

---

Lily™ and Lily Design System™ are trademarks.
