# Blockquote

A block-level quotation with optional source citation.

See `components/blockquote/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `blockquote`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Blockquote>
    Content
</Blockquote>
```
