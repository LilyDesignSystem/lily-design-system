<script lang="ts">
    import Header from "$lib/components/Header/Header.svelte";
    import Footer from "$lib/components/Footer/Footer.svelte";
    import BackLink from "$lib/components/BackLink/BackLink.svelte";
    import { components, CATEGORY_LABEL } from "$lib/data/components";
    import { suffixPatternOf, SUFFIX_LABEL, STANDALONE_ID } from "$lib/data/suffix-pattern";

    // Plan P6-T5: category + suffix-pattern filters alongside the
    // existing text search. Category comes from each component's own
    // registry entry (bin/generate-component-categories, sourced from
    // the canonical HTML tag in components/{slug}/AGENTS.md); suffix
    // pattern is derived client-side from the slug (src/lib/data/suffix-pattern.ts).
    // Both dropdowns only ever list ids actually present in the
    // catalog, so "All ..." plus real, populated options -- no dead
    // choices that would always return zero results.

    let search = $state("");
    let categoryFilter = $state("");
    let suffixFilter = $state("");

    const withSuffix = components.map((c) => ({ ...c, suffix: suffixPatternOf(c.slug) }));

    function countBy<T extends string>(items: { [k: string]: unknown }[], key: string) {
        const counts = new Map<string, number>();
        for (const item of items) {
            const id = item[key] as string;
            counts.set(id, (counts.get(id) ?? 0) + 1);
        }
        return counts;
    }

    const categoryCounts = countBy(withSuffix, "category");
    const suffixCounts = countBy(withSuffix, "suffix");

    const categoryOptions = Object.entries(CATEGORY_LABEL)
        .filter(([id]) => categoryCounts.has(id))
        .map(([id, label]) => ({ id, label, count: categoryCounts.get(id) ?? 0 }))
        .sort((a, b) => b.count - a.count);

    const suffixOptions = Object.entries(SUFFIX_LABEL)
        .filter(([id]) => suffixCounts.has(id) && id !== STANDALONE_ID)
        .map(([id, label]) => ({ id, label, count: suffixCounts.get(id) ?? 0 }))
        .sort((a, b) => b.count - a.count)
        .concat(
            suffixCounts.has(STANDALONE_ID)
                ? [{ id: STANDALONE_ID, label: SUFFIX_LABEL[STANDALONE_ID], count: suffixCounts.get(STANDALONE_ID) ?? 0 }]
                : []
        );

    let filtered = $derived(
        withSuffix.filter((c) => {
            const q = search.toLowerCase();
            const matchesSearch =
                q === "" ||
                c.name.toLowerCase().includes(q) ||
                c.slug.includes(q) ||
                c.description.toLowerCase().includes(q);
            const matchesCategory = categoryFilter === "" || c.category === categoryFilter;
            const matchesSuffix = suffixFilter === "" || c.suffix === suffixFilter;
            return matchesSearch && matchesCategory && matchesSuffix;
        }),
    );

    function resetFilters() {
        search = "";
        categoryFilter = "";
        suffixFilter = "";
    }
</script>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Components</h1>
        <p>{components.length} headless components</p>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <div class="field">
        <label class="label" for="search">Filter components</label>
        <input
            id="search"
            type="search"
            class="search-input"
            placeholder="Search components..."
            bind:value={search}
        />
    </div>

    <div class="field">
        <label class="label" for="category-filter">Category</label>
        <select id="category-filter" class="select" bind:value={categoryFilter}>
            <option value="">All categories ({components.length})</option>
            {#each categoryOptions as opt (opt.id)}
                <option value={opt.id}>{opt.label} ({opt.count})</option>
            {/each}
        </select>
    </div>

    <div class="field">
        <label class="label" for="suffix-filter">Suffix pattern</label>
        <select id="suffix-filter" class="select" bind:value={suffixFilter}>
            <option value="">All suffix patterns ({components.length})</option>
            {#each suffixOptions as opt (opt.id)}
                <option value={opt.id}>{opt.label} ({opt.count})</option>
            {/each}
        </select>
    </div>

    {#if search || categoryFilter || suffixFilter}
        <p>
            <button type="button" class="button" onclick={resetFilters}>Clear filters</button>
        </p>
    {/if}

    <p role="status">{filtered.length} of {components.length} components</p>

    <ul class="component-index-list">
        {#each filtered as component (component.slug)}
            <li class="component-index-list-item">
                <a href="/components/{component.slug}">{component.name}</a>
                <span class="component-index-list-item-description">{component.description}</span>
            </li>
        {/each}
    </ul>
</main>

<Footer label="Site footer">
    <div class="page-wrapper">
        <p>Lily Design System — MIT or Apache-2.0 or GPL-2.0 or GPL-3.0</p>
    </div>
</Footer>

<style>
    .component-index-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .component-index-list-item {
        border-bottom: 1px solid var(--nhs-color-border, #d8dde0);
        padding: var(--nhs-space-3, 0.75rem) 0;
    }

    .component-index-list-item a {
        font-weight: 700;
    }

    .component-index-list-item-description {
        color: var(--nhs-color-secondary, #4c6272);
        margin-inline-start: 0.5rem;
    }
</style>
