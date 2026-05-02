# ScrollerVideo

Scroll-driven video: as the user scrolls through the scroller, the muted `<video>` `currentTime` advances proportionally. Foreground children scroll over the sticky video the way `Scroller` works.

The video is muted because scroll-driven scrubbing produces erratic timing that conflicts with audio.

## Props

- `src`: string (required) — video source URL
- `label`: string (required) — accessible label describing the video story
- `alt`: string (required) — text alternative describing the video content
- `offset`: number (default `0.5`) — step trigger position in the viewport

## Emits

- `indexChange` — active step index changed
- `progressChange` — overall scroll progress (0..1)

## Slots

- default — foreground step content overlaid on the video

## Structure

- `.scroller-video` — outer wrapper with `aria-label`
- `.scroller-video-background` — sticky region with `role="img"` + `aria-roledescription="scrollable video"`
  - `<video class="scroller-video-element">` — the muted video element
- `.scroller-video-foreground` — the `ScrollerBase` containing scrollable step children

## Usage

```vue
<ScrollerVideo
  src="/scenic-flyover.mp4"
  label="A scrolling flight over the coastline"
  alt="Aerial footage following a coastline from north to south"
>
  <section><h2>Northern bay</h2></section>
  <section><h2>Mid-coast cliffs</h2></section>
  <section><h2>Southern harbour</h2></section>
</ScrollerVideo>
```

## References

- HTML video element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
- IntersectionObserver API: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
