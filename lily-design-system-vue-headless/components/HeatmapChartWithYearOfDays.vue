<script setup lang="ts">

    // HeatmapChartWithYearOfDays component
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
    //   year — number, required. The calendar year shown (data-year).
    //   weekStart — number, required. First weekday row, 0 = Sunday … 6 = Saturday (data-week-start); no default, it is locale-dependent.
    //   default slot — the inline <svg> (and any extra markup).
    //   dataTable — named slot, optional. The accessible table alternative.
    //   ...restProps (attrs) — spread onto the <figure>.
    //
    // Markup:
    //   <figure class="heatmap-chart-with-year-of-days" data-year data-week-start>
    //     <div class="heatmap-chart-with-year-of-days-graphic" role="img" aria-label>…svg…</div>
    //     <div class="heatmap-chart-with-year-of-days-data-table">…table…</div>   (only when provided)
    //   </figure>
    //
    // Keyboard:
    //   None on the graphic; the data table follows native table behaviour.

    defineProps<{
        /** Accessible name for the chart. */
        label: string;
        /** The calendar year shown. */
        year: number;
        /** First weekday row: 0 = Sunday … 6 = Saturday. */
        weekStart: number;
    }>();

</script>

<template>
    <!-- HeatmapChartWithYearOfDays.vue -->
    <figure class="heatmap-chart-with-year-of-days" :data-year="year" :data-week-start="weekStart">
        <div class="heatmap-chart-with-year-of-days-graphic" role="img" :aria-label="label">
            <slot />
        </div>
        <div v-if="$slots.dataTable" class="heatmap-chart-with-year-of-days-data-table">
            <slot name="dataTable" />
        </div>
    </figure>
</template>
