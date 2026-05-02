# VideoPlayer

A `<video>` player rendered inside a `<figure>`. Supports autoplay-on-scroll via `IntersectionObserver`: when `autoplay` is true, the video plays when scrolled into the viewport and pauses when scrolled out. Native browser controls show by default.

## Props

- `src`: string (required) — video source URL
- `label`: string (required) — accessible label for the video (`aria-label`)
- `poster`: string (optional) — poster image URL
- `autoplay`: boolean (default `false`) — auto-play when scrolled into view
- `muted`: boolean (default `false`)
- `loop`: boolean (default `false`)
- `controls`: boolean (default `true`)

## Slots

- default — custom controls overlay rendered in `.video-player-controls`
- `caption` — caption rendered inside `<figcaption>`

## Usage

```vue
<VideoPlayer
  src="/demo.mp4"
  label="Product demo"
  poster="/demo-poster.jpg"
  autoplay
  muted
>
  <template #caption>Walkthrough of the new dashboard</template>
</VideoPlayer>
```

## References

- HTML video element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
- IntersectionObserver API: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
