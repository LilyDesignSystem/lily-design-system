<script setup lang="ts">

    // Citation component
    //
    // A citation that acknowledges the relevance of another work.
    //
    // Props:
    //   label — string, optional. Accessible label via aria-label.
    //   default slot — component content.
    //
    // Accessibility:
    //   - native <cite> semantics
    //   - aria-label exposes a screen-reader name when label is provided
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //
    // References:
    //   - HTML cite element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite

    withDefaults(defineProps<{
        /** Optional accessible label set on aria-label. */
        label?: string;
    }>(), {
        label: undefined,
    });

</script>

<template>
    <!-- Citation.vue -->
    <cite
        class="citation"
        :aria-label="label"
    >
        <slot />
    </cite>
</template>
