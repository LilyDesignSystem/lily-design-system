<script lang="ts">
    // CalendarMonthTable component
    //
    // A calendar grid for a grid of the days of one month: week rows by seven day columns. A structural wrapper like CalendarTable:
    // a <table> with role="grid" and data-view="month"; the consumer supplies the
    // head, body and rows by reusing the CalendarTable* sub-elements.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name describing the period shown, e.g. a month (e.g. "January 2025").
    //   caption — string, optional. Visible caption text displayed above the table.
    //   children — Snippet, required. CalendarTableHead, CalendarTableBody, CalendarTableFoot elements.
    //   ...restProps — additional HTML attributes spread onto the <table>.
    //
    // Syntax:
    //   <CalendarMonthTable label="January 2025">
    //     <CalendarTableBody>...</CalendarTableBody>
    //   </CalendarMonthTable>
    //
    // Keyboard:
    //   None built-in — consumer implements grid keyboard navigation
    //   (arrow keys for cell movement, Enter/Space for selection).
    //
    // Accessibility:
    //   - role="grid" identifies the table as an interactive grid widget
    //   - aria-label provides an accessible name describing the period
    //   - data-view="month" lets consumer CSS and JS key on the view
    //
    // Internationalization:
    //   - label and caption supply all text; locale formatting (Intl) and cell
    //     content are the consumer's concern
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Reuse the CalendarTable* sub-elements; there are no CalendarMonthTable* sub-elements
    //
    // References:
    //   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        caption = undefined,
        children,
        ...restProps
    }: {
        /** Accessible name describing the period shown. */
        label: string;
        /** Visible caption for the table. */
        caption?: string;
        /** CalendarTableHead, CalendarTableBody, CalendarTableFoot elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- CalendarMonthTable.svelte -->
<table
    class={`calendar-month-table ${className}`}
    role="grid"
    aria-label={label}
    data-view="month"
    {...restProps}
>
    {#if caption}
        <caption>{caption}</caption>
    {/if}
    {@render children?.()}
</table>
