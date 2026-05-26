# Video Player

A video player is a video player with play-in-view behavior, custom controls, and IntersectionObserver support. Use it for editorial video content that should play when scrolled into view and pause when scrolled out.

This headless component uses a `<div>` container with `aria-label` wrapping a `<video>` element, providing optional play-in-view behavior via IntersectionObserver and support for custom control overlays.

## Implementation Notes

- Uses `<div>` container wrapping a `<video>` element
- Optional play-in-view: auto-plays when scrolled into viewport, pauses when scrolled out
- Uses IntersectionObserver for visibility detection
- Supports custom control overlays via children slot
- Consumer can style control position and appearance
- Poster image displayed before playback
- Native `<video>` controls shown by default
- Consumer controls all visual presentation via CSS
- Inspired by Reuters Graphics Video component

## Props

- `src`: string (required) -- video source URL
- `label`: string (required) -- accessible label for the video
- `poster`: string (optional) -- poster image URL
- `autoplay`: boolean (default: false) -- auto-play when scrolled into view
- `muted`: boolean (default: false) -- muted state
- `loop`: boolean (default: false) -- loop playback
- `controls`: boolean (default: true) -- show native controls
- `caption`: slot (optional) -- video caption
- `children`: slot (optional) -- custom controls overlay
- `...restProps`: Any additional HTML attributes

## Usage

```html
<VideoPlayer
  src="/videos/report.mp4"
  label="Interview with climate scientist"
  poster="/images/interview-poster.jpg"
  autoplay
  muted
>
  <span slot="caption">Dr. Smith discusses recent findings</span>
</VideoPlayer>
```

```html
<VideoPlayer
  src="/videos/surgery-overview.mp4"
  label="GP surgery virtual tour"
  poster="/images/surgery-poster.jpg"
  controls
>
  <span slot="caption">Take a virtual tour of our new surgery</span>
</VideoPlayer>
```

```html
<VideoPlayer
  src="/videos/timelapse.mp4"
  label="Construction timelapse from January to March 2026"
  autoplay
  muted
  loop
/>
```

## Keyboard Interactions

- `Space` -- toggle play/pause when video is focused
- Native video keyboard controls are available when using native controls

## ARIA

- `aria-label` on container -- describes the video content for screen readers
- Native `<video>` element provides built-in accessibility controls

## When to Use

- Use for editorial video content with play-in-view behavior
- Use when videos should auto-play silently as the user scrolls past them
- Use when custom control overlays are needed alongside or instead of native controls

## When Not to Use

- Do not use for scroll-driven video that advances frame by frame with scroll position
- Do not use for background ambient video -- use plain `<video>` element
- Do not use for audio-only content -- use an audio player

## Headless

This component provides a `<div>` container with `aria-label` wrapping a `<video>` element, with zero visual styling. The consumer is responsible for all CSS including video sizing, aspect ratio, control overlay positioning, poster image display, responsive behavior, and any play/pause button styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.video-player` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `video-player`
- Verify `aria-label` is applied to the container
- Verify `<video>` element renders with correct `src` attribute
- Verify `poster` attribute is applied when provided
- Verify native controls are shown by default
- Verify `autoplay`, `muted`, and `loop` attributes are applied when set
- Verify play-in-view behavior: video plays when scrolled into view and pauses when scrolled out (when autoplay is true)
- Verify caption slot renders when provided
- Verify pass-through attributes are applied

## Advice

- **Designers**: Consider providing a clear poster image that communicates the video content. Ensure custom controls have sufficient contrast and touch target sizes. Plan for the video's aspect ratio across breakpoints.
- **Developers**: Always provide a descriptive `label` prop for screen reader users. When using autoplay, always set `muted` to comply with browser autoplay policies. Use IntersectionObserver with an appropriate threshold for play-in-view behavior.

## Related components

- `image` — an image element with alt text

## References

- Reuters Graphics Video component
- [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
- [HTML video element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
- [Autoplay guide for media](https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide)
