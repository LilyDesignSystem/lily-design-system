<script setup lang="ts">

    // CalendarTableFoot component
    //
    // The footer section of a CalendarTable, rendered as a <tfoot> element.
    // Contains CalendarTableRow elements with summary or aggregate data cells.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   default slot. CalendarTableRow elements with footer cells.
    //   ...restProps — additional HTML attributes spread onto the <tfoot>.
    //
    // Syntax:
    //   <CalendarTableFoot>
    //     <CalendarTableRow>
    //       <CalendarTableTD>Week Total: 5</CalendarTableTD>
    //     </CalendarTableRow>
    //   </CalendarTableFoot>
    //
    // Keyboard:
    //   None built-in — keyboard navigation handled at the CalendarTable grid level.
    //
    // Accessibility:
    //   - <tfoot> provides structural footer semantics for the table
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a CalendarTable
    //   - No internal state — purely a structural wrapper
    //
    // References:
    //   - HTML tfoot element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot

</script>

<template>
    <!-- CalendarTableFoot.vue -->
    <tfoot
        class="calendar-table-foot"
    >
        <slot />
    </tfoot>
</template>
