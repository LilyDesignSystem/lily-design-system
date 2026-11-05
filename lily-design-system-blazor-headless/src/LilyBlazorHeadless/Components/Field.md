# Field

A form field wrapper with label, input, and error message.

See `components/field/index.md` for canonical documentation.

Give the control the same id as `InputId`, so the label names it. Point its `aria-describedby` at `{InputId}-desc` and `{InputId}-error`.

## Parameters

- `Label`: string (required) — the visible label
- `Description`, `Error`: string; `Required`: bool
- `InputId`: string — the id of the control inside
- `ChildContent`, `CssClass`, `AdditionalAttributes`

## Usage

```razor
<Field Label="Email" InputId="email" Error="@error">
    <EmailInput id="email" Label="Email" @bind-Value="email" />
</Field>
```
