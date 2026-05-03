# Pictogram

An icon-based component pairing an icon with a title and description in a centered or side layout.

See `components/pictogram/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `pictogram`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Pictogram>
    Content
</Pictogram>
```
