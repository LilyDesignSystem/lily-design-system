<script setup lang="ts">

    // SplitView component
    //
    // A two-panel resizable layout container with a draggable divider between
    // them. Renders <div> wrapper with primary <section>, divider (custom slot
    // or default <div role="separator">), and secondary <section>.
    //
    // Props:
    //   label        — string, REQUIRED. aria-label for the container.
    //   orientation  — "horizontal" | "vertical", default "horizontal".
    //   splitPercent — number (0-100), default 50.
    //   primary slot   — REQUIRED. First panel content.
    //   secondary slot — REQUIRED. Second panel content.
    //   divider slot   — optional. Custom divider; defaults to a separator div.
    //
    // Syntax:
    //   <SplitView label="Editor" orientation="horizontal" :split-percent="60">
    //     <template #primary>…</template>
    //     <template #secondary>…</template>
    //   </SplitView>
    //
    // Accessibility:
    //   - Default divider has role="separator", aria-orientation,
    //     aria-valuenow / aria-valuemin / aria-valuemax, and tabindex="0"
    //   - data-orientation and data-split-percent expose state for CSS
    //
    // Internationalization:
    //   - Label prop is consumer-supplied
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - label, primary, secondary are required

    import { useSlots } from "vue";

    withDefaults(defineProps<{
        /** Accessible label for the container (REQUIRED). */
        label: string;
        /** Divider orientation. */
        orientation?: "horizontal" | "vertical";
        /** Initial split position (0-100). */
        splitPercent?: number;
    }>(), {
        orientation: "horizontal",
        splitPercent: 50,
    });

    const slots = useSlots();
    const hasDivider = (): boolean => Boolean(slots.divider);

</script>

<template>
    <!-- SplitView.vue -->
    <div
        class="split-view"
        :aria-label="label"
        :data-orientation="orientation"
        :data-split-percent="splitPercent"
    >
        <section class="split-view-primary">
            <slot name="primary" />
        </section>
        <slot v-if="hasDivider()" name="divider" />
        <div
            v-else
            class="split-view-divider"
            role="separator"
            :aria-orientation="orientation"
            :aria-valuenow="splitPercent"
            :aria-valuemin="0"
            :aria-valuemax="100"
            tabindex="0"
        ></div>
        <section class="split-view-secondary">
            <slot name="secondary" />
        </section>
    </div>
</template>
