<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import BackLink from "$lib/components/BackLink.svelte";
    import { components } from "$lib/data/components";

    let search = $state("");
    let filtered = $derived(
        components.filter(
            (c) =>
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.slug.includes(search.toLowerCase()) ||
                c.description.toLowerCase().includes(search.toLowerCase()),
        ),
    );
</script>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Components</h1>
        <p>284 headless components</p>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <label for="search">Filter components</label>
    <input
        id="search"
        type="search"
        class="search-input"
        placeholder="Search components..."
        bind:value={search}
    />

    <p>{filtered.length} components</p>

    <ul style="list-style: none; padding: 0; margin: 0;">
        {#each filtered as component}
            <li style="border-bottom: 1px solid var(--nhs-color-border, #d8dde0); padding: var(--nhs-space-3) 0;">
                <a href="/components/{component.slug}" style="font-weight: 700;">{component.name}</a>
                <span style="color: var(--nhs-color-secondary, #4c6272); margin-left: 0.5rem;">{component.description}</span>
            </li>
        {/each}
    </ul>
</main>

<Footer label="Site footer">
    <div class="page-wrapper">
        <p>Lily Design System — MIT or Apache-2.0 or GPL-2.0 or GPL-3.0</p>
    </div>
</Footer>
