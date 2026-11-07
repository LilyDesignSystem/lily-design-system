# RedOrangeYellowGreenBluePicker

A picker for selecting a five-level color status.

A `<fieldset role="radiogroup">` of 5 native radios (red, orange, yellow, green, blue) sharing one `name`, as `five-star-rating-picker` is: the radios give the keys (the arrows move and check, Space checks), form submission and form reset. Each option's visible text is the consumer's, through the required status label: there is no English default, and without it an option shows its value.

See [components/red-orange-yellow-green-blue-picker/index.md](../../components/red-orange-yellow-green-blue-picker/index.md) for the cross-framework documentation.

## Props

- `label` (required), `statusLabel` (required), `v-model` (default `""`), `name` (default `"status"`), `disabled`;
  other attributes fall through to the fieldset.

## Usage

```vue
<RedOrangeYellowGreenBluePicker
  label="Risk level"
  :status-label="(s) => labels[s]"
  v-model="status"
/>
```

---

Lily™ and Lily Design System™ are trademarks.
