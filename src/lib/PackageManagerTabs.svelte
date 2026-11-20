<script lang="ts">
    import {
        ClipboardCopyButton,
        TabBar,
        TabBarButton,
        TabPanel,
    } from "@lilydesignsystem/svelte-headless";

    type Manager = "pnpm" | "npm" | "yarn" | "bun";

    let {
        idPrefix,
        packages,
        label = "Install with a package manager",
    }: {
        idPrefix: string;
        packages: string;
        label?: string;
    } = $props();

    const managers: Manager[] = ["pnpm", "npm", "yarn", "bun"];
    function command(manager: Manager): string {
        const prefix: Record<Manager, string> = {
            pnpm: "pnpm add",
            npm: "npm install",
            yarn: "yarn add",
            bun: "bun add",
        };
        return `${prefix[manager]} ${packages}`;
    }
    let selected = $state<Manager>("pnpm");
    let copyStatus = $state("");
</script>

<div class="package-manager-tabs">
    <TabBar {label}>
        {#each managers as manager}
            <TabBarButton
                id={`${idPrefix}-${manager}-tab`}
                controls={`${idPrefix}-${manager}-panel`}
                selected={selected === manager}
                onclick={() => {
                    selected = manager;
                    copyStatus = "";
                }}>{manager}</TabBarButton
            >
        {/each}
    </TabBar>

    {#each managers as manager}
        <TabPanel
            id={`${idPrefix}-${manager}-panel`}
            label={`${manager} install command`}
            labelledBy={`${idPrefix}-${manager}-tab`}
            selected={selected === manager}
        >
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <pre tabindex="0"><code>{command(manager)}</code></pre>
            <ClipboardCopyButton
                text={command(manager)}
                label={`Copy the ${manager} command`}
                onsuccess={() => (copyStatus = `${manager} command copied`)}
                onerror={() => (copyStatus = `Could not copy the ${manager} command`)}
                >Copy</ClipboardCopyButton
            >
        </TabPanel>
    {/each}

    {#if copyStatus}
        <p
            class="package-manager-tabs-status"
            role="status"
            aria-live="polite"
        >
            {copyStatus}
        </p>
    {/if}
</div>
