<script lang="ts">
    import { page } from "$app/state";
    import Header from "$lib/components/Header/Header.svelte";
    import Footer from "$lib/components/Footer/Footer.svelte";
    import BackLink from "$lib/components/BackLink/BackLink.svelte";
    import { components } from "$lib/data/components";
    import { componentDemos } from "$lib/data/component-demos";

    const slug = $derived(page.params.slug);
    const component = $derived(components.find((c) => c.slug === slug));
    const demoHtml = $derived(slug ? componentDemos[slug] : undefined);
</script>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>{component?.name ?? "Component Not Found"}</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/components">Back to components</BackLink>

    {#if component}
        <p>{component.description}</p>

        <h2>Demo</h2>
        <div class="card" style="padding: 1.5rem;">
            {#if demoHtml}
                {@html demoHtml}
            {:else}
                <p><em>No demo available.</em></p>
            {/if}
        </div>

        <h2>Details</h2>
        <dl>
            <dt>Name</dt>
            <dd>{component.name}</dd>
            <dt>Slug</dt>
            <dd><code>{component.slug}</code></dd>
            <dt>Description</dt>
            <dd>{component.description}</dd>
        </dl>

        <h2>Usage</h2>
        <pre><code>&lt;{component.name} /&gt;</code></pre>

        <h2>Import</h2>
        <pre><code>import {component.name} from "$lib/components/{component.name}.svelte";</code></pre>
    {:else}
        <p>Component not found.</p>
    {/if}
</main>

<Footer label="Site footer">
    <div class="page-wrapper">
        <p>Lily Design System — MIT or Apache-2.0 or GPL-2.0 or GPL-3.0</p>
    </div>
</Footer>
