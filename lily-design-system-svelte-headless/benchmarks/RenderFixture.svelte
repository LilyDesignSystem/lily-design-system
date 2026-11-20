<script lang="ts">
    import Button from "../components/Button/Button.svelte";
    import DataTable from "../components/DataTable/DataTable.svelte";
    import Listbox from "../components/Listbox/Listbox.svelte";
    import TextInput from "../components/TextInput/TextInput.svelte";

    type Variant =
        | "lily-button"
        | "native-button"
        | "lily-input"
        | "native-input"
        | "lily-listbox"
        | "native-listbox"
        | "lily-table"
        | "native-table";

    let { variant }: { variant: Variant } = $props();
    const items = Array.from({ length: 100 }, (_, index) => `Option ${index + 1}`);
    const rows = Array.from({ length: 100 }, (_, index) => ({
        name: `Patient ${index + 1}`,
        status: index % 2 === 0 ? "Active" : "Discharged",
    }));
</script>

{#if variant === "lily-button"}
    <Button>Save</Button>
{:else if variant === "native-button"}
    <button type="button">Save</button>
{:else if variant === "lily-input"}
    <TextInput label="Patient name" />
{:else if variant === "native-input"}
    <input
        aria-label="Patient name"
        type="text"
    />
{:else if variant === "lily-listbox"}
    <Listbox label="Options">
        {#each items as item, index}
            <div
                role="option"
                tabindex="-1"
                aria-selected={index === 0}
            >
                {item}
            </div>
        {/each}
    </Listbox>
{:else if variant === "native-listbox"}
    <div
        role="listbox"
        aria-label="Options"
    >
        {#each items as item, index}
            <div
                role="option"
                tabindex="-1"
                aria-selected={index === 0}
            >
                {item}
            </div>
        {/each}
    </div>
{:else if variant === "lily-table"}
    <DataTable label="Patients">
        <tbody>
            {#each rows as row}
                <tr><td>{row.name}</td><td>{row.status}</td></tr>
            {/each}
        </tbody>
    </DataTable>
{:else}
    <table
        role="grid"
        aria-label="Patients"
    >
        <tbody>
            {#each rows as row}
                <tr><td>{row.name}</td><td>{row.status}</td></tr>
            {/each}
        </tbody>
    </table>
{/if}
