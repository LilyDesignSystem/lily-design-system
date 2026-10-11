<script setup lang="ts">

    // KanbanTableTH component
    //
    // A column header cell within a KanbanTable, rendered as a <th> element.
    // Used inside a <KanbanTableRow> within <KanbanTableHead> to label each
    // workflow stage column.
    //
    // Props:
    //   colspan — number, optional. Number of columns this header cell spans.
    //   rowspan — number, optional. Number of rows this header cell spans.
    //   scope — "col" | "row" | "colgroup" | "rowgroup", default "col". Header scope.
    //   default slot — header cell content.
    //
    // Accessibility:
    //   - <th scope="col"> associates the header with its column for assistive tech
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a <tr> within a KanbanTable
    //
    // References:
    //   - HTML th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th

    withDefaults(defineProps<{
        /** Number of columns this header cell spans. */
        colspan?: number;
        /** Number of rows this header cell spans. */
        rowspan?: number;
        /** Header scope. */
        scope?: "col" | "row" | "colgroup" | "rowgroup";
    }>(), {
        scope: "col",
    });

</script>

<template>
    <!-- KanbanTableTH.vue -->
    <th
        class="kanban-table-th"
        :scope="scope"
        :colspan="colspan || undefined"
        :rowspan="rowspan || undefined"
    >
        <slot />
    </th>
</template>
