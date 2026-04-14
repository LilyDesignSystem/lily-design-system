# Carousel

A carousel is a region component for cycling through a set of slides or content items, such as image galleries, product showcases, or testimonial rotators. It provides the semantic container with appropriate ARIA roledescription so assistive technologies announce it as a carousel.

The consumer is responsible for providing the slide content as children and implementing navigation controls (previous/next buttons, pagination dots, autoplay logic, etc.). This headless approach gives full control over navigation behavior, animation, and layout while ensuring accessibility compliance.

## Implementation Notes

- Renders a `<div>` with `role="region"` and `aria-roledescription="carousel"` to communicate the carousel pattern to screen readers.
- The `aria-label` prop provides an accessible name for the region.
- Slide content is passed via the `children` slot, allowing any markup structure.
- Spreads `restProps` onto the container for consumer customization.
- No internal state management for active slide; consumers manage slide state externally.

## Props

- `label`: string (required) -- accessible name for the carousel region, applied via `aria-label`.
- `children`: slot (required) -- slide content to render inside the carousel container.
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`.

## Usage

```html
<Carousel label="Customer testimonials">
  <div role="group" aria-roledescription="slide" aria-label="Slide 1 of 3">
    <blockquote>
      <p>"The service transformed how we manage patient records."</p>
      <cite>Dr Sarah Mitchell, GP</cite>
    </blockquote>
  </div>
  <div role="group" aria-roledescription="slide" aria-label="Slide 2 of 3">
    <blockquote>
      <p>"Setup took less than a day and the team was incredibly helpful."</p>
      <cite>James O'Brien, Practice Manager</cite>
    </blockquote>
  </div>
  <div role="group" aria-roledescription="slide" aria-label="Slide 3 of 3">
    <blockquote>
      <p>"We reduced administrative time by 40% in the first month."</p>
      <cite>Nurse Karen Phillips</cite>
    </blockquote>
  </div>
</Carousel>
```

```html
<Carousel label="Featured articles">
  <div role="group" aria-roledescription="slide" aria-label="Slide 1 of 2">
    <Image src="/images/article-1.jpg" alt="Accessible design patterns" />
    <h3>Building Accessible Forms</h3>
    <p>Learn how to create forms that work for everyone.</p>
  </div>
  <div role="group" aria-roledescription="slide" aria-label="Slide 2 of 2">
    <Image src="/images/article-2.jpg" alt="Component composition" />
    <h3>Component Composition Patterns</h3>
    <p>How to combine headless components for complex UIs.</p>
  </div>
</Carousel>
```

## Keyboard Interactions

None -- this component is a passive container. The consumer should implement keyboard navigation for slide controls (e.g., previous/next buttons respond to Enter and Space, arrow keys for slide navigation).

## ARIA

- `role="region"` -- identifies the carousel as a landmark region so screen readers can navigate to it.
- `aria-roledescription="carousel"` -- overrides the default "region" announcement with "carousel" for clearer context.
- `aria-label` -- provides an accessible name describing the carousel content.

## When to Use

- Use for cycling through a set of related content items, such as testimonials, featured articles, or image galleries
- Use when screen space is limited and content can be browsed sequentially
- Use for showcasing a curated set of promotions, portfolio pieces, or product highlights
- Use when the content items are of equal importance and none is critical on its own

## When Not to Use

- Do not use for critical content that users must not miss -- carousels are often ignored or skipped
- Do not use when all items need to be visible simultaneously -- use a grid of Cards instead
- Do not use for navigation -- use TabBar or ContentsNav for switching between content panels
- Do not use for a single content item -- use Hero or Card instead

## Headless

This headless Carousel component provides the semantic container with `role="region"`, `aria-roledescription="carousel"`, and `aria-label` for screen reader identification. The consumer provides all visual styling, slide navigation controls (previous/next buttons, pagination dots), autoplay logic, transition animations, and slide layout.


## Styles

The consumer provides all CSS styling. The component renders with a `.carousel` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `carousel`
- Verify role="region"` -- identifies the carousel as a landmark region so screen readers can navigate to it.
- Verify aria-label` -- provides an accessible name describing the carousel content.
- Verify pass-through attributes are applied

## Advice

- **Designers**: Provide clear navigation indicators (dots or arrows) so users understand there is more content to view. Avoid autoplay or provide a visible pause control.
- **Developers**: Mark each slide with `role="group"` and `aria-roledescription="slide"` with an `aria-label` indicating position (e.g., "Slide 1 of 5"). Implement keyboard navigation for slide controls.

## References

- WAI-ARIA Carousel Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/carousel/
- WAI-ARIA Authoring Practices Carousel: https://www.w3.org/WAI/tutorials/carousels/
