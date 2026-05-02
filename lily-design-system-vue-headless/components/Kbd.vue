<script setup lang="ts">

    // Kbd component
    //
    // An inline element for keyboard shortcuts and key combinations.
    //
    // Props:
    //   label — string, optional. Accessible label via aria-label.
    //   default slot — component content.
    //
    // Accessibility:
    //   - native <kbd> semantics
    //   - aria-label exposes a screen-reader name when label is provided
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //
    // References:
    //   - HTML kbd element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd

    withDefaults(defineProps<{
        /** Optional accessible label set on aria-label. */
        label?: string;
    }>(), {
        label: undefined,
    });

</script>

<template>
    <!-- Kbd.vue -->
    <kbd
        class="kbd"
        :aria-label="label"
    >
        <slot />
    </kbd>
</template>
