# ContainerWithFixedWidth

A centered content wrapper with a fixed max-width breakpoint.

See `components/container-with-fixed-width/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `container-with-fixed-width`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ContainerWithFixedWidth>
    Content
</ContainerWithFixedWidth>
```
