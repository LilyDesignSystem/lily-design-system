# Hero Headline

A hero headline is a full-bleed hero section with headline content overlaid on media. It creates an immersive editorial introduction combining large background imagery or video with prominent text.

This headless component uses a `<div>` element with an `aria-label` to create a labeled container for the hero content overlaid on background media.

## Implementation Notes

- Uses `<div>` element as container
- `aria-label` describes the hero section for screen readers
- Contains slots for media background and overlaid headline content
- Consumer responsible for text contrast, overlay, and positioning
- Inspired by Reuters Graphics HeroHeadline component

## Props

- `label`: string (required) -- accessible label for the hero section
- `children`: slot (required) -- headline content overlaid on media
- `media`: slot (required) -- background media (image or video)
- `...restProps`: Any additional HTML attributes

## Usage

```html
<HeroHeadline label="Feature story">
  <img slot="media" src="hero.jpg" alt="Aerial view of city" />
  <h1>The Changing Skyline</h1>
  <p>How urban development is reshaping cities</p>
</HeroHeadline>
```

```html
<HeroHeadline label="Investigation">
  <video slot="media" autoplay muted loop>
    <source src="ocean.mp4" type="video/mp4" />
  </video>
  <h1>Rising Waters</h1>
  <p>Climate change and coastal communities</p>
</HeroHeadline>
```

```html
<HeroHeadline label="Photo essay">
  <img slot="media" src="landscape.jpg" alt="Mountain landscape at dawn" />
  <h1>Into the Wild</h1>
  <p>A photographic journey through national parks</p>
  <Byline>By Jane Smith</Byline>
</HeroHeadline>
```

## Keyboard Interactions

- None -- children handle their own keyboard interactions

## ARIA

- `aria-label` on container -- describes the hero section for screen readers
- Media should have appropriate alt text

## When to Use

- Use for immersive editorial story introductions with large media
- Use at the top of long-form articles or features where visual impact matters
- Use when background media is integral to the story being told

## When Not to Use

- Do not use on transactional pages -- keep forms focused without large visual elements
- Do not use without meaningful media content -- use Hero for text-only heroes
- Do not use multiple hero headlines on one page

## Headless

This component provides a `<div>` container with `aria-label` and media/content slots, with zero visual styling. The consumer is responsible for all CSS including full-bleed layout, media sizing, text overlay positioning, contrast treatment, and responsive behavior.

## Styles

The consumer provides all CSS styling. The component renders with a `.hero-headline` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `hero-headline`
- Verify `aria-label` is applied
- Verify media slot renders background content
- Verify children slot renders overlaid content
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure text remains readable over media at all viewport sizes. Provide sufficient contrast between text and background. Consider how media crops at different screen sizes.
- **Developers**: Always provide a descriptive `label` prop for accessibility. Ensure media has appropriate alt text. Consider lazy loading for large media assets. Test text readability across viewport sizes.

## Related components

- `hero` — a large box or image with a title and description

## References

- [MDN HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
