<script setup lang="ts">

    // ActionBar component
    //
    // A contextual action bar that appears when items are selected, showing
    // the selection count and bulk action buttons. Renders a toolbar landmark
    // with role="toolbar" and the consumer-supplied accessible label.
    //
    // Props:
    //   label               — string, REQUIRED. aria-label for the toolbar.
    //   selectedCount       — number, REQUIRED. Count of currently selected items.
    //   selectedCountLabel  — string, REQUIRED. Pre-formatted display of the count.
    //   clearSelectionLabel — string, optional. Accessible label for the clear button.
    //   default slot        — typically ActionBarButton children.
    //   emits clearSelection(event) — clear-selection click handler.
    //
    // Syntax:
    //   <ActionBar label="Selection" :selected-count="3"
    //              selected-count-label="3 selected"
    //              clear-selection-label="Clear selection"
    //              @clear-selection="onClear">
    //     <ActionBarButton label="Delete">Delete</ActionBarButton>
    //   </ActionBar>
    //
    // Accessibility:
    //   - role="toolbar" with aria-label
    //   - data-selected-count exposes the count for consumer styling
    //   - clear button has aria-label for assistive tech
    //
    // Internationalization:
    //   - All visible and accessible text comes from props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - label, selectedCount, selectedCountLabel are required
    //   - Clear button renders only when clearSelectionLabel is provided

    withDefaults(defineProps<{
        /** Accessible label for the toolbar (REQUIRED). */
        label: string;
        /** Count of currently selected items (REQUIRED). */
        selectedCount: number;
        /** Pre-formatted display of the count (REQUIRED). */
        selectedCountLabel: string;
        /** Accessible label for the clear-selection button. */
        clearSelectionLabel?: string;
    }>(), {
        clearSelectionLabel: undefined,
    });

    defineEmits<{
        (e: "clearSelection", event: MouseEvent): void;
    }>();

</script>

<template>
    <!-- ActionBar.vue -->
    <div
        class="action-bar"
        role="toolbar"
        :aria-label="label"
        :data-selected-count="selectedCount"
    >
        <span class="action-bar-count">{{ selectedCountLabel }}</span>
        <slot />
        <button
            v-if="clearSelectionLabel"
            class="action-bar-clear"
            type="button"
            :aria-label="clearSelectionLabel"
            @click="$emit('clearSelection', $event)"
        >×</button>
    </div>
</template>
