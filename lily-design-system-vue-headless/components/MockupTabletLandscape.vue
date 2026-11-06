<script setup lang="ts">
// MockupTabletLandscape component
//
// A box area that looks like a tablet computer in landscape mode. Renders a decorative <div> container
// that the consumer styles to look like the named device or surface.
//
// Props:
//   default slot — the content rendered inside the device frame.
//
// Keyboard:
//   None — this is a passive decorative container.
//
// Accessibility:
//   - role="img", named by `label`: the mockup reads as one image.
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML div element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div
defineProps<{ label?: string }>();
</script>

<template>
    <!-- MockupTabletLandscape.vue -->
    <div
        class="mockup-tablet-landscape"
        role="img"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
