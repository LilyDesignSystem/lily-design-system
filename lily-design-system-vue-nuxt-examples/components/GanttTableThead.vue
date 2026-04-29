<script setup lang="ts">

    // GanttTableThead component
    //
    // The header section of a GanttTable, rendered as a <thead> element.
    // Contains GanttTableTr elements with column headers for task names,
    // dates, durations, or other Gantt chart metadata.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   default slot. GanttTableTr elements with header cells.
    //   ...restProps — additional HTML attributes spread onto the <thead>.
    //
    // Syntax:
    //   <GanttTableThead>
    //     <GanttTableTr><th>Task</th><th>Start</th><th>End</th></GanttTableTr>
    //   </GanttTableThead>
    //
    // Keyboard:
    //   None built-in — keyboard navigation handled at the GanttTable grid level.
    //
    // Accessibility:
    //   - <thead> provides structural header semantics for the table
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a GanttTable
    //   - No internal state — purely a structural wrapper
    //
    // References:
    //   - HTML thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead

</script>

<template>
    <!-- GanttTableThead.vue -->
    <thead
        class="gantt-table-thead"
    >
        <slot />
    </thead>
</template>
