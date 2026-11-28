<script lang="ts">
    let { label }: { label: string } = $props();

    // Twelve of Lily's components, each with its own SVG icon in /assets/images/icons/{slug}/icon.svg, and More, the whole catalog.
    const components = [
        ["link-picker", "Link"],
        ["avatar-image", "Avatar", "/components/avatar-image/"],
        ["bar-chart", "Chart", "/components/bar-chart/"],
        ["calendar", "Calendar"],
        ["chat-bubble", "Chat", "/components/chat-message/"],
        ["data-grid", "Data"],
        ["gantt-chart", "Gantt"],
        ["kanban-board", "Kanban"],
        ["locale-picker", "Locale"],
        ["search-picker", "Search"],
        ["settings-picker", "Settings"],
        ["theme-picker", "Theme"],
        ["more", "More", "/components/"],
    ] as const;
</script>

<ul
    class="component-icon-row"
    aria-label={label}
>
    {#each components as [slug, name, href] (slug)}
        <li>
            <a
                class="framework-icon-link"
                href={href ??
                    `https://github.com/LilyDesignSystem/lily-design-system/tree/main/lily-design-system-svelte-${slug}`}
            >
                <img
                    src={`/assets/images/icons/${slug}/icon.svg`}
                    alt=""
                    width="40"
                    height="40"
                />
                <span lang="en">{name}</span>
            </a>
        </li>
    {/each}
</ul>

<style>
    /* Scoped here, not in static/assets/style.css: these styles ship with the page under a content hash, so a cached stylesheet
     can never show the list as a plain bulleted column. Thirteen items, as many as the framework row below, and the same
     spacing: 3.5rem cells (.framework-icon-link) and 0.25rem gaps, so each icon sits above a framework icon and both rows fit on
     one line from about 810px wide; below that the row wraps, centred, and never scrolls sideways. Like the framework row, it
     breaks out of the 48rem intro column, centred on it. */
    .component-icon-row {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.25rem;
        width: min(calc(100vw - 2rem), var(--lily-content-max));
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        margin: 1.5rem 0;
        padding: 0;
        list-style: none;
    }
    .component-icon-row > li {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    .component-icon-row > li::marker {
        content: none;
    }
    /* Right to left starts the row at the right edge, so centring it mirrors. */
    .component-icon-row:dir(rtl) {
        left: auto;
        right: 50%;
        transform: translateX(50%);
    }
</style>
