<script setup lang="ts">

    // Diff component
    //
    // A side-by-side comparison container for two items, rendered as a
    // <div role="group"> with an accessible label.
    //
    // Props:
    //   label — string, required. Accessible name describing the comparison.
    //   default slot — the two items being compared.
    //
    // Accessibility:
    //   - role="group" + aria-label exposes the wrapper as a labelled group
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //
    // References:
    //   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

    defineProps<{
        /** Accessible name describing the comparison. */
        label: string;
    }>();

</script>

<template>
    <!-- Diff.vue -->
    <div
        class="diff"
        role="group"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
