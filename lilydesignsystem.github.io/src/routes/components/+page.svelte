<script lang="ts">
    import { LILY_COMPONENTS, PURPOSE_LABEL, type LilyComponent } from "#lib/components.js";
    import { page } from "$app/state";

    let query = $state("");
    let purpose = $state("");

    const purposeOptions = Object.entries(PURPOSE_LABEL).map(([id, label]) => ({
        id,
        label,
        count: LILY_COMPONENTS.filter((c) => c.purpose === id).length,
    }));

    // The header search picker navigates here with `?<text>`; seed and follow the filter from it.
    $effect(() => {
        const q = decodeURIComponent(page.url.search.slice(1).replace(/\+/g, " "));
        if (q) query = q;
    });

    const matches: LilyComponent[] = $derived.by(() => {
        const q = query.trim().toLowerCase();
        return LILY_COMPONENTS.filter(
            (c) =>
                (purpose === "" || c.purpose === purpose) &&
                (!q ||
                    c.name.includes(q) ||
                    c.pascal.toLowerCase().includes(q) ||
                    c.description.toLowerCase().includes(q)),
        );
    });
</script>

<svelte:head>
    <title>Components — Lily Design System</title>
    <meta
        name="description"
        content="Browse all components in the Lily Design System. Search by name or description to find what you need."
    />
</svelte:head>

<section class="page-intro compact-intro">
    <h1>All Lily components</h1>
</section>

<section class="section">
    <select
        id="component-purpose"
        class="component-purpose"
        aria-label="Purpose"
        bind:value={purpose}
    >
        <option value="">All purposes ({LILY_COMPONENTS.length})</option>
        {#each purposeOptions as opt (opt.id)}
            <option value={opt.id}>{opt.label} ({opt.count})</option>
        {/each}
    </select>

    <label
        for="component-search"
        style="display: block; font-weight: 600; margin: 1rem 0 0.5rem;"
    >
        Search components
    </label>
    <input
        id="component-search"
        class="component-search"
        type="search"
        placeholder="Try: button, input, list, table, accordion…"
        autocomplete="off"
        bind:value={query}
    />

    <ul
        class="component-list component-list-stacked"
        aria-label="Component list"
    >
        {#each matches as component (component.name)}
            <li class="component-list-item">
                <a
                    class="component-list-item-link"
                    href="/components/{component.name}/"
                >
                    <span class="component-list-item-name">{component.name}</span>
                </a>:
                <span class="component-list-item-description">{component.description}</span>
            </li>
        {/each}
    </ul>
</section>
