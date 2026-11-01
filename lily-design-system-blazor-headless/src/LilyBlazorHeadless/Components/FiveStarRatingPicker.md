# FiveStarRatingPicker

A picker for selecting a 1-5 star rating using radio buttons.

See `components/five-star-rating-picker/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `five-star-rating-picker`
- `Value` / `ValueChanged`: int (`@bind-Value`, 0 = none) — the checked radio
- `Name`: string — the radios' shared name
- `StarLabel`: `Func<int, string>?` — each option's text; the number alone by default
- `Disabled`: bool — disables the whole group
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<FiveStarRatingPicker Label="Rating" Name="rating" @bind-Value="rating" />
```

A `<fieldset role="radiogroup">` of five native radios (values 1 to 5) sharing `Name`; the browser gives the keys.
