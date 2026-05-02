# ScrollerVideo

A scrollytelling component where the user's scroll position drives the playback time of a muted `<video>`. As the user scrolls down through the scroller, `currentTime` advances proportionally; scrolling back up reverses it. Foreground children scroll over the sticky video the same way `Scroller` works.

The video is muted because scroll-driven scrubbing produces erratic timing that conflicts with audio.

## Props

- `className`: string (optional) — CSS class appended to `scroller-video`
- `src`: string (required) — video source URL
- `label`: string (required) — accessible label describing the video story
- `alt`: string (required) — text alternative describing the video content
- `offset`: number (default `0.5`) — step trigger position in the viewport
- `onIndexChange`: (index: number) => void — fired when the active step index changes
- `onProgressChange`: (progress: number) => void — fired with overall scroll progress (0..1)
- `children`: ReactNode (required) — foreground step content overlaid on the video
- `...restProps`: unknown — additional attributes spread onto the wrapper

## Structure

- `.scroller-video` — outer wrapper with `aria-label`
- `.scroller-video-background` — sticky region with `role="img"` and `aria-roledescription="scrollable video"`; consumer applies `position: sticky` in CSS
  - `<video class="scroller-video-element">` — the muted video element
- `.scroller-video-foreground` — the `ScrollerBase` containing scrollable step children

## Usage

```tsx
<ScrollerVideo
  src="/scenic-flyover.mp4"
  label="A scrolling flight over the coastline"
  alt="Aerial footage following a coastline from north to south"
>
  <section><h2>Northern bay</h2><p>...</p></section>
  <section><h2>Mid-coast cliffs</h2><p>...</p></section>
  <section><h2>Southern harbour</h2><p>...</p></section>
</ScrollerVideo>
```

## References

- HTML video element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
- IntersectionObserver API: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- Reuters Graphics ScrollerVideo
