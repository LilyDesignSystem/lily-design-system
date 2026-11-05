# Select

A dropdown select element for choosing one option.

See `components/select/index.md` for canonical documentation.

An empty `Value` leaves the browser's own choice in place: the first option, or one marked `selected`.

## Parameters

- `Label`: string (required) — accessible name
- `Value`, `ValueChanged`: string — two-way with `@bind-Value`
- `Required`, `Disabled`: bool
- `CssClass`: string — extra CSS classes appended to `select`
- `ChildContent`: RenderFragment — the options
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Select Label="Subject" @bind-Value="subject">
    <Option value="general">General</Option>
    <Option value="billing">Billing</Option>
</Select>
```
