<script setup lang="ts">

    // CalendarWeekTable component
    //
    // A calendar grid for a grid of the seven days of one week: seven day columns. A structural wrapper like CalendarTable:
    // a <table> with role="grid" and data-view="week"; the consumer supplies the
    // head, body and rows by reusing the CalendarTable* sub-elements.
    //
    // Props:
    //   label — string, required. Accessible name describing the period shown (e.g. "Week of 6 January 2025").
    //   caption — string, optional. Visible caption text displayed above the table.
    //   default slot. CalendarTableHead, CalendarTableBody, CalendarTableFoot elements.
    //   ...restProps — additional HTML attributes spread onto the <table>
    //     (the consumer class is merged after the base class by Vue).
    //
    // Keyboard:
    //   None built-in — consumer implements grid keyboard navigation.
    //
    // Accessibility:
    //   - role="grid" identifies the table as an interactive grid widget
    //   - aria-label names the period; <caption> gives a visible name
    //   - data-view="week" lets consumer CSS and JS key on the view
    //
    // Internationalization:
    //   - Consumer owns locale formatting (Intl) and all cell content
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - Reuse the CalendarTable* sub-elements; there are no CalendarWeekTable* sub-elements

    withDefaults(defineProps<{
        /** Accessible name describing the period shown. */
        label: string;
        /** Visible caption for the table. */
        caption?: string;
    }>(), {
        caption: undefined,
    });

</script>

<template>
    <!-- CalendarWeekTable.vue -->
    <table
        class="calendar-week-table"
        role="grid"
        :aria-label="label"
        data-view="week"
    >
        <caption v-if="caption">{{ caption }}</caption>
        <slot />
    </table>
</template>
