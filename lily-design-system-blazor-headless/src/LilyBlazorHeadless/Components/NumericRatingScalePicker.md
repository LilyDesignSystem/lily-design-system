# NumericRatingScalePicker

A picker for a 0 to 10 rating, such as pain, with the consumer's words at each end.

A Blazor component that renders `<fieldset>`.

See `components/numeric-rating-scale-picker/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `Label`: string (required) — the question, rendered as the `<legend>`
- `Min`: number (optional) — the lowest value, default 0
- `Max`: number (optional) — the highest value, default 10
- `MinLabel`: string (optional) — the words for the lowest value
- `MaxLabel`: string (optional) — the words for the highest value
- `Value`: string (optional) — the chosen value (bindable or controlled)
- `Name`: string (optional) — the radios' form name, default `rating`
- `Required`: boolean (optional) — the form needs an answer

---

Lily™ and Lily Design System™ are trademarks.
