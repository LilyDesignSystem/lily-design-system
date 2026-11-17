# QuantityInputDiv

A quantity entered as a number and a unit, each unit with its own min, max and step (tasks.md P29-T8). The canonical contract is
`components/quantity-input-div/index.md`.

## Props

- `CssClass`: string (optional) -- CSS class appended to `quantity-input-div`
- `Label`: string (required) -- the group's name
- `MagnitudeLabel`: string (required) -- the number input's label
- `UnitLabel`: string (required when there is more than one unit) -- the unit select's label
- `Units (QuantityUnit records)`: units (required) -- `{ value, label, min?, max?, step? }`, the first the default; the number takes the chosen unit's limits
- `@bind-Magnitude`, `@bind-Unit`: string -- the number as typed and the unit chosen; two-way
- `Name`: string (optional) -- base name for `-magnitude` and `-unit`

## Usage

```razor
<QuantityInputDiv Label="Weight" MagnitudeLabel="Amount" UnitLabel="Unit" Units="units" @bind-Magnitude="magnitude" @bind-Unit="unit" />
```
