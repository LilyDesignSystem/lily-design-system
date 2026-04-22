<script lang="ts">
    // GanttTableFoot component
    //
    // The footer section of a GanttTable, rendered as a <tfoot> element.
    // Contains GanttTableRow elements with summary or aggregate data cells.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. GanttTableRow elements with footer cells.
    //   ...restProps — additional HTML attributes spread onto the <tfoot>.
    //
    // Syntax:
    //   <GanttTableFoot>
    //     <GanttTableRow>
    //       <GanttTableData>Total: 12 tasks</GanttTableData>
    //     </GanttTableRow>
    //   </GanttTableFoot>
    //
    // Keyboard:
    //   None built-in — keyboard navigation handled at the GanttTable grid level.
    //
    // Accessibility:
    //   - <tfoot> provides structural footer semantics for the table
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a GanttTable
    //   - No internal state — purely a structural wrapper
    //
    // References:
    //   - HTML tfoot element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        /** GanttTableRow elements with footer cells. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- GanttTableFoot.svelte -->
<tfoot
    class={`gantt-table-foot ${className}`}
    {...restProps}
>
    {@render children()}
</tfoot>
