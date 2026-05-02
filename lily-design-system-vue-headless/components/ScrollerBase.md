# ScrollerBase

A low-level scroll-position tracking primitive for scrollytelling. Renders a `<div>` whose direct children are treated as steps; reports the active step index via `IntersectionObserver` and the overall scroll progress via a `scroll` listener.

## Props

- `label`: string (optional) — accessible label for the scroll region
- `offset`: number (default `0.5`) — trigger position within the viewport (0=top, 0.5=center, 1=bottom)

## Emits

- `indexChange` — fired with the active step index when it changes
- `progressChange` — fired with the overall scroll progress (0..1)

## Slots

- default — step elements (each direct child element is one step)

## Usage

```vue
<script setup>
import { ref } from "vue";
const step = ref(0);
</script>

<template>
  <ScrollerBase label="My story" @indexChange="step = $event">
    <section>Step 1</section>
    <section>Step 2</section>
    <section>Step 3</section>
  </ScrollerBase>
</template>
```

## References

- IntersectionObserver API: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
