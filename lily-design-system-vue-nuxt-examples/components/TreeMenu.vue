<script setup lang="ts">

    // TreeMenu component
    //
    // A hierarchical tree menu with expandable branches.
    //
    // Props:
    //   label — string, required. Accessible label via aria-label.
    //   default slot — component content.
    //
    // Accessibility:
    //   - role='tree' on the wrapper
    //   - aria-label exposes a screen-reader name when label is provided
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //
    // References:
    //   - HTML div element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div

    defineProps<{
        /** Accessible label set on aria-label. */
        label: string;
    }>();

</script>

<template>
    <!-- TreeMenu.vue -->
    <div
        class="tree-menu"
        role="tree"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
