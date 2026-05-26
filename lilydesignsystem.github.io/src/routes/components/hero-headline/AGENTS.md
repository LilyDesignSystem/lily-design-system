# Hero Headline

## Metadata

- Component: hero-headline
- PascalCase: HeroHeadline
- Description: a full-bleed hero section with headline overlaid on media
- HTML tag: <div>
- CSS class: .hero-headline
- Interactive: no

## Key Behaviors

- Full-viewport-width container with media background
- Text content overlaid on media with consumer-provided positioning
- Consumer responsible for text contrast/overlay
- Inspired by Reuters Graphics HeroHeadline component

## ARIA

- `aria-label` on container
- Media should have appropriate alt text

## Keyboard

- None -- children handle interactions

## Props

- `label`: string (required) -- accessible label for the hero section
- `children`: slot (required) -- headline content overlaid on media
- `media`: slot (required) -- background media (image or video)
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="hero-headline"
- [ ] Has aria-label attribute
- [ ] Renders media slot for background content
- [ ] Renders children slot overlaid on media
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .hero-headline in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/hero-headline.html
