<script setup lang="ts">

    // Comment component
    //
    // A comment that displays user discussion or feedback.
    //
    // Props:
    //   label — string, optional. Accessible label via aria-label.
    //   default slot — component content.
    //
    // Accessibility:
    //   - native <article> semantics
    //   - aria-label exposes a screen-reader name when label is provided
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //
    // References:
    //   - HTML article element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article

    withDefaults(defineProps<{
        /** Optional accessible label set on aria-label. */
        label?: string;
    }>(), {
        label: undefined,
    });

</script>

<template>
    <!-- Comment.vue -->
    <article
        class="comment"
        :aria-label="label"
    >
        <slot />
    </article>
</template>
