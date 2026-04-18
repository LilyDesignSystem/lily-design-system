<script lang="ts">
    // KanbanTableCol component
    //
    // A column definition within a KanbanTable, rendered as a <col> element.
    // Used inside a <colgroup> to define column properties such as width or
    // span for each workflow stage column. Does not render visible content.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   span — number, optional. Number of columns this col element spans.
    //   ...restProps — additional HTML attributes spread onto the <col>.
    //
    // Syntax:
    //   <colgroup><KanbanTableCol /><KanbanTableCol /><KanbanTableCol /></colgroup>
    //
    // Examples:
    //   <KanbanTable label="Board">
    //     <colgroup>
    //       <KanbanTableCol span={1} />
    //       <KanbanTableCol span={1} />
    //       <KanbanTableCol span={1} />
    //     </colgroup>
    //     ...
    //   </KanbanTable>
    //
    // Keyboard:
    //   None — <col> is not interactive.
    //
    // Accessibility:
    //   - <col> provides structural column information for the table
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a <colgroup> within a KanbanTable
    //   - No internal state — purely a structural element
    //
    // References:
    //   - HTML col element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col

    let {
        class: className = "",
        span,
        ...restProps
    }: {
        /** Number of columns this col element spans. */
        span?: number;
        [key: string]: unknown;
    } = $props();
</script>

<!-- KanbanTableCol.svelte -->
<col
    class={`kanban-table-col ${className}`}
    span={span || undefined}
    {...restProps}
/>
