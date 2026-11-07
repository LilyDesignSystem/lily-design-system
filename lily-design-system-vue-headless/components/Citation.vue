<script setup lang="ts">
// Citation component
//
// A citation that acknowledges the relevance of another work.
//
// Props:
//   label — string, optional. Hidden text read before the citation.
//   default slot — component content.
//
// Accessibility:
//   - native <cite> semantics
//   - hidden text comes from `label` when given
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - HTML cite element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite

withDefaults(
    defineProps<{
        /** Hidden text read before the citation. */
        label?: string;
    }>(),
    {
        label: undefined,
    },
);
</script>

<template>
    <!-- Citation.vue -->
    <cite class="citation">
        <span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        ><slot />
    </cite>
</template>
