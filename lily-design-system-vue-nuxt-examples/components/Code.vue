<script setup lang="ts">

    // Code component
    //
    // An inline code span for short code snippets within surrounding text.
    //
    // Props:
    //   label — string, optional. Accessible label via aria-label.
    //   default slot — component content.
    //
    // Accessibility:
    //   - native <code> semantics
    //   - aria-label exposes a screen-reader name when label is provided
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //
    // References:
    //   - HTML code element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code

    withDefaults(defineProps<{
        /** Optional accessible label set on aria-label. */
        label?: string;
    }>(), {
        label: undefined,
    });

</script>

<template>
    <!-- Code.vue -->
    <code
        class="code"
        :aria-label="label"
    >
        <slot />
    </code>
</template>
