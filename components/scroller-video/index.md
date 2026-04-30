# ScrollerVideo

A video-driven scrollytelling component with frame-by-frame scrubbing. The video playback position maps to scroll position, allowing the user to scrub through a video by scrolling while foreground step content overlays the video.

This headless component uses a `<div>` element with an `aria-label` and a muted video element whose playback is driven entirely by scroll position.

## Implementation Notes

- Uses `<div>` element with class `scroller-video`
- Video playback position maps to scroll position
- Video scrubs frame-by-frame as user scrolls
- Can use WebCodecs API for smooth frame extraction where supported
- Falls back to standard video currentTime seeking
- Video is muted (scroll-driven, not time-driven)

## Props

- `src`: string (required) -- video source URL
- `children`: slot (required) -- foreground step content overlaid on video
- `offset`: number (default: 0.5) -- viewport offset where step triggers
- `index`: number (bindable, default: 0) -- current active step index
- `progress`: number (bindable, default: 0) -- overall scroll progress (0-1)
- `label`: string (required) -- accessible label describing the video story
- `alt`: string (required) -- text alternative describing the video content
- `...restProps`: Any additional HTML attributes

## Usage

```html
<ScrollerVideo
  src="/videos/climate-story.mp4"
  label="Rising sea levels"
  alt="Animation showing coastal flooding progression from 2020 to 2050"
  bind:progress
>
  <div class="step"><p>Current sea levels</p></div>
  <div class="step"><p>Projected 2030 levels</p></div>
  <div class="step"><p>Projected 2050 levels</p></div>
</ScrollerVideo>
```

```html
<ScrollerVideo
  src="/videos/cell-division.mp4"
  label="Cell division process"
  alt="Microscope footage showing the stages of mitosis"
  bind:index
  bind:progress
>
  <div class="step"><p>Prophase: chromosomes condense.</p></div>
  <div class="step"><p>Metaphase: chromosomes align.</p></div>
  <div class="step"><p>Anaphase: chromosomes separate.</p></div>
  <div class="step"><p>Telophase: cell divides.</p></div>
</ScrollerVideo>
```

## Keyboard Interactions

- Standard scroll behavior drives video position

## ARIA

- `aria-label` on container describing the video story
- `role="img"` with `aria-roledescription="scrollable video"` on video area
- `alt` text provides a text alternative for non-visual access

## When to Use

- Use for scroll-driven video narratives where the video illustrates a progression
- Use when a video should advance frame-by-frame in sync with the reader's scroll position
- Use for data journalism, educational content, or storytelling with video evidence

## When Not to Use

- Do not use for standard video playback -- use a video player instead
- Do not use when video is supplementary rather than central to the narrative
- Do not use for short clips that are better served by autoplay or click-to-play

## Headless

This component provides a `<div>` element with scroll-driven video playback and foreground step composition, with zero visual styling. The consumer is responsible for all CSS including video sizing, foreground overlay positioning, step spacing, and responsive layout.

## Styles

The consumer provides all CSS styling. The component renders with a `.scroller-video` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `scroller-video`
- Verify `aria-label` is applied
- Verify `alt` text is provided for non-visual access
- Verify video is muted
- Verify video playback position maps to scroll position
- Verify index updates as steps scroll into view
- Verify progress updates as the user scrolls
- Verify `role="img"` and `aria-roledescription="scrollable video"` are on the video area
- Verify pass-through attributes are applied

## Advice

- **Designers**: Choose videos that communicate a clear progression. Ensure foreground text is readable over the video at every frame. Consider providing a static fallback image for users who prefer reduced motion.
- **Developers**: Always provide both `label` and `alt` props for accessibility. The `alt` text should describe the overall video content, not individual frames. Test with WebCodecs API support and the currentTime fallback. Ensure the video file is optimized for scrubbing (short GOP length).

## Related components

- `scroller` — see components.tsv
- `scroller-base` — see components.tsv
- `video-player` — see components.tsv

## References

- Reuters Graphics ScrollerVideo
- WebCodecs API: https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API
- ScrollerBase component: ../scroller-base/index.md
