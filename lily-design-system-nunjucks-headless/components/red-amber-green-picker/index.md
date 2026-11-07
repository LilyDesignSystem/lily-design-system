# RedAmberGreenPicker

A picker for selecting a red/amber/green status.

## Canonical documentation

See [components/red-amber-green-picker/index.md](../../../components/red-amber-green-picker/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

A `<fieldset role="radiogroup">` of 3 native radios (red, amber, green) sharing one `name`, as `five-star-rating-picker` is: the radios give the keys (the arrows move and check, Space checks), form submission and form reset. Each option's visible text is the consumer's, through the required `statusLabels` object: there is no English default, and without it an option shows its value.

```njk
{% from "components/red-amber-green-picker/macro.njk" import redAmberGreenPicker %}

{{ redAmberGreenPicker({ label: "Project status", value: "amber", statusLabels: { red: "Off track", amber: "At risk", green: "On track" } }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
