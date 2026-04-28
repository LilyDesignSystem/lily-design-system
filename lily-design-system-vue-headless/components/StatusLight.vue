<script setup lang="ts">

    // StatusLight component
    //
    // A small colored dot status indicator paired with a status label. Renders
    // a <span class="status-light" role="status"> with a decorative dot and a
    // text label. Variant is exposed via data-variant for consumer styling.
    //
    // Props:
    //   variant — "neutral" | "informative" | "positive" | "notice" |
    //             "negative" | "active" | "inactive", default "neutral".
    //   label   — string, REQUIRED. The status text.
    //
    // Syntax:
    //   <StatusLight variant="positive" label="Active" />
    //
    // Accessibility:
    //   - role="status" on container so changes can be announced
    //   - dot is aria-hidden; the text label is the accessible content
    //
    // Internationalization:
    //   - The label prop accepts any string
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - label is required
    //   - variant defaults to "neutral"

    type StatusLightVariant =
        | "neutral"
        | "informative"
        | "positive"
        | "notice"
        | "negative"
        | "active"
        | "inactive";

    withDefaults(defineProps<{
        /** Status variant; rendered as data-variant. */
        variant?: StatusLightVariant;
        /** Status text (REQUIRED). */
        label: string;
    }>(), {
        variant: "neutral",
    });

</script>

<template>
    <!-- StatusLight.vue -->
    <span
        class="status-light"
        :data-variant="variant"
        role="status"
    >
        <span class="status-light-dot" aria-hidden="true"></span>
        <span class="status-light-label">{{ label }}</span>
    </span>
</template>
