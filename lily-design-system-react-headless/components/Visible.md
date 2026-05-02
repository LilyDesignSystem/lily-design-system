# Visible

An `IntersectionObserver` wrapper that exposes the element's viewport visibility state to the consumer through a render-prop child.

## Props

- `className`: string (optional) — CSS class appended to `visible`
- `once`: boolean (default `false`) — stop observing after the first intersection
- `threshold`: number (default `0`) — IntersectionObserver threshold (0..1)
- `rootMargin`: string (default `"0px"`) — IntersectionObserver rootMargin
- `children`: `(visible: boolean) => ReactNode` (required) — render-prop child receiving the current visibility boolean
- `...restProps`: unknown — additional attributes spread onto the `<div>`

The current visibility is also exposed via `data-visible` on the root `<div>` so consumer CSS can react to it.

## Usage

```tsx
<Visible once>
  {(visible) => visible ? <HeavyChart /> : <Placeholder />}
</Visible>
```

## References

- IntersectionObserver API: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
