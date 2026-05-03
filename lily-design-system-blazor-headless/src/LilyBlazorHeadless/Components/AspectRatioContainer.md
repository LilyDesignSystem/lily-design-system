# AspectRatioContainer

A container that maintains a fixed aspect ratio.

See `components/aspect-ratio-container/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `aspect-ratio-container`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<AspectRatioContainer>
    Content
</AspectRatioContainer>
```
