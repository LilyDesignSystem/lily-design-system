<script lang="ts">
    // DataTableRow component
    //
    // A single row within a DataTable. Renders as a <tr> containing
    // DataTableData cells or header cells. Used inside DataTableHead,
    // DataTableBody, or DataTableFoot.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. DataTableData cells or header cells for this row.
    //   ...restProps — additional HTML attributes spread onto the <tr>.
    //
    // Syntax:
    //   <DataTableRow>
    //     <DataTableData>Alice</DataTableData>
    //     <DataTableData>alice@example.com</DataTableData>
    //   </DataTableRow>
    //
    // Keyboard:
    //   None built-in — keyboard navigation handled at the DataTable grid level.
    //
    // Accessibility:
    //   - <tr> has implicit role="row" (no explicit role needed)
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside DataTableHead, DataTableBody, or DataTableFoot
    //   - No internal state — purely a structural wrapper
    //
    // References:
    //   - HTML tr element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        /** DataTableData cells or header cells for this row. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- DataTableRow.svelte -->
<tr
    class={`data-table-row ${className}`}
    {...restProps}
>
    {@render children()}
</tr>
