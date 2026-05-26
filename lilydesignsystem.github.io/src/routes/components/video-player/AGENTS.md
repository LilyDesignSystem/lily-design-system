# Video Player

## Metadata

- Component: video-player
- PascalCase: VideoPlayer
- Description: a video player with play-in-view behavior, custom controls, and IntersectionObserver support
- HTML tag: <div> containing <video>
- CSS class: .video-player
- Interactive: yes

## Key Behaviors

- Uses `<div>` container wrapping a `<video>` element
- Optional play-in-view: auto-plays when scrolled into viewport, pauses when scrolled out
- Uses IntersectionObserver for visibility detection
- Supports custom control overlays via children slot
- Poster image displayed before playback
- Native `<video>` controls shown by default

## ARIA

- `aria-label` on container -- describes the video content for screen readers
- Native `<video>` element provides built-in accessibility controls

## Keyboard

- `Space` -- toggle play/pause when video is focused
- Native video keyboard controls when using native controls

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

## Acceptance Criteria

- [ ] Renders <div> element with class="video-player"
- [ ] Has aria-label attribute on container
- [ ] <video> renders with correct src attribute
- [ ] Poster attribute applied when provided
- [ ] Native controls shown by default
- [ ] Play-in-view behavior works with IntersectionObserver when autoplay is true
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .video-player in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/video-player.html
