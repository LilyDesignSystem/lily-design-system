<script setup lang="ts">

    // KanbanTableBody component
    //
    // The body section of a KanbanTable, rendered as a <tbody> element.
    // Contains KanbanTableRow elements with task data cells.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   default slot. KanbanTableRow elements with data cells.
    //   ...restProps — additional HTML attributes spread onto the <tbody>.
    //
    // Syntax:
    //   <KanbanTableBody>
    //     <KanbanTableRow>
    //       <KanbanTableTD>Task A</KanbanTableTD>
    //       <KanbanTableTD>Task B</KanbanTableTD>
    //     </KanbanTableRow>
    //   </KanbanTableBody>
    //
    // Keyboard:
    //   None built-in — keyboard navigation handled at the KanbanTable grid level.
    //
    // Accessibility:
    //   - <tbody> provides structural body semantics for the table
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a KanbanTable
    //   - No internal state — purely a structural wrapper
    //
    // References:
    //   - HTML tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody

</script>

<template>
    <!-- KanbanTableBody.vue -->
    <tbody
        class="kanban-table-body"
    >
        <slot />
    </tbody>
</template>
