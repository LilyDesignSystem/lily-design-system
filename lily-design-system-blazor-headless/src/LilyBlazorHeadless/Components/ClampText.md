# ClampText

A text container that truncates content to a maximum number of lines.

See `components/clamp-text/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `clamp-text`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ClampText>
    Content
</ClampText>
```
