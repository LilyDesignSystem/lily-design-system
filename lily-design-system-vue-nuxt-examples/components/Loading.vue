<script setup lang="ts">

    // Loading component
    //
    // A loading indicator with status role.
    //
    // Props:
    //   label — string, optional. Accessible label via aria-label.
    //   default slot — component content.
    //
    // Accessibility:
    //   - role='status' on the wrapper
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
    <!-- Loading.vue -->
    <div
        class="loading"
        role="status"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
