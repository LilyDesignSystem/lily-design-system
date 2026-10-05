<script setup lang="ts">

    // HeatmapChart component
    //
    // A headless wrapper for a grid chart where cell colour encodes the value at each row and column. Renders a <figure role="img">
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
    <!-- HeatmapChart.vue -->
    <figure
        class="heatmap-chart"
        role="img"
        :aria-label="label"
    >
        <slot />
    </figure>
</template>
