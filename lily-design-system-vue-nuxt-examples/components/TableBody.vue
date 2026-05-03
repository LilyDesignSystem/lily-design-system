<script setup lang="ts">

    // TableBody component
    //
    // The body section of a Table, rendered as a <tbody> element. Contains TableRow elements with data cells.
    //
    // Keyboard:
    //   None — tables are non-interactive; consumers add interaction at the table level if needed.
    //
    // Accessibility:
    //   - <tbody> provides native table-section semantics
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a Table
    //   - No internal state — purely a structural wrapper
    //
    // References:
    //   - HTML tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody

</script>

<template>
    <!-- TableBody.vue -->
    <tbody class="table-body">
        <slot />
    </tbody>
</template>
