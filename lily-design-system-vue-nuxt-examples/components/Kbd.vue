<script setup lang="ts">
// Kbd component
//
// An inline element for keyboard shortcuts and key combinations.
//
// Props:
//   label — string, optional. Spoken form, read instead of the visible key.
//   default slot — component content.
//
// Accessibility:
//   - native <kbd> semantics
//   - hidden text comes from `label` when given
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML kbd element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd

withDefaults(
    defineProps<{
        /** Spoken form, read instead of the visible key. */
        label?: string;
    }>(),
    {
        label: undefined,
    },
);
</script>

<template>
    <!-- Kbd.vue -->
    <kbd class="kbd">
        <span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        ><span
            class="kbd-text"
            :aria-hidden="label ? 'true' : undefined"
            ><slot
        /></span>
    </kbd>
</template>
