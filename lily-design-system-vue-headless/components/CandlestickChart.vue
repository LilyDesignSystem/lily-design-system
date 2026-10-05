<script setup lang="ts">

    // CandlestickChart component
    //
    // A headless wrapper for a financial chart showing open, high, low and close values for each period as candles. Renders a <figure> holding a
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
    //   <figure class="candlestick-chart">
    //     <div class="candlestick-chart-graphic" role="img" aria-label>…svg…</div>
    //     <div class="candlestick-chart-data-table">…table…</div>   (only when provided)
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
    <!-- CandlestickChart.vue -->
    <figure class="candlestick-chart">
        <div class="candlestick-chart-graphic" role="img" :aria-label="label">
            <slot />
        </div>
        <div v-if="$slots.dataTable" class="candlestick-chart-data-table">
            <slot name="dataTable" />
        </div>
    </figure>
</template>
