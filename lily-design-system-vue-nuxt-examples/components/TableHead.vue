<script setup lang="ts">

    // TableHead component
    //
    // The header section of a Table, rendered as a <thead> element. Contains
    // TableRow elements with column header cells.
    //
    // Props:
    //   default slot. TableRow elements with header cells.
    //
    // Keyboard:
    //   None — tables are non-interactive; consumers add interaction at the table level if needed.
    //
    // Accessibility:
    //   - <thead> provides structural header semantics for the table
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a Table
    //   - No internal state — purely a structural wrapper
    //
    // References:
    //   - HTML thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead

</script>

<template>
    <!-- TableHead.vue -->
    <thead class="table-head">
        <slot />
    </thead>
</template>
