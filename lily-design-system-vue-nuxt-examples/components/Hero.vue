<script setup lang="ts">

    // Hero component
    //
    // A large box or image section with a title and description.
    //
    // Props:
    //   label — string, required. Accessible label via aria-label.
    //   default slot — component content.
    //
    // Accessibility:
    //   - native <section> semantics
    //   - aria-label exposes a screen-reader name when label is provided
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //
    // References:
    //   - HTML section element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section

    defineProps<{
        /** Accessible label set on aria-label. */
        label: string;
    }>();

</script>

<template>
    <!-- Hero.vue -->
    <section
        class="hero"
        :aria-label="label"
    >
        <slot />
    </section>
</template>
