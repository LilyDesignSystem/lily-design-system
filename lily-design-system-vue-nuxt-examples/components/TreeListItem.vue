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

    const props = withDefaults(defineProps<{
        /** Optional accessible label set on aria-label. */
        label?: string;
        /** Expanded state (v-model:expanded). Leave undefined for a leaf (no aria-expanded). */
        expanded?: boolean;
    }>(), {
        label: undefined,
        expanded: undefined,
    });

    const emit = defineEmits<{ "update:expanded": [expanded: boolean] }>();

    // ArrowRight/ArrowLeft (WAI-ARIA tree pattern). Only for the focused item itself, not a
    // nested one the event bubbled up from. Swapped in right-to-left layouts.
    function onKeydown(event: KeyboardEvent) {
        const item = event.currentTarget as HTMLElement;
        if (event.target !== item) return;
        const rtl = getComputedStyle(item).direction === "rtl";
        const open = rtl ? "ArrowLeft" : "ArrowRight";
        const close = rtl ? "ArrowRight" : "ArrowLeft";
        if (event.key === open) {
            if (props.expanded === false) {
                event.preventDefault();
                emit("update:expanded", true);
            } else if (props.expanded === true) {
                const child = item.querySelector<HTMLElement>("[role='treeitem']");
                if (child) {
                    event.preventDefault();
                    child.focus();
                }
            }
        } else if (event.key === close) {
            if (props.expanded === true) {
                event.preventDefault();
                emit("update:expanded", false);
            } else {
                const parent = item.parentElement?.closest<HTMLElement>("[role='treeitem']");
                if (parent) {
                    event.preventDefault();
                    parent.focus();
                }
            }
        }
    }

</script>

<template>
    <!-- TreeListItem.vue -->
    <li
        class="tree-list-item"
        role="treeitem"
        tabindex="-1"
        :aria-label="label"
        :aria-expanded="expanded"
        @keydown="onKeydown"
    >
        <slot />
    </li>
</template>
