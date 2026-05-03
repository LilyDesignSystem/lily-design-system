# PostalCodeView

A read-only display of a postal or ZIP code.

See `components/postal-code-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `postal-code-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<PostalCodeView>
    Content
</PostalCodeView>
```
