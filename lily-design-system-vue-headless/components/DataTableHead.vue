<script setup lang="ts">
// DataTableHead component
//
// The header section of a DataTable, rendered as a <thead> element.
// Contains DataTableRow elements with column header cells.
//
// Props:
//   className — string, optional. CSS class name.
//   default slot. DataTableRow elements with header cells.
//   ...restProps — additional HTML attributes spread onto the <thead>.
//
// Syntax:
//   <DataTableHead>
//     <DataTableRow><th scope="col">Name</th><th scope="col">Email</th></DataTableRow>
//   </DataTableHead>
//
// Keyboard:
//   None built-in — keyboard navigation handled at the DataTable grid level.
//
// Accessibility:
//   - <thead> provides structural header semantics for the table
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a DataTable
//   - No internal state — purely a structural wrapper
//
// References:
//   - HTML thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead
</script>

<template>
    <!-- DataTableHead.vue -->
    <thead class="data-table-head">
        <slot />
    </thead>
</template>
