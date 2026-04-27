<script setup lang="ts">

    // Cascader component
    //
    // A multi-level dropdown for selecting a value from a hierarchy. The
    // component renders a combobox container, a trigger button, and a panel
    // for nested option lists. Consumers supply the hierarchy contents via the
    // default slot.
    //
    // Props:
    //   label       — string, REQUIRED. aria-label for the combobox.
    //   expanded    — boolean, default false. Whether the panel is open.
    //   disabled    — boolean, default false.
    //   placeholder — string, optional. Text shown on the trigger when no value.
    //   value       — string, optional. Display value on the trigger.
    //   default slot — panel content (typically nested option lists).
    //   emits click(event) — fired when the trigger button is clicked.
    //
    // Syntax:
    //   <Cascader label="Region" :expanded="open" placeholder="Select…" @click="toggle">
    //     <ul role="tree">…</ul>
    //   </Cascader>
    //
    // Accessibility:
    //   - role="combobox" on the container with aria-haspopup="tree"
    //   - aria-expanded reflects panel visibility
    //   - aria-label is REQUIRED
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
    //   - Ant Design Cascader: https://ant.design/components/cascader

    withDefaults(defineProps<{
        /** Accessible label (REQUIRED). */
        label: string;
        /** Whether the panel is open. */
        expanded?: boolean;
        /** Whether disabled. */
        disabled?: boolean;
        /** Placeholder text on the trigger. */
        placeholder?: string;
        /** Display value on the trigger. */
        value?: string;
    }>(), {
        expanded: false,
        disabled: false,
        placeholder: undefined,
        value: undefined,
    });

    defineEmits<{
        (e: "click", event: MouseEvent): void;
    }>();

</script>

<template>
    <!-- Cascader.vue -->
    <div
        class="cascader"
        role="combobox"
        aria-haspopup="tree"
        :aria-expanded="expanded"
        :aria-label="label"
    >
        <button
            class="cascader-trigger"
            type="button"
            :disabled="disabled"
            @click="$emit('click', $event)"
        >
            {{ value || placeholder }}
        </button>
        <div
            class="cascader-panel"
            :hidden="!expanded"
        >
            <slot />
        </div>
    </div>
</template>
