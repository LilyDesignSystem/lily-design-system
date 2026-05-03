# VideoPlayer

A video player with play-in-view behavior, custom controls, and IntersectionObserver support.

See `components/video-player/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `video-player`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<VideoPlayer Label="...">
    Content
</VideoPlayer>
```
