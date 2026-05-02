# Visible

An `IntersectionObserver` wrapper that exposes the element's viewport visibility state through a scoped slot.

## Props

- `once`: boolean (default `false`) — stop observing after the first intersection
- `threshold`: number (default `0`) — IntersectionObserver threshold (0..1)
- `rootMargin`: string (default `"0px"`) — IntersectionObserver rootMargin

## Slots

- default — scoped slot receiving `{ visible }` boolean

The current visibility is also exposed via `data-visible` on the root `<div>`.

## Usage

```vue
<Visible once v-slot="{ visible }">
  <HeavyChart v-if="visible" />
  <Placeholder v-else />
</Visible>
```

## References

- IntersectionObserver API: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
