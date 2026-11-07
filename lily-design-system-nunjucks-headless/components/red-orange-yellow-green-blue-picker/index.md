# RedOrangeYellowGreenBluePicker

A picker for selecting a five-level color status.

## Canonical documentation

See [components/red-orange-yellow-green-blue-picker/index.md](../../../components/red-orange-yellow-green-blue-picker/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

A `<fieldset role="radiogroup">` of 5 native radios (red, orange, yellow, green, blue) sharing one `name`, as `five-star-rating-picker` is: the radios give the keys (the arrows move and check, Space checks), form submission and form reset. Each option's visible text is the consumer's, through the required `statusLabels` object: there is no English default, and without it an option shows its value.

```njk
{% from "components/red-orange-yellow-green-blue-picker/macro.njk" import redOrangeYellowGreenBluePicker %}

{{ redOrangeYellowGreenBluePicker({ label: "Risk level", value: "orange", statusLabels: { red: "Severe", orange: "High", yellow: "Medium", green: "Low", blue: "Informational" } }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
