<script setup lang="ts">

    // CalendarTableRow component
    //
    // A single row within a CalendarTable grid. Renders as a <tr>,
    // containing CalendarTableData cells for each day in the week.
    // Used inside CalendarTableHead, CalendarTableBody, or CalendarTableFoot.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   default slot. CalendarTableData cells for each day in the row.
    //   ...restProps — additional HTML attributes spread onto the <tr>.
    //
    // Syntax:
    //   <CalendarTableRow>
    //     <CalendarTableData>1</CalendarTableData>
    //     <CalendarTableData>2</CalendarTableData>
    //   </CalendarTableRow>
    //
    // Keyboard:
    //   None built-in — keyboard navigation is handled at the CalendarTable grid level.
    //
    // Accessibility:
    //   - <tr> has implicit role="row" within the grid (no explicit role needed)
    //
    // Internationalization:
    //   - All cell content comes through default slot; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a CalendarTable component (which provides the <table>)
    //   - No internal state — purely a structural wrapper
    //
    // References:
    //   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

</script>

<template>
    <!-- CalendarTableRow.vue -->
    <tr
        class="calendar-table-row"
    >
        <slot />
    </tr>
</template>
