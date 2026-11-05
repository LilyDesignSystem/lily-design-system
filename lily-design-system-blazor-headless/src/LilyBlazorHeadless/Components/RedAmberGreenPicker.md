# RedAmberGreenPicker

A picker for selecting a red/amber/green status.

See `components/red-amber-green-picker/index.md` for canonical documentation.

A native `<select>` in the contract's `<div>`. The option names are the consumer's, and an empty `Value` shows no status.

## Parameters

- `Label`, `RedLabel`, `AmberLabel`, `GreenLabel`: string (required)
- `Value`, `ValueChanged`: two-way with `@bind-Value`
- `CssClass`, `AdditionalAttributes`

## Usage

```razor
<RedAmberGreenPicker Label="Status" RedLabel="Red" AmberLabel="Amber" GreenLabel="Green" @bind-Value="status" />
```
