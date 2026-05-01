<script setup lang="ts">

    // GanttTableTfoot component
    //
    // The footer section of a GanttTable, rendered as a <tfoot> element.
    // Contains GanttTableTR elements with summary or aggregate data cells.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   default slot. GanttTableTR elements with footer cells.
    //   ...restProps — additional HTML attributes spread onto the <tfoot>.
    //
    // Syntax:
    //   <GanttTableTfoot>
    //     <GanttTableTR>
    //       <GanttTableTD>Total: 12 tasks</GanttTableTD>
    //     </GanttTableTR>
    //   </GanttTableTfoot>
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

</script>

<template>
    <!-- GanttTableTfoot.vue -->
    <tfoot
        class="gantt-table-tfoot"
    >
        <slot />
    </tfoot>
</template>
