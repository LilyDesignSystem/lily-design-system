# ScrollerBase

A low-level scroll position tracking primitive for scrollytelling.

See `components/scroller-base/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `scroller-base`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ScrollerBase>
    Content
</ScrollerBase>
```
