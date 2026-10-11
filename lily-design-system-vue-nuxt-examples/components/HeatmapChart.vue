<script setup lang="ts">

    // HeatmapChart component
    //
    // A headless wrapper for a grid chart where cell colour encodes the value at each row and column. Renders a <figure> holding a
    // role="img" graphic wrapper around the consumer-supplied inline <svg>.
    // No drawing happens here. The optional `dataTable` slot renders the
    // accessible table alternative as a SIBLING of the image wrapper, never
    // inside it: role="img" makes descendants presentational, so a table
    // inside would be invisible to assistive technology.
    //
    // Props:
    //   label — string, required. Accessible name for the chart image.
    //   default slot — the inline <svg> (and any extra markup).
    //   dataTable — named slot, optional. The accessible table alternative.
    //   ...restProps (attrs) — spread onto the <figure>.
    //
    // Markup:
    //   <figure class="heatmap-chart">
    //     <div class="heatmap-chart-graphic" role="img" aria-label>…svg…</div>
    //     <div class="heatmap-chart-data-table">…table…</div>   (only when provided)
    //   </figure>
    //
    // Keyboard:
    //   None on the graphic; the data table follows native table behaviour.

    defineProps<{
        /** Accessible name for the chart. */
        label: string;
    }>();

</script>

<template>
    <!-- HeatmapChart.vue -->
    <figure class="heatmap-chart">
        <div class="heatmap-chart-graphic" role="img" :aria-label="label">
            <slot />
        </div>
        <div v-if="$slots.dataTable" class="heatmap-chart-data-table">
            <slot name="dataTable" />
        </div>
    </figure>
</template>
