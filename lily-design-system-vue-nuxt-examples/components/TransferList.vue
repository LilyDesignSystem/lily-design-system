<script setup lang="ts">

    // TransferList component
    //
    // A dual list box for moving items between two lists. Renders a
    // role="group" container with two <section> sub-regions (source and
    // target) and an optional actions area between them. Consumers supply
    // each region's content through named slots.
    //
    // Props:
    //   label       — string, REQUIRED. aria-label for the group.
    //   sourceLabel — string, REQUIRED. aria-label heading for the source list.
    //   targetLabel — string, REQUIRED. aria-label heading for the target list.
    //   slot source  — REQUIRED. Source list content (typically a Listbox).
    //   slot target  — REQUIRED. Target list content (typically a Listbox).
    //   slot actions — optional. Action buttons between the two lists.
    //
    // Syntax:
    //   <TransferList label="Move items" source-label="Available" target-label="Selected">
    //     <template #source><ul role="listbox">…</ul></template>
    //     <template #actions><button>→</button></template>
    //     <template #target><ul role="listbox">…</ul></template>
    //   </TransferList>
    //
    // Accessibility:
    //   - role="group" on the container with aria-label
    //   - Each list region uses a <section> with its own aria-label
    //
    // Internationalization:
    //   - All text content is consumer-supplied.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - label, sourceLabel, targetLabel are required — non-optional in the interface
    //
    // References:
    //   - WAI-ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/
    //   - Ant Design Transfer: https://ant.design/components/transfer

    import { useSlots } from "vue";

    withDefaults(defineProps<{
        /** Group aria-label (REQUIRED). */
        label: string;
        /** Source section aria-label (REQUIRED). */
        sourceLabel: string;
        /** Target section aria-label (REQUIRED). */
        targetLabel: string;
    }>(), {});

    const slots = useSlots();

</script>

<template>
    <!-- TransferList.vue -->
    <div
        class="transfer-list"
        role="group"
        :aria-label="label"
    >
        <section
            class="transfer-list-source"
            :aria-label="sourceLabel"
        >
            <slot name="source" />
        </section>
        <div
            v-if="slots.actions"
            class="transfer-list-actions"
        >
            <slot name="actions" />
        </div>
        <section
            class="transfer-list-target"
            :aria-label="targetLabel"
        >
            <slot name="target" />
        </section>
    </div>
</template>
