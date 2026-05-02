<script setup lang="ts">

    // GanttTableTH component
    //
    // A column header cell within a GanttTable, rendered as a <th> element.
    // Used inside a <GanttTableTR> within <GanttTableHead> to label time
    // period columns of the Gantt grid.
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
    //   - Must be used inside a <tr> within a GanttTable
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
    <!-- GanttTableTH.vue -->
    <th
        class="gantt-table-th"
        :scope="scope"
        :colspan="colspan || undefined"
        :rowspan="rowspan || undefined"
    >
        <slot />
    </th>
</template>
