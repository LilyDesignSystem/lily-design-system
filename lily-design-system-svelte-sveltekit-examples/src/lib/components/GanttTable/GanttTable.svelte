<script lang="ts">
    // GanttTable component
    //
    // An interactive Gantt table that displays project tasks and their timelines
    // as a structured grid widget. Renders a <table> element with role="grid" and
    // an accessible label. Supports an optional visible caption. Commonly used in
    // project management tools and resource planning applications.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name describing the Gantt table content.
    //   caption — string, optional. Visible caption text displayed above the table.
    //   children — Snippet, required. GanttTableThead, GanttTableTbody, GanttTableTfoot elements.
    //   ...restProps — additional HTML attributes spread onto the <table>.
    //
    // Syntax:
    //   <GanttTable label="Project timeline">
    //     <GanttTableThead>
    //       <GanttTableTr>
    //         <th>Task</th><th>Week 1</th><th>Week 2</th><th>Week 3</th>
    //       </GanttTableTr>
    //     </GanttTableThead>
    //     <GanttTableTbody>
    //       <GanttTableTr>
    //         <th>Design</th>
    //         <GanttTableTd active>---</GanttTableTd>
    //         <GanttTableTd />
    //         <GanttTableTd />
    //       </GanttTableTr>
    //     </GanttTableTbody>
    //   </GanttTable>
    //
    // Keyboard:
    //   None built-in — consumer should implement grid keyboard navigation
    //   (arrow keys for cell movement, Enter/Space for selection).
    //
    // Accessibility:
    //   - role="grid" identifies the table as an interactive grid widget
    //   - aria-label provides an accessible name describing the Gantt table
    //   - <caption> provides a visible accessible name when the caption prop is set
    //
    // Internationalization:
    //   - The label and caption props provide all text; no hardcoded strings
    //   - All content comes through the children snippet
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Compound component: use with GanttTableThead, GanttTableTbody, GanttTableTfoot,
    //     GanttTableTr, GanttTableTd, and GanttTableTh
    //
    // References:
    //   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        caption = undefined,
        children,
        ...restProps
    }: {
        /** Accessible name describing the Gantt table content. */
        label: string;
        /** Visible caption for the table. */
        caption?: string;
        /** GanttTableThead, GanttTableTbody, GanttTableTfoot elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- GanttTable.svelte -->
<table
    class={`gantt-table ${className}`}
    role="grid"
    aria-label={label}
    {...restProps}
>
    {#if caption}
        <caption>{caption}</caption>
    {/if}
    {@render children()}
</table>
