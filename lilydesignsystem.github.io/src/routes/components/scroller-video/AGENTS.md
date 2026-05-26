# ScrollerVideo

## Metadata

- Component: scroller-video
- PascalCase: ScrollerVideo
- Description: a video-driven scrollytelling component with frame-by-frame scrubbing
- HTML tag: <div>
- CSS class: .scroller-video
- Interactive: yes

## Key Behaviors

- Video playback position maps to scroll position
- Video scrubs frame-by-frame as user scrolls
- Can use WebCodecs API for smooth frame extraction where supported
- Falls back to standard video currentTime seeking
- Video is muted (scroll-driven, not time-driven)
- Inspired by Reuters Graphics ScrollerVideo component

## ARIA

- `aria-label` on container
- `role="img"` with `aria-roledescription="scrollable video"` on video area
- `alt` text for non-visual access

## Keyboard

- Standard scroll behavior drives video position

## Props

- `src`: string (required) -- video source URL
- `children`: slot (required) -- foreground step content overlaid on video
- `offset`: number (default: 0.5) -- viewport offset where step triggers
- `index`: number (bindable, default: 0) -- current active step index
- `progress`: number (bindable, default: 0) -- overall scroll progress (0-1)
- `label`: string (required) -- accessible label describing the video story
- `alt`: string (required) -- text alternative describing the video content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="scroller-video"
- [ ] Has aria-label attribute
- [ ] Video scrubs based on scroll position
- [ ] Video is muted
- [ ] Exposes bindable index and progress values
- [ ] Provides alt text for non-visual access
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .scroller-video in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/scroller-video.html
- Reuters Graphics ScrollerVideo
- WebCodecs API
