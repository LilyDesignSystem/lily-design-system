# SlideOutDrawer

A drawer that slides out from the side of the page.

See `components/slide-out-drawer/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `slide-out-drawer`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SlideOutDrawer Label="...">
    Content
</SlideOutDrawer>
```
