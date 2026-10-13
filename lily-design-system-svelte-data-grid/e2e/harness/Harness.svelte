<script lang="ts">
    import DataGrid from "../../DataGrid.svelte";
    import type { DataGridColumn } from "../../DataGrid.svelte";

    const rows = [
        { name: "Bob", email: "bob@example.com" },
        { name: "Alice", email: "alice@example.com" },
    ];
    const columns: DataGridColumn[] = [
        { id: "name", header: "Name", sortable: true },
        { id: "email", header: "Email", cell: emailCell },
    ];
    let activated = $state("");
</script>

{#snippet emailCell(ctx: { formatted: string })}
    <span>
        <a class="w-link" href="#{ctx.formatted}">{ctx.formatted}</a>
        <input class="w-input" aria-label="Edit {ctx.formatted}" value={ctx.formatted} />
    </span>
{/snippet}

<DataGrid label="Users" {columns} {rows} onRowActivate={(row) => (activated = String(row.name))} />
<p id="activated">{activated}</p>
