# Carousel

## Metadata

- Component: carousel
- PascalCase: Carousel
- Description: a slideshow for cycling through content items
- HTML tag: <div>
- CSS class: .carousel
- Interactive: no

## Key Behaviors

- Renders a `<div>` with `role="region"` and `aria-roledescription="carousel"` to communicate the carousel pattern to screen readers.
- The `aria-label` prop provides an accessible name for the region.
- Slide content is passed via the `children` slot, allowing any markup structure.
- Spreads `restProps` onto the container for consumer customization.
- No internal state management for active slide; consumers manage slide state externally.

## ARIA

- `role="region"` -- identifies the carousel as a landmark region so screen readers can navigate to it.
- `aria-roledescription="carousel"` -- overrides the default "region" announcement with "carousel" for clearer context.
- `aria-label` -- provides an accessible name describing the carousel content.

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name for the carousel region, applied via `aria-label`.
- `children`: slot (required) -- slide content to render inside the carousel container.
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`.

## Acceptance Criteria

- [ ] Renders <div> element with class="carousel"
- [ ] Has aria-label attribute
- [ ] Has role="region"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .carousel in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/carousel.html
- WAI-ARIA Carousel Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
- WAI-ARIA Authoring Practices Carousel: https://www.w3.org/WAI/tutorials/carousels/
