# VideoPlayer

A video player with play-in-view behavior, custom controls, and IntersectionObserver support.

See `components/video-player/index.md` for canonical documentation.

The contract's `<div>` holding a native `<video>`. `Autoplay` means play while in view, and browsers block sound, so pair it with `Muted`.

## Parameters

- `Src`, `Label`: string (required)
- `Poster`: string; `Autoplay`, `Muted`, `Loop`: bool; `Controls`: bool, default true
- `Caption`: RenderFragment; `ChildContent` — custom controls
- `CssClass`, `AdditionalAttributes` (on the root)

## Usage

```razor
<VideoPlayer Src="/tour.webm" Label="Product tour" Autoplay="true" Muted="true" />
```
