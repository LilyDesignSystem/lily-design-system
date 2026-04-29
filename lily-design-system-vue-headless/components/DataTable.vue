<script setup lang="ts">

    // DataTable component
    //
    // An interactive data table that displays structured information in rows and
    // columns as a grid widget. Renders a <table> element with role="grid" and an
    // accessible label. Supports an optional visible caption. Commonly used for
    // sortable tables, editable spreadsheets, and interactive data grids.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name describing the table content.
    //   caption — string, optional. Visible caption text displayed above the table.
    //   default slot. DataTableHead, DataTableBody, DataTableFoot elements.
    //   ...restProps — additional HTML attributes spread onto the <table>.
    //
    // Syntax:
    //   <DataTable label="User accounts">
    //     <DataTableHead><DataTableRow><th scope="col">Name</th></DataTableRow></DataTableHead>
    //     <DataTableBody><DataTableRow><DataTableTD>Alice</DataTableTD></DataTableRow></DataTableBody>
    //   </DataTable>
    //
    // Examples:
    //   <!-- Table with visible caption -->
    //   <DataTable label="Sales data" caption="Quarterly sales">
    //     <DataTableHead>
    //       <DataTableRow><th scope="col">Month</th><th scope="col">Revenue</th></DataTableRow>
    //     </DataTableHead>
    //     <DataTableBody>
    //       <DataTableRow><DataTableTD>January</DataTableTD><DataTableTD>$10,000</DataTableTD></DataTableRow>
    //     </DataTableBody>
    //   </DataTable>
    //
    // Keyboard:
    //   None built-in — consumer should implement grid keyboard navigation
    //   (arrow keys for cell movement, Enter/Space for selection).
    //
    // Accessibility:
    //   - role="grid" identifies the table as an interactive grid widget
    //   - aria-label provides an accessible name describing the table content
    //   - <caption> provides a visible accessible name when the caption prop is set
    //
    // Internationalization:
    //   - The label and caption props provide all text; no hardcoded strings
    //   - All cell content is provided by consumers through children
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Compound component: use with DataTableHead, DataTableBody, DataTableFoot,
    //     DataTableRow, DataTableTD, and DataTableTD
    //
    // References:
    //   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

    withDefaults(defineProps<{
        /** Accessible name describing the table content. */
        label: string;
        /** Visible caption for the table. */
        caption?: string;
    }>(), {
        caption: undefined,
    });

</script>

<template>
    <!-- DataTable.vue -->
    <table
        class="data-table"
        role="grid"
        :aria-label="label"
    >
                <caption v-if="caption">{{ caption }}</caption>
        <slot />
    </table>
</template>
