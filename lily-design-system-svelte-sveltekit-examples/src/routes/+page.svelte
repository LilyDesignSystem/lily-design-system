<script lang="ts">
    import Header from "$lib/components/Header/Header.svelte";
    import Footer from "$lib/components/Footer/Footer.svelte";
    import NavigationMenu from "$lib/components/NavigationMenu/NavigationMenu.svelte";

    const examples = [
        {
            href: "/contact-form",
            title: "Contact Form",
            description: "Form inputs, validation, and error handling",
        },
        {
            href: "/dashboard",
            title: "Dashboard",
            description: "Cards, tables, progress indicators, and data display",
        },
        {
            href: "/dialog-flow",
            title: "Dialog Flow",
            description: "Dialogs, drawers, popovers, and overlay patterns",
        },
        {
            href: "/file-upload-form",
            title: "File Upload Form",
            description: "File inputs, drag-and-drop uploads, and progress",
        },
        {
            href: "/navigation-and-menus",
            title: "Navigation & Menus",
            description: "Navigation menus, toolbars, and pagination",
        },
        {
            href: "/page-layout",
            title: "Page Layout",
            description: "Headers, footers, sidebars, and content layout",
        },
        {
            href: "/rating-and-feedback",
            title: "Rating & Feedback",
            description: "Star ratings, NPS, face ratings, and RAG status",
        },
        {
            href: "/search-and-filter",
            title: "Search & Filter",
            description: "Search inputs, combobox, tags, and data filtering",
        },
        {
            href: "/settings-page",
            title: "Settings Page",
            description: "Switches, selects, themes, and configuration",
        },
        {
            href: "/tabbed-interface",
            title: "Tabbed Interface",
            description: "Tabs, accordions, tree navigation, and toggles",
        },
        {
            href: "/task-management",
            title: "Task Management",
            description: "Task lists, checklists, editable content, and tags",
        },
        {
            href: "/timeline-and-cards",
            title: "Timeline & Cards",
            description: "Timelines, avatars, figures, emoji, and tours",
        },
    ];
</script>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Lily Design System</h1>
        <p>Svelte SvelteKit Examples with NHS UK Styles</p>
    </div>
</Header>

<main class="page-wrapper">
    <h2>Example Pages</h2>
    <p>
        Each page demonstrates multiple headless components styled with NHS UK
        design tokens.
    </p>

    <div
        style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;"
    >
        {#each examples as example}
            <article class="card" style="padding: var(--nhs-space-4);">
                <h3><a href={example.href}>{example.title}</a></h3>
                <p>{example.description}</p>
            </article>
        {/each}
    </div>
</main>

<Footer label="Site footer">
    <div class="page-wrapper">
        <p>Lily Design System — MIT or Apache-2.0 or GPL-2.0 or GPL-3.0</p>
    </div>
</Footer>
