<script setup lang="ts">

    // Tile component
    //
    // A grouping container that presents related content as a structured area.
    //
    // Props:
    //   label — string, optional. Accessible label via aria-label.
    //   default slot — component content.
    //
    // Accessibility:
    //   - native <div> semantics
    //   - aria-label exposes a screen-reader name when label is provided
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //
    // References:
    //   - HTML div element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div

    withDefaults(defineProps<{
        /** Optional accessible label set on aria-label. */
        label?: string;
    }>(), {
        label: undefined,
    });

</script>

<template>
    <!-- Tile.vue -->
    <div
        class="tile"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
