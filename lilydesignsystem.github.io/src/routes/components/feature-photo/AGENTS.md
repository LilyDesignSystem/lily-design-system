# Feature Photo

## Metadata

- Component: feature-photo
- PascalCase: FeaturePhoto
- Description: a responsive photo with lazy loading and alt text validation
- HTML tag: <figure>
- CSS class: .feature-photo
- Interactive: no

## Key Behaviors

- Uses `<figure>` element with `<img>` and optional `<figcaption>`
- Native lazy loading via `loading="lazy"` attribute by default
- Alt text is required; implementation should warn when missing
- Caption and credit displayed in `<figcaption>`
- Width and height attributes prevent layout shift (CLS)

## ARIA

- Implicit `figure` role from `<figure>` element
- `alt` on `<img>` -- provides text alternative for screen readers
- `<figcaption>` -- provides visible caption and credit text

## Keyboard

- None -- the photo is not interactive

## Props

- `src`: string (required) -- image source URL
- `alt`: string (required) -- alt text describing the image
- `caption`: slot (optional) -- photo caption
- `credit`: slot (optional) -- photographer/source credit
- `loading`: "lazy" | "eager" (default: "lazy") -- image loading strategy
- `width`: number (optional) -- intrinsic image width for aspect ratio
- `height`: number (optional) -- intrinsic image height for aspect ratio
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <figure> element with class="feature-photo"
- [ ] <img> has required alt attribute
- [ ] <img> has loading="lazy" by default
- [ ] Width and height attributes applied to <img> when provided
- [ ] Caption and credit render inside <figcaption> when provided
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .feature-photo in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/feature-photo.html
