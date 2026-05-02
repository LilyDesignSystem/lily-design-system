<script setup lang="ts">

    // CodeBlock component
    //
    // A block of formatted code with optional line numbers and line highlighting.
    //
    // Props:
    //   label — string, optional. Accessible label via aria-label.
    //   default slot — component content.
    //
    // Accessibility:
    //   - native <pre> semantics
    //   - aria-label exposes a screen-reader name when label is provided
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //
    // References:
    //   - HTML pre element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre

    withDefaults(defineProps<{
        /** Optional accessible label set on aria-label. */
        label?: string;
    }>(), {
        label: undefined,
    });

</script>

<template>
    <!-- CodeBlock.vue -->
    <pre
        class="code-block"
        :aria-label="label"
    >
        <slot />
    </pre>
</template>
