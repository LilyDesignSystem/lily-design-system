<script setup lang="ts">

    // TableFoot component
    //
    // The footer section of a Table, rendered as a <tfoot> element. Contains TableRow elements with summary or footer cells.
    //
    // Keyboard:
    //   None — tables are non-interactive; consumers add interaction at the table level if needed.
    //
    // Accessibility:
    //   - <tfoot> provides native table-section semantics
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a Table
    //   - No internal state — purely a structural wrapper
    //
    // References:
    //   - HTML tfoot element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot

</script>

<template>
    <!-- TableFoot.vue -->
    <tfoot class="table-foot">
        <slot />
    </tfoot>
</template>
