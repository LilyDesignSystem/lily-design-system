# FiveFaceRatingPicker

A picker for selecting a 1-5 satisfaction rating using face labels.

See `components/five-face-rating-picker/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `five-face-rating-picker`
- `Value` / `ValueChanged`: int (`@bind-Value`, 0 = none) — the checked radio
- `Name`: string — the radios' shared name
- `Labels`: `IReadOnlyList<string>` — the five options' text; the numbers by default
- `Disabled`: bool — disables the whole group
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<FiveFaceRatingPicker Label="Rating" Name="rating" @bind-Value="rating" />
```

A `<fieldset role="radiogroup">` of five native radios (values 1 to 5) sharing `Name`; the browser gives the keys.
