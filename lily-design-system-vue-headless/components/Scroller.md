# Scroller

A scrollytelling container with a sticky `background` slot that updates as the foreground steps scroll past. Built on top of `ScrollerBase`.

## Props

- `label`: string (optional) — accessible label for the scroller region
- `offset`: number (default `0.5`) — step trigger position in the viewport

## Emits

- `indexChange` — active step index changed
- `progressChange` — overall scroll progress (0..1)

## Slots

- default — foreground step content (each direct child element is one step)
- `background` — sticky background that changes with the active step

## Structure

- `.scroller` — outer wrapper with optional `aria-label`
- `.scroller-background` — sticky region with `aria-live="polite"`; consumer applies `position: sticky` in CSS
- `.scroller-foreground` — column containing scrollable step children (this is the `ScrollerBase`)

## Usage

```vue
<script setup>
import { ref } from "vue";
const step = ref(0);
</script>

<template>
  <Scroller label="A scrolling story" @indexChange="step = $event">
    <template #background>
      <Map :zoom="step + 1" />
    </template>
    <section><h2>Step 1</h2></section>
    <section><h2>Step 2</h2></section>
    <section><h2>Step 3</h2></section>
  </Scroller>
</template>
```

## References

- IntersectionObserver API: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
