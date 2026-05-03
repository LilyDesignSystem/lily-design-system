# GoToTop

A link that returns users to the top of a long page.

See `components/go-to-top/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `go-to-top`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<GoToTop Label="...">
    Content
</GoToTop>
```
