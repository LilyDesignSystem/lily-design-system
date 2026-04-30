# Visible

An IntersectionObserver wrapper that exposes element visibility state, enabling lazy loading, scroll-triggered animations, and viewport-based analytics.

This headless component uses a `<div>` element that wraps content and passes a visibility boolean to its children via a render prop or slot.

## Implementation Notes

- Uses `<div>` element as an observation target for IntersectionObserver
- Passes a visibility boolean to the children slot/render prop
- `once` mode disconnects the observer after the first intersection
- Supports configurable `threshold` and `rootMargin` for IntersectionObserver
- Consumer uses the visibility state to conditionally render or style content

## Props

- `children`: slot (required) -- receives visibility boolean (e.g., `children(visible)`)
- `once`: boolean (default: false) -- if true, stops observing after first visibility
- `threshold`: number (default: 0) -- IntersectionObserver threshold (0-1)
- `rootMargin`: string (default: "0px") -- IntersectionObserver root margin
- `...restProps`: Any additional HTML attributes

## Usage

```html
<Visible once threshold={0.5}>
  {(isVisible) => isVisible
    ? <img src="photo.jpg" alt="Lazy loaded photo" />
    : <div class="placeholder" />
  }
</Visible>
```

```html
<Visible threshold={0.1}>
  {(isVisible) => (
    <section class={isVisible ? "animate-in" : "hidden"}>
      <h2>Welcome</h2>
      <p>This section animates when scrolled into view.</p>
    </section>
  )}
</Visible>
```

```html
<Visible once>
  {(isVisible) => isVisible
    ? <iframe src="https://example.com/embed" title="Embedded content" />
    : <div class="loading-placeholder">Loading...</div>
  }
</Visible>
```

## Keyboard Interactions

- None -- presentational wrapper; interactive children handle their own keyboard interactions

## ARIA

- None -- presentational wrapper with no semantic role

## When to Use

- Use for lazy loading content such as images, iframes, or heavy components
- Use to trigger animations when content scrolls into the viewport
- Use for viewport-based analytics tracking (e.g., measuring whether content was seen)
- Use with `once` mode when content only needs to load once and stay rendered

## When Not to Use

- Do not use for scrollytelling -- use Scroller
- Do not use when content must always render -- just render it directly
- Do not use for complex scroll-linked animations that need scroll position -- use a scroll event listener

## Headless

This component provides a `<div>` wrapper that uses IntersectionObserver to track visibility, with zero visual styling. The consumer is responsible for all CSS including placeholder styling, transition animations, and layout of conditionally rendered content.

## Styles

The consumer provides all CSS styling. The component renders with a `.visible` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `visible`
- Verify IntersectionObserver is created with correct threshold and rootMargin
- Verify visibility boolean is passed to children slot
- Verify `once` mode disconnects observer after first intersection
- Verify observer is cleaned up on component unmount
- Verify pass-through attributes are applied

## Advice

- **Designers**: Plan placeholder states for content that loads lazily. Ensure loading states communicate to users that content is forthcoming. Consider skeleton placeholders for better perceived performance.
- **Developers**: Always provide meaningful alt text or labels for lazily loaded content. Use `once` mode for content that should stay rendered after first load. Choose appropriate threshold values -- 0 triggers on first pixel visible, 1 requires full visibility.

## Related components

- `scroller-base` — see components.tsv
- `scroller` — see components.tsv
- `video-player` — see components.tsv

## References

- [Reuters Graphics Visible component](https://github.com/reuters-graphics/graphics-components)
- [IntersectionObserver API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
