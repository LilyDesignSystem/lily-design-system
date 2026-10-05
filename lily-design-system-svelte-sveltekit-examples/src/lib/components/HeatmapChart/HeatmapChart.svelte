<script lang="ts">
    // HeatmapChart component
    //
    // A headless wrapper for a grid chart where cell colour encodes the value at each row and column. Renders a <figure role="img">
    // around the consumer-supplied inline <svg>. No drawing happens here.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the chart.
    //   children — Snippet, required. The inline <svg> (and any extra markup).
    //   ...restProps — additional HTML attributes spread onto the <figure>
    //     (use aria-describedby to point at a description or a data table).
    //
    // Keyboard:
    //   None — the chart is a single image to assistive technology.
    //
    // Accessibility:
    //   - role="img" exposes the chart as one image; aria-label names it
    //   - aria-describedby (via restProps) should reference a text description
    //     or a real <table> carrying the same data

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Accessible name for the chart. */
        label: string;
        /** The consumer-supplied inline svg. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- HeatmapChart.svelte -->
<figure
    class={`heatmap-chart ${className}`}
    role="img"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</figure>
