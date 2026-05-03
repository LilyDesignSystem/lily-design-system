<script setup lang="ts">

    // TableTD component
    //
    // A data cell within a Table, rendered as a <td> element. Used inside a
    // <TableRow> within <TableBody> or <TableFoot> to hold one cell of data.
    //
    // Props:
    //   colspan — number, optional. Number of columns this cell spans.
    //   rowspan — number, optional. Number of rows this cell spans.
    //   default slot — cell content.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a <tr> within a Table
    //
    // References:
    //   - HTML td element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td

    defineProps<{
        /** Number of columns this cell spans. */
        colspan?: number;
        /** Number of rows this cell spans. */
        rowspan?: number;
    }>();

</script>

<template>
    <!-- TableTD.vue -->
    <td
        class="table-td"
        :colspan="colspan || undefined"
        :rowspan="rowspan || undefined"
    >
        <slot />
    </td>
</template>
