<script lang="ts">
    // Overflow navigation demo (plan P18-T2). Renders the real NavigationMenu
    // component in `overflow` mode, so the ResizeObserver in
    // overflow-navigation.ts runs in a browser; the /components/navigation-menu
    // page renders static demo HTML instead. e2e/overflow-navigation.spec.ts
    // measures it at 1200, 420 and 320 CSS pixels, with and without JavaScript.
    //
    // The paragraph after the navigation is the "content below": opening the
    // More list must push it down (normal flow), never cover it (WCAG 2.4.11).
    import NavigationMenu from "#lib/components/NavigationMenu/NavigationMenu.svelte";

    const items = [
        { href: "#home", text: "Home", current: true },
        { href: "#appointments", text: "Appointments" },
        { href: "#prescriptions", text: "Prescriptions" },
        { href: "#test-results", text: "Test results" },
        { href: "#messages", text: "Messages" },
        { href: "#health-record", text: "Health record" },
        { href: "#settings", text: "Settings" },
        { href: "#help", text: "Help" },
    ];
</script>

<svelte:head>
    <title>Overflow navigation — Lily Svelte examples</title>
</svelte:head>

<main class="page-wrapper">
    <h1>Overflow navigation</h1>
    <p>
        The navigation menu below is in overflow mode: the links that do not fit on one row move
        into a "More" list. Without JavaScript the links wrap.
    </p>

    <NavigationMenu
        label="Main navigation"
        overflow
        moreLabel="More"
        data-testid="overflow-nav"
    >
        {#each items as item (item.href)}
            <li>
                <a
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}>{item.text}</a
                >
            </li>
        {/each}
    </NavigationMenu>

    <p data-testid="content-below">
        This paragraph follows the navigation. Opening the More list pushes it down.
    </p>
</main>
