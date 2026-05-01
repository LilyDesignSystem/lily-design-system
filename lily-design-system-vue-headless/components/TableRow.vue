<script setup lang="ts">

    // TableRow component
    //
    // A single row in a Table, rendered as a <tr> element. Contains TableTH or TableTD cells.
    //
    // Keyboard:
    //   None — tables are non-interactive; consumers add interaction at the table level if needed.
    //
    // Accessibility:
    //   - <tr> provides native table-section semantics
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a Table
    //   - No internal state — purely a structural wrapper
    //
    // References:
    //   - HTML tr element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr

</script>

<template>
    <!-- TableRow.vue -->
    <tr class="table-row">
        <slot />
    </tr>
</template>
