<script lang="ts">
    // SankeyChart component
    //
    // A headless wrapper for a flow chart where link width encodes the quantity moving between nodes. Renders a <figure role="img">
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

<!-- SankeyChart.svelte -->
<figure
    class={`sankey-chart ${className}`}
    role="img"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</figure>
