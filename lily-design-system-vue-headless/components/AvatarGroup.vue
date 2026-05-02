<script setup lang="ts">

    // AvatarGroup component
    //
    // A group of avatar components.
    //
    // Props:
    //   label — string, optional. Accessible label via aria-label.
    //   default slot — component content.
    //
    // Accessibility:
    //   - native <div> semantics
    //   - aria-label exposes a screen-reader name when label is provided
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //
    // References:
    //   - HTML div element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div

    withDefaults(defineProps<{
        /** Optional accessible label set on aria-label. */
        label?: string;
    }>(), {
        label: undefined,
    });

</script>

<template>
    <!-- AvatarGroup.vue -->
    <div
        class="avatar-group"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
