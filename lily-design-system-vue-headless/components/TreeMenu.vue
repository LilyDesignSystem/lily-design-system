<script setup lang="ts">
import { useAttrs } from "vue";
import { warnMissingName } from "./dev-warning";
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

const props = defineProps<{
    /** Accessible label set on aria-label. */
    label: string;
}>();

warnMissingName("TreeMenu", props.label, useAttrs()["aria-label"], useAttrs()["aria-labelledby"]);

const TREE_KEYS = ["ArrowDown", "ArrowUp", "Home", "End"];

// ArrowDown / ArrowUp move between the consumer's [role="treeitem"] items, wrapping; Home / End jump.
function onKeydown(event: KeyboardEvent) {
    if (!TREE_KEYS.includes(event.key)) return;
    const root = event.currentTarget as HTMLElement;
    const items = Array.from(root.querySelectorAll<HTMLElement>('[role="treeitem"]'));
    if (items.length === 0) return;
    const current = items.indexOf(
        (event.target as Element).closest('[role="treeitem"]') as HTMLElement,
    );
    const last = items.length - 1;
    let next: number;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else if (event.key === "ArrowDown") next = current >= last ? 0 : current + 1;
    else next = current <= 0 ? last : current - 1;
    event.preventDefault();
    items[next].focus();
}
</script>

<template>
    <!-- TreeMenu.vue -->
    <div
        class="tree-menu"
        role="tree"
        :aria-label="label"
        tabindex="-1"
        @keydown="onKeydown"
    >
        <slot />
    </div>
</template>
