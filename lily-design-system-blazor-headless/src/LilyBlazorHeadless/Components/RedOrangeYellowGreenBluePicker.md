# RedOrangeYellowGreenBluePicker

A picker for selecting a five-level color status.

See `components/red-orange-yellow-green-blue-picker/index.md` for canonical documentation.

A native `<select>` in the contract's `<div>`. The option names are the consumer's, and an empty `Value` shows no status.

## Parameters

- `Label`, `RedLabel`, `OrangeLabel`, `YellowLabel`, `GreenLabel`, `BlueLabel`: string (required)
- `Value`, `ValueChanged`: two-way with `@bind-Value`
- `CssClass`, `AdditionalAttributes`

## Usage

```razor
<RedOrangeYellowGreenBluePicker Label="Rating" RedLabel="Red" OrangeLabel="Orange" YellowLabel="Yellow" GreenLabel="Green" BlueLabel="Blue" @bind-Value="rating" />
```
