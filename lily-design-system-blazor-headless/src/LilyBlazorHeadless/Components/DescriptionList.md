# DescriptionList

A definition list displaying information in key-value format <dl>.

See `components/description-list/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `description-list`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<DescriptionList>
    Content
</DescriptionList>
```
