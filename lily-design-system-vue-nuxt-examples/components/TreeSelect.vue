<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef, toRef } from "vue";
import { attachTreePopup, type TreeSelection } from "./widget-keys";
import { usePopoverState } from "./popover";
// TreeSelect component
//
// A select dropdown showing a tree of hierarchical options. Renders a
// role="combobox" container, a trigger button, and a tree panel populated
// by the consumer through the default slot.
//
// Props:
//   label       — string, REQUIRED. aria-label.
//   expanded    — boolean, default false. Whether the tree panel is open.
//   disabled    — boolean, default false.
//   multiple    — boolean, default false. Sets data-multiple.
//   placeholder — string, optional.
//   value       — string, optional. Display value.
//   default slot — tree content (typically TreeNav/TreeList).
//   emits click(event) — fired when the trigger is clicked.
//
// Syntax:
//   <TreeSelect label="Department" :expanded="open" placeholder="Select…" @click="toggle">
//     <ul role="tree">…</ul>
//   </TreeSelect>
//
// Accessibility:
//   - role="combobox" with aria-haspopup="tree"
//   - aria-expanded reflects panel visibility
//   - data-multiple when multiple=true (aria-multiselectable is invalid on a combobox)
//
// Internationalization:
//   - All text content (label, value, placeholder) is consumer-supplied.
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - label is required — non-optional in the interface
//
// References:
//   - WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
//   - Ant Design TreeSelect: https://ant.design/components/tree-select

import { computed } from "vue";

const props = withDefaults(
    defineProps<{
        /** Accessible label (REQUIRED). */
        label: string;
        /** Whether the panel is open. */
        expanded?: boolean;
        /** Whether disabled. */
        disabled?: boolean;
        /** Whether multiple selection is allowed. */
        multiple?: boolean;
        /** Placeholder text on the trigger. */
        placeholder?: string;
        /** Display value on the trigger. */
        value?: string;
    }>(),
    {
        expanded: false,
        disabled: false,
        multiple: false,
        placeholder: undefined,
        value: undefined,
    },
);

const emit = defineEmits<{
    (e: "click", event: MouseEvent): void;
    (e: "update:expanded", open: boolean): void;
    (e: "select", selection: TreeSelection): void;
}>();

const dataMultiple = computed<boolean | undefined>(() => (props.multiple ? true : undefined));
const panelEl = shallowRef<HTMLElement | null>(null);
usePopoverState(panelEl, toRef(props, "expanded"));
const rootEl = shallowRef<HTMLElement | null>(null);
let detach: (() => void) | undefined;
onMounted(() => {
    detach = attachTreePopup(rootEl.value!, {
        onOpen: (open) => emit("update:expanded", open),
        onSelect: (selection) => emit("select", selection),
    });
});
onBeforeUnmount(() => detach?.());
</script>

<template>
    <!-- TreeSelect.vue -->
    <div
        ref="rootEl"
        class="tree-select"
        role="combobox"
        aria-haspopup="tree"
        :aria-expanded="expanded"
        :aria-label="label"
        :data-multiple="dataMultiple"
    >
        <button
            class="tree-select-trigger"
            type="button"
            :disabled="disabled"
            @click="$emit('click', $event)"
        >
            {{ value || placeholder }}
        </button>
        <div
            class="tree-select-panel"
            ref="panelEl"
            popover="manual"
        >
            <slot />
        </div>
    </div>
</template>
