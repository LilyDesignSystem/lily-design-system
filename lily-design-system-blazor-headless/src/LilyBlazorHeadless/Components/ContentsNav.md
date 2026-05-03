# ContentsNav

A contents navigation area.

See `components/contents-nav/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `contents-nav`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ContentsNav Label="...">
    Content
</ContentsNav>
```
