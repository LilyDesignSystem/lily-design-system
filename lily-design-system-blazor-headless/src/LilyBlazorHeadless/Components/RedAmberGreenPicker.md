# RedAmberGreenPicker

A picker for selecting a red/amber/green status.

A `<fieldset role="radiogroup">` of 3 native radios (red, amber, green) sharing one `name`, as `five-star-rating-picker` is: the radios give the keys (the arrows move and check, Space checks), form submission and form reset. Each option's visible text is the consumer's, through the required status label: there is no English default, and without it an option shows its value.

See [components/red-amber-green-picker/index.md](../../../../components/red-amber-green-picker/index.md) for the cross-framework documentation.

## Parameters

- `Label`, `StatusLabel` (`Func<string, string>`): required.
- `Value` / `ValueChanged`: the checked status, two-way (`@bind-Value`; `""` = none).
- `Name` (default `"status"`), `Disabled`, `CssClass`, `AdditionalAttributes` (spread onto the fieldset).

## Usage

```razor
<RedAmberGreenPicker Label="Project status" StatusLabel="@(s => Labels[s])" @bind-Value="status" />
```

---

Lily™ and Lily Design System™ are trademarks.
