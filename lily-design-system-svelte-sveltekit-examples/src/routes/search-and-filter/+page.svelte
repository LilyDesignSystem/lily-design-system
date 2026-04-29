<script lang="ts">
    import SearchInput from "$lib/components/SearchInput.svelte";
    import Combobox from "$lib/components/Combobox.svelte";
    import Listbox from "$lib/components/Listbox.svelte";
    import TagInput from "$lib/components/TagInput.svelte";
    import TagGroup from "$lib/components/TagGroup.svelte";
    import Tag from "$lib/components/Tag.svelte";
    import Select from "$lib/components/Select.svelte";
    import Option from "$lib/components/Option.svelte";
    import DataTable from "$lib/components/DataTable.svelte";
    import DataTableHead from "$lib/components/DataTableHead.svelte";
    import DataTableBody from "$lib/components/DataTableBody.svelte";
    import DataTableRow from "$lib/components/DataTableRow.svelte";
    import DataTableTD from "$lib/components/DataTableTD.svelte";
    import Badge from "$lib/components/Badge.svelte";
    import Button from "$lib/components/Button.svelte";
    import Field from "$lib/components/Field.svelte";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import BackLink from "$lib/components/BackLink.svelte";

    let searchQuery = $state("");
    let statusFilter = $state("");
    let tags: string[] = $state(["Cardiology", "Urgent"]);
    let comboValue = $state("");
    let comboOpen = $state(false);

    const allServices = [
        { name: "Cardiology", location: "Building A", status: "Available" },
        { name: "Neurology", location: "Building B", status: "Available" },
        { name: "Orthopaedics", location: "Building C", status: "Limited" },
        { name: "Paediatrics", location: "Building A", status: "Available" },
        { name: "Oncology", location: "Building D", status: "Unavailable" },
        { name: "Dermatology", location: "Building B", status: "Available" },
        { name: "Radiology", location: "Building C", status: "Limited" },
        { name: "Psychiatry", location: "Building D", status: "Available" },
    ];

    let filteredServices = $derived(
        allServices.filter((s) => {
            const matchesSearch =
                !searchQuery ||
                s.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = !statusFilter || s.status === statusFilter;
            return matchesSearch && matchesStatus;
        }),
    );

    function addTag(value: string) {
        if (value.trim() && !tags.includes(value.trim())) {
            tags = [...tags, value.trim()];
        }
    }

    function removeTag(index: number) {
        tags = tags.filter((_, i) => i !== index);
    }

    const suggestions = [
        "Cardiology",
        "Neurology",
        "Orthopaedics",
        "Paediatrics",
        "Oncology",
        "Dermatology",
    ];
    let filteredSuggestions = $derived(
        comboValue
            ? suggestions.filter((s) =>
                  s.toLowerCase().includes(comboValue.toLowerCase()),
              )
            : suggestions,
    );
</script>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Search & Filter</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <h2>Search</h2>
    <Field label="Search services">
        <SearchInput label="Search by service name" bind:value={searchQuery} />
    </Field>

    <h2>Filter by Status</h2>
    <Field label="Status">
        <Select label="Filter by status" bind:value={statusFilter}>
            <Option value="">All statuses</Option>
            <Option value="Available">Available</Option>
            <Option value="Limited">Limited</Option>
            <Option value="Unavailable">Unavailable</Option>
        </Select>
    </Field>

    <h2>Active Filters</h2>
    <TagGroup label="Active filter tags">
        {#each tags as tag, i}
            <Tag label={tag}>
                <span>{tag}</span>
                <button
                    style="background:none;border:none;cursor:pointer;margin-left:4px;color:var(--nhs-dark-grey);"
                    onclick={() => removeTag(i)}
                    aria-label="Remove {tag}">x</button
                >
            </Tag>
        {/each}
    </TagGroup>

    <div style="margin-top: var(--nhs-space-3);">
        <TagInput label="Add a filter tag" onadd={addTag} />
    </div>

    <h2>Combobox</h2>
    <div style="margin-bottom: var(--nhs-space-4);">
        <Combobox
            label="Search for a department"
            bind:value={comboValue}
            bind:open={comboOpen}
        >
            {#if comboOpen}
                <ul
                    role="listbox"
                    style="list-style:none;padding:0;margin:0;border:1px solid var(--nhs-mid-grey);border-radius:var(--nhs-border-radius);max-height:200px;overflow-y:auto;"
                >
                    {#each filteredSuggestions as suggestion}
                        <li
                            role="option"
                            aria-selected={comboValue === suggestion}
                            style="padding:var(--nhs-space-2) var(--nhs-space-3);cursor:pointer;"
                            onclick={() => {
                                comboValue = suggestion;
                                comboOpen = false;
                            }}
                            onkeydown={(e) => {
                                if (e.key === "Enter") {
                                    comboValue = suggestion;
                                    comboOpen = false;
                                }
                            }}
                        >
                            {suggestion}
                        </li>
                    {/each}
                </ul>
            {/if}
        </Combobox>
    </div>

    <h2>Results</h2>
    <p><Badge>{filteredServices.length}</Badge> services found</p>

    <DataTable label="Services" caption="Hospital services directory">
        <DataTableHead>
            <DataTableRow>
                <th>Service</th>
                <th>Location</th>
                <th>Status</th>
            </DataTableRow>
        </DataTableHead>
        <DataTableBody>
            {#each filteredServices as service}
                <DataTableRow>
                    <DataTableTD>{service.name}</DataTableTD>
                    <DataTableTD>{service.location}</DataTableTD>
                    <DataTableTD>
                        <Badge
                            type={service.status === "Available"
                                ? "success"
                                : service.status === "Limited"
                                  ? "warning"
                                  : "error"}
                        >
                            {service.status}
                        </Badge>
                    </DataTableTD>
                </DataTableRow>
            {/each}
        </DataTableBody>
    </DataTable>
</main>

<Footer label="Site footer">
    <div class="page-wrapper">
        <p>Lily Design System — Search & Filter Example</p>
    </div>
</Footer>
