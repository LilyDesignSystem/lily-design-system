# Carousel

A carousel is a region component for cycling through a set of slides or content items, such as image galleries, product showcases, or testimonial rotators. It provides the semantic container with appropriate ARIA roledescription so assistive technologies announce it as a carousel.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

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

## Controls the consumer builds (the APG carousel pattern)

The component supplies only the labelled region. Everything that makes a carousel operable is the consumer's, and the
[WAI-ARIA APG carousel pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) sets what it must be. (The
`apple-carousel` in the sv-chanhdai review, [chanhdai-lessons](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/chanhdai-lessons/index.md) item 12, is a working
example of the tabbed variant.)

**Rotation control (WCAG 2.2.2).** Anything that moves on its own for more than five seconds needs a way to pause it.
- Start paused. Do not auto-rotate until the reader presses Play, or when `prefers-reduced-motion` is set.
- Put a real `<button>` Pause / Play first in the carousel. Its accessible name changes with the state ("Pause gallery",
  "Play gallery", supplied by the consumer), and focus stays on it when pressed.
- Stop rotating while any control inside has keyboard focus or the pointer is over the carousel.

**Slides.** Each slide is `<div role="group" aria-roledescription="slide" aria-label="3 of 8">` (the label text is the
consumer's, by locale). In the tabbed variant each slide is `role="tabpanel"` and is labelled by its tab instead.

**Slide controls.** Either Previous / Next `<button>`s, or a tablist:
- `role="tablist"` with a `role="tab"` per slide, `aria-selected` on the current one and `aria-controls` naming its slide.
- Roving tabindex: only the selected tab is tabbable. ArrowLeft / ArrowRight move between tabs and select them, Home / End
  jump to the first and last (reverse the arrows under `dir="rtl"`).

**Live region.** `aria-live="off"` while the carousel rotates (a constantly changing live region is unusable); `"polite"`
when it does not, so a slide change the reader asked for is announced.

**Hidden slides.** Slides not shown are `hidden` or `inert`, not just moved off-screen: off-screen links and buttons
stay focusable and read aloud. For an infinite loop, cloned slides are `aria-hidden="true"` and `inert`, so a screen reader
does not read each slide twice and Tab does not enter the copy.

**Reduced motion.** Under `prefers-reduced-motion`, replace the slide transition with an instant change or a cross-fade.
The slides still change, so no content is dropped (reduced motion changes how content appears, never whether).

## Keyboard Interactions

None -- this component is a passive container. The consumer builds the controls and their keys: see "Controls the consumer builds" above (buttons respond to Enter and Space; a tablist uses ArrowLeft / ArrowRight / Home / End).

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


## Reduced motion

Reduced motion changes how content appears, never whether it does. Apply it in consumer CSS under `@media (prefers-reduced-motion: reduce)` and under the `motion-picker`'s `[data-motion="reduce"]` on the document root (the 57 reference themes already honour both for the preference hooks they style). For a carousel, the rules are in "Controls the consumer builds" above: no auto-rotation under the preference, and an instant change or a cross-fade in place of the slide transition. The slides still change, so no content is dropped.

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

## Related components

- `photo-pack` — see components.tsv
- `scroller` — see components.tsv
- `horizontal-scroller` — see components.tsv
- `image` — an image element with alt text

## References

- WAI-ARIA Carousel Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
- WAI-ARIA Authoring Practices Carousel: https://www.w3.org/WAI/tutorials/carousels/

---

Lily™ and Lily Design System™ are trademarks.
