# DigitalObjectIdentifierLink

A permanent hyperlink for a Digital Object Identifier (DOI) to an electronic source.

See `components/digital-object-identifier-link/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `digital-object-identifier-link`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<DigitalObjectIdentifierLink>
    Content
</DigitalObjectIdentifierLink>
```
