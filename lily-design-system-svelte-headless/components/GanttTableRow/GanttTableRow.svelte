<script lang="ts">
    // GanttTableRow component
    //
    // A single row within a GanttTable grid. Renders as a <tr> containing
    // GanttTableData cells for each time period and task header cells.
    // Used inside GanttTableHead, GanttTableBody, or GanttTableFoot.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. GanttTableData cells and header cells for this row.
    //   ...restProps — additional HTML attributes spread onto the <tr>.
    //
    // Syntax:
    //   <GanttTableRow>
    //     <th>Design</th>
    //     <GanttTableData active>---</GanttTableData>
    //     <GanttTableData />
    //   </GanttTableRow>
    //
    // Examples:
    //   <!-- Task row with active time periods -->
    //   <GanttTableRow>
    //     <th>Development</th>
    //     <GanttTableData />
    //     <GanttTableData active>---</GanttTableData>
    //     <GanttTableData active>---</GanttTableData>
    //   </GanttTableRow>
    //
    //   <!-- Header row with time period labels -->
    //   <GanttTableRow>
    //     <th>Task</th><th>Week 1</th><th>Week 2</th><th>Week 3</th>
    //   </GanttTableRow>
    //
    // Keyboard:
    //   None built-in — keyboard navigation is handled at the GanttTable grid level.
    //
    // Accessibility:
    //   - <tr> has implicit role="row" within the grid (no explicit role needed)
    //
    // Internationalization:
    //   - All cell content comes through children snippet; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a GanttTable component (which provides the <table>)
    //   - No internal state — purely a structural wrapper
    //
    // References:
    //   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        /** GanttTableData cells and header cells for this row. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- GanttTableRow.svelte -->
<tr
    class={`gantt-table-row ${className}`}
    {...restProps}
>
    {@render children()}
</tr>
