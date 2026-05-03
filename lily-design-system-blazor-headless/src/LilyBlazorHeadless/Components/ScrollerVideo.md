# ScrollerVideo

A video-driven scrollytelling component with frame-by-frame scrubbing.

See `components/scroller-video/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `scroller-video`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ScrollerVideo Label="...">
    Content
</ScrollerVideo>
```
