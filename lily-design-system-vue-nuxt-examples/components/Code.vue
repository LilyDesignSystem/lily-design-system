<script setup lang="ts">
// Code component
//
// An inline code span for short code snippets within surrounding text.
//
// Props:
//   default slot — component content.
//
// Accessibility:
//   - native <code> semantics
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML code element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code

withDefaults(
    defineProps<{
    }>(),
    {
    },
);
</script>

<template>
    <!-- Code.vue -->
    <code
        class="code"
    >
        <slot />
    </code>
</template>
