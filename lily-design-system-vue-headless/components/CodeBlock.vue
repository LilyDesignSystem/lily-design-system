<script setup lang="ts">
// CodeBlock component
//
// A block of formatted code with optional line numbers and line highlighting.
//
// Props:
//   label — string, optional. Names the block, which becomes role="region".
//   default slot — component content.
//
// Accessibility:
//   - native <pre> semantics
//   - role="region" and aria-label come from `label` when given
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML pre element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre

withDefaults(
    defineProps<{
        /** Names the block, which becomes role="region". */
        label?: string;
    }>(),
    {
        label: undefined,
    },
);
</script>

<template>
    <!-- CodeBlock.vue -->
    <pre
        class="code-block"
        :role="label ? 'region' : undefined"
        :aria-label="label"
    >
        <slot />
    </pre>
</template>
