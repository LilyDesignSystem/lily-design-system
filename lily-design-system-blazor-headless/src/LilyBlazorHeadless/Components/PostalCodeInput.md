# PostalCodeInput

An input for entering a postal or ZIP code.

See `components/postal-code-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `postal-code-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<PostalCodeInput Label="...">
    Content
</PostalCodeInput>
```
