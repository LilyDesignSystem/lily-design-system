<script setup lang="ts">

    // MockupWatch component
    //
    // A box area that looks like a smart watch. Renders a decorative <div> container
    // that the consumer styles to look like the named device or surface.
    //
    // Props:
    //   default slot — the content rendered inside the device frame.
    //
    // Keyboard:
    //   None — this is a passive decorative container.
    //
    // Accessibility:
    //   - No specific ARIA. If the children are an image of UI, set role="img"
    //     and aria-label on the image element so assistive tech describes it.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //
    // References:
    //   - HTML div element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div

</script>

<template>
    <!-- MockupWatch.vue -->
    <div class="mockup-watch">
        <slot />
    </div>
</template>
