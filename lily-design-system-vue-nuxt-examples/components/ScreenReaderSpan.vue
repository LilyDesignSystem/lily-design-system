<script setup lang="ts">

    // ScreenReaderSpan component
    //
    // A visually hidden span of text intended for screen readers.
    //
    // Props:
    //   label — string, optional. Accessible label via aria-label.
    //   default slot — component content.
    //
    // Accessibility:
    //   - native <span> semantics
    //   - aria-label exposes a screen-reader name when label is provided
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //
    // References:
    //   - HTML span element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span

    withDefaults(defineProps<{
        /** Optional accessible label set on aria-label. */
        label?: string;
    }>(), {
        label: undefined,
    });

</script>

<template>
    <!-- ScreenReaderSpan.vue -->
    <span
        class="screen-reader-span"
        :aria-label="label"
    >
        <slot />
    </span>
</template>
