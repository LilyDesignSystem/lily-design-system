# SplitButton

A button with a primary action and a dropdown for related actions.

See `components/split-button/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `split-button`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SplitButton Label="...">
    Content
</SplitButton>
```
