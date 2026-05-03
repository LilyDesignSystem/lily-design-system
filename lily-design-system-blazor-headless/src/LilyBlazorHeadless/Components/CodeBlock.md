# CodeBlock

A block of formatted code with optional line numbers and line highlighting.

See `components/code-block/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `code-block`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<CodeBlock>
    Content
</CodeBlock>
```
