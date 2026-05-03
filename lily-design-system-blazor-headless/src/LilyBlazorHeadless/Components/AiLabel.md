# AiLabel

An indicator of AI instances that is a pathway to AI explainability.

See `components/ai-label/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `ai-label`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<AiLabel>
    Content
</AiLabel>
```
