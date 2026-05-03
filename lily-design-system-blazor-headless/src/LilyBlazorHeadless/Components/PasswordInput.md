# PasswordInput

An input for entering a password with obscured text <input type="password">.

See `components/password-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `password-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<PasswordInput Label="...">
    Content
</PasswordInput>
```
