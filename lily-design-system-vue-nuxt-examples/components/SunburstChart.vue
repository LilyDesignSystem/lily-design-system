<script setup lang="ts">

    // SunburstChart component
    //
    // A headless wrapper for a radial chart showing a hierarchy as concentric rings of arcs. Renders a <figure> holding a
    // role="img" graphic wrapper around the consumer-supplied inline <svg>.
    // No drawing happens here. The optional `dataTable` slot renders the
    // accessible table alternative as a SIBLING of the image wrapper, never
    // inside it: role="img" makes descendants presentational, so a table
    // inside would be invisible to assistive technology.
    //
    // Props:
    //   label — string, optional. Accessible name of the chart image.
    //   default slot — the inline <svg> (and any extra markup).
    //   dataTable — named slot, optional. The accessible table alternative.
    //   ...restProps (attrs) — spread onto the <figure>.
    //
    // Markup:
    //   <figure class="sunburst-chart">
    //     <div class="sunburst-chart-graphic" role="img" aria-label>…svg…</div>
    //     <div class="sunburst-chart-data-table">…table…</div>   (only when provided)
    //   </figure>
    //
    // Keyboard:
    //   None on the graphic; the data table follows native table behaviour.

    defineProps<{
        /** Accessible name for the chart. */
        label?: string;
    }>();

</script>

<template>
    <!-- SunburstChart.vue -->
    <figure class="sunburst-chart">
        <div class="sunburst-chart-graphic" role="img" :aria-label="label">
            <slot />
        </div>
        <div v-if="$slots.dataTable" class="sunburst-chart-data-table">
            <slot name="dataTable" />
        </div>
    </figure>
</template>
