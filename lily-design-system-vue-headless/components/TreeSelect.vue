<script setup lang="ts">

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
    //   multiple    — boolean, default false. Sets aria-multiselectable.
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
    //   - aria-multiselectable when multiple=true
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

    const props = withDefaults(defineProps<{
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
    }>(), {
        expanded: false,
        disabled: false,
        multiple: false,
        placeholder: undefined,
        value: undefined,
    });

    defineEmits<{
        (e: "click", event: MouseEvent): void;
    }>();

    const ariaMultiselectable = computed<boolean | undefined>(() => (props.multiple ? true : undefined));

</script>

<template>
    <!-- TreeSelect.vue -->
    <div
        class="tree-select"
        role="combobox"
        aria-haspopup="tree"
        :aria-expanded="expanded"
        :aria-label="label"
        :aria-multiselectable="ariaMultiselectable"
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
            :hidden="!expanded"
        >
            <slot />
        </div>
    </div>
</template>
