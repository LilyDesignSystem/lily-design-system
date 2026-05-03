<script setup lang="ts">

    // TreeListItem component
    //
    // One item in a tree navigation list.
    //
    // Props:
    //   label — string, optional. Accessible label via aria-label.
    //   default slot — component content.
    //
    // Accessibility:
    //   - role='treeitem' on the wrapper
    //   - aria-label exposes a screen-reader name when label is provided
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //
    // References:
    //   - HTML li element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li

    withDefaults(defineProps<{
        /** Optional accessible label set on aria-label. */
        label?: string;
    }>(), {
        label: undefined,
    });

</script>

<template>
    <!-- TreeListItem.vue -->
    <li
        class="tree-list-item"
        role="treeitem"
        :aria-label="label"
    >
        <slot />
    </li>
</template>
