<script setup lang="ts">

    // RingChart component
    //
    // A headless wrapper for a pie chart with a hollow centre, often used to show progress or a share of a total. Renders a <figure> holding a
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
    //   <figure class="ring-chart">
    //     <div class="ring-chart-graphic" role="img" aria-label>…svg…</div>
    //     <div class="ring-chart-data-table">…table…</div>   (only when provided)
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
    <!-- RingChart.vue -->
    <figure class="ring-chart">
        <div class="ring-chart-graphic" role="img" :aria-label="label">
            <slot />
        </div>
        <div v-if="$slots.dataTable" class="ring-chart-data-table">
            <slot name="dataTable" />
        </div>
    </figure>
</template>
