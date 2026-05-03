# InsetText

Indented text to distinguish it from surrounding content.

See `components/inset-text/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `inset-text`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<InsetText>
    Content
</InsetText>
```
