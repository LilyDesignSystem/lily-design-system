# PasswordInputOrTextInputDiv

An input for entering a password <input type="password"> or text <input type="text"> with show/hide toggle.

See `components/password-input-or-text-input-div/index.md` for canonical documentation.

## Parameters

- `Label`, `ToggleLabel`: string (required)
- `Value`, `ValueChanged`: two-way with `@bind-Value`
- `ShowToggle`: bool, default true; `Required`, `Disabled`: bool
- `CssClass`, `AdditionalAttributes`

## Usage

```razor
<PasswordInputOrTextInputDiv Label="Password" ToggleLabel="Show password" @bind-Value="password" />
```
