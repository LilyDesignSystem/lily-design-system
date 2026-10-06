<script lang="ts">
    import { page } from "$app/state";
    import Header from "#lib/components/Header/Header.svelte";
    import Footer from "#lib/components/Footer/Footer.svelte";
    import BackLink from "#lib/components/BackLink/BackLink.svelte";
    import { components } from "#lib/data/components.js";
    import { componentDemos } from "#lib/data/component-demos.js";
    import { componentExamples } from "#lib/data/component-examples.js";

    const slug = $derived(page.params.slug);
    const component = $derived(components.find((c) => c.slug === slug));
    const demoHtml = $derived(slug ? componentDemos[slug] : undefined);
    const example = $derived(slug ? componentExamples[slug] : undefined);
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

        {#if demoHtml}
            <details>
                <summary>Show demo markup</summary>
                <pre tabindex="0"><code>{demoHtml}</code></pre>
            </details>
        {/if}

        {#if example?.variants?.length}
            <h2>More examples</h2>
            {#each example.variants as variant (variant.title)}
                <h3>{variant.title}</h3>
                <div class="card" style="padding: 1.5rem;">
                    {@html variant.html}
                </div>
                <details>
                    <summary>Show markup</summary>
                    <pre tabindex="0"><code>{variant.html}</code></pre>
                </details>
            {/each}
        {/if}

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
        {#if example?.usage}
            <pre tabindex="0"><code>{example.usage.code}</code></pre>
        {:else}
            <pre tabindex="0"><code>&lt;{component.name} /&gt;</code></pre>
        {/if}

        <h2>Import</h2>
        <pre tabindex="0"><code>import {component.name} from "#lib/components/{component.name}.svelte";</code></pre>
    {:else}
        <p>Component not found.</p>
    {/if}
</main>

<Footer label="Site footer">
    <div class="page-wrapper">
        <p>Lily Design System — MIT or Apache-2.0 or GPL-2.0 or GPL-3.0</p>
    </div>
</Footer>
