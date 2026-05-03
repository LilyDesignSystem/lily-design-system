# PasswordInputOrTextInputDiv

An input for entering a password <input type="password"> or text <input type="text"> with show/hide toggle.

See `components/password-input-or-text-input-div/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `password-input-or-text-input-div`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<PasswordInputOrTextInputDiv Label="...">
    Content
</PasswordInputOrTextInputDiv>
```
