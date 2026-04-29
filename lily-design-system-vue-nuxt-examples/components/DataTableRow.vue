<script setup lang="ts">

    // DataTableRow component
    //
    // A single row within a DataTable. Renders as a <tr> containing
    // DataTableTD cells or header cells. Used inside DataTableHead,
    // DataTableBody, or DataTableFoot.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   default slot. DataTableTD cells or header cells for this row.
    //   ...restProps — additional HTML attributes spread onto the <tr>.
    //
    // Syntax:
    //   <DataTableRow>
    //     <DataTableTD>Alice</DataTableTD>
    //     <DataTableTD>alice@example.com</DataTableTD>
    //   </DataTableRow>
    //
    // Keyboard:
    //   None built-in — keyboard navigation handled at the DataTable grid level.
    //
    // Accessibility:
    //   - <tr> has implicit role="row" (no explicit role needed)
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside DataTableHead, DataTableBody, or DataTableFoot
    //   - No internal state — purely a structural wrapper
    //
    // References:
    //   - HTML tr element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr

</script>

<template>
    <!-- DataTableRow.vue -->
    <tr
        class="data-table-row"
    >
        <slot />
    </tr>
</template>
