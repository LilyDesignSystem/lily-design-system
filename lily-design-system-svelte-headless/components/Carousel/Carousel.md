# Carousel

A carousel is a region component for cycling through a set of slides or content items, such as image galleries, product showcases, or testimonial rotators. It provides the semantic container with appropriate ARIA roledescription so assistive technologies announce it as a carousel.

The consumer is responsible for providing the slide content as children and implementing navigation controls (previous/next buttons, pagination dots, autoplay logic, etc.). This headless approach gives full control over navigation behavior, animation, and layout while ensuring accessibility compliance.

## Implementation Notes

- Renders a `<div>` with `role="region"` and `aria-roledescription="carousel"` to communicate the carousel pattern to screen readers.
- The `aria-label` prop provides an accessible name for the region.
- Slide content is passed via the `children` snippet, allowing any markup structure.
- Spreads `restProps` onto the container for consumer customization.
- No internal state management for active slide; consumers manage slide state externally.

## Props

- `label`: string (required) -- accessible name for the carousel region, applied via `aria-label`.
- `children`: Snippet (required) -- slide content to render inside the carousel container.
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`.

## Usage

```svelte
<Carousel label="Photo gallery">
    <div role="group" aria-label="Slide 1">...</div>
</Carousel>
```

```svelte
<Carousel label="Featured products">
    {#each slides as slide, i}
        <div role="group" aria-roledescription="slide" aria-label="Slide {i + 1} of {slides.length}">
            {slide.content}
        </div>
    {/each}
</Carousel>
```

## Keyboard Interactions

None -- this component is a passive container. The consumer should implement keyboard navigation for slide controls (e.g., previous/next buttons respond to Enter and Space, arrow keys for slide navigation).

## ARIA

- `role="region"` -- identifies the carousel as a landmark region so screen readers can navigate to it.
- `aria-roledescription="carousel"` -- overrides the default "region" announcement with "carousel" for clearer context.
- `aria-label` -- provides an accessible name describing the carousel content.

## References

- WAI-ARIA Carousel Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/carousel/
- WAI-ARIA Authoring Practices Carousel: https://www.w3.org/WAI/tutorials/carousels/
