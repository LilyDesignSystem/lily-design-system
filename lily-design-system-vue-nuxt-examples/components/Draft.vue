<script setup lang="ts">

    // Draft component
    //
    // A wrapper marking content as a work-in-progress draft. The optional status prop is
    // exposed as a data-status attribute consumers can hook CSS / JS off of
    // (e.g. "in-progress", "needs-review", "blocked").
    //
    // Props:
    //   label — string, optional. Accessible label via aria-label.
    //   status — string, optional. Reflected as data-status on the root for consumer styling.
    //   default slot — component content.
    //
    // Accessibility:
    //   - native <div> semantics
    //   - aria-label exposes a screen-reader name when label is provided
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling

    withDefaults(defineProps<{
        /** Optional accessible label set on aria-label. */
        label?: string;
        /** Optional draft status reflected as data-status. */
        status?: string;
    }>(), {
        label: undefined,
        status: undefined,
    });

</script>

<template>
    <!-- Draft.vue -->
    <div
        class="draft"
        :aria-label="label"
        :data-status="status"
        v-bind="$attrs"
    >
        <slot />
    </div>
</template>
