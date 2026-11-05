# ScrollerVideo

A video-driven scrollytelling component with frame-by-frame scrubbing.

See `components/scroller-video/index.md` for canonical documentation.

A muted background video whose time follows the scroll, moved in the browser rather than through C#, so it keeps up.

## Parameters

- `Src`, `Label`, `Alt`: string (required)
- `Offset`: double, default 0.5
- `OnIndexChange`, `OnProgressChange`
- `ChildContent` — the steps; `CssClass`, `AdditionalAttributes`

## Usage

```razor
<ScrollerVideo Src="/river.webm" Label="The river" Alt="A river from the air">
    <section>One</section>
</ScrollerVideo>
```
