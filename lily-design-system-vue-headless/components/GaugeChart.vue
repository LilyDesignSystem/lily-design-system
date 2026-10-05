<script setup lang="ts">

    // GaugeChart component
    //
    // A headless wrapper for a dial chart showing one value within a range, with optional thresholds. Renders a <figure role="img">
    // around the consumer-supplied inline <svg>. No drawing happens here.
    //
    // Props:
    //   label — string, required. Accessible name for the chart.
    //   default slot — the inline <svg> (and any extra markup).
    //   ...restProps — additional HTML attributes spread onto the <figure>
    //     (use aria-describedby to point at a description or a data table).
    //
    // Keyboard:
    //   None — the chart is a single image to assistive technology.
    //
    // Accessibility:
    //   - role="img" exposes the chart as one image; aria-label names it
    //   - aria-describedby (via attrs) should reference a text description
    //     or a real <table> carrying the same data

    defineProps<{
        /** Accessible name for the chart. */
        label: string;
    }>();

</script>

<template>
    <!-- GaugeChart.vue -->
    <figure
        class="gauge-chart"
        role="img"
        :aria-label="label"
    >
        <slot />
    </figure>
</template>
