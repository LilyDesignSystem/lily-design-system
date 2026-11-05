# InputWithMask

An input displaying a format mask placeholder for the user to fill in.

See `components/input-with-mask/index.md` for canonical documentation.

The mask is shown, and exposed as `data-mask`; the component does not change what is typed.

## Parameters

- `Label`, `Mask`: string (required)
- `Value`, `ValueChanged`: two-way with `@bind-Value`
- `Placeholder`: string; `Disabled`: bool
- `CssClass`, `AdditionalAttributes`

## Usage

```razor
<InputWithMask Label="Phone" Mask="___-____" @bind-Value="phone" />
```
