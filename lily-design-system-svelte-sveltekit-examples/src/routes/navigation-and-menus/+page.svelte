<script lang="ts">
    import NavigationMenu from "$lib/components/NavigationMenu/NavigationMenu.svelte";
    import MenuBar from "$lib/components/MenuBar/MenuBar.svelte";
    import MenuBarButton from "$lib/components/MenuBarButton/MenuBarButton.svelte";
    import Menu from "$lib/components/Menu/Menu.svelte";
    import MenuItem from "$lib/components/MenuItem/MenuItem.svelte";
    import ToolBar from "$lib/components/ToolBar/ToolBar.svelte";
    import ToolBarButton from "$lib/components/ToolBarButton/ToolBarButton.svelte";
    import HamburgerMenu from "$lib/components/HamburgerMenu/HamburgerMenu.svelte";
    import DropdownMenu from "$lib/components/DropdownMenu/DropdownMenu.svelte";
    import ContextMenu from "$lib/components/ContextMenu/ContextMenu.svelte";
    import ContextMenuItem from "$lib/components/ContextMenuItem/ContextMenuItem.svelte";
    import ActionLink from "$lib/components/ActionLink/ActionLink.svelte";
    import BackLink from "$lib/components/BackLink/BackLink.svelte";
    import PaginationNav from "$lib/components/PaginationNav/PaginationNav.svelte";
    import PaginationList from "$lib/components/PaginationList/PaginationList.svelte";
    import PaginationListItem from "$lib/components/PaginationListItem/PaginationListItem.svelte";
    import Header from "$lib/components/Header/Header.svelte";
    import Footer from "$lib/components/Footer/Footer.svelte";

    let showDropdown = $state(false);
    let showContext = $state(false);
    let hamburgerOpen = $state(false);
    let currentPage = $state(3);
</script>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Navigation & Menus</h1>
        <NavigationMenu label="Main navigation">
            <a href="/">Home</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/contact-form">Contact</a>
            <a href="/settings-page">Settings</a>
        </NavigationMenu>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <h2>Menu Bar</h2>
    <MenuBar label="Application menu">
        <MenuBarButton>File</MenuBarButton>
        <MenuBarButton>Edit</MenuBarButton>
        <MenuBarButton>View</MenuBarButton>
        <MenuBarButton>Help</MenuBarButton>
    </MenuBar>

    <h2>Tool Bar</h2>
    <ToolBar label="Editing toolbar">
        <ToolBarButton>Bold</ToolBarButton>
        <ToolBarButton>Italic</ToolBarButton>
        <ToolBarButton>Underline</ToolBarButton>
        <ToolBarButton disabled>Strikethrough</ToolBarButton>
    </ToolBar>

    <h2>Menu</h2>
    <Menu label="Actions menu">
        <MenuItem>New document</MenuItem>
        <MenuItem>Open file</MenuItem>
        <MenuItem>Save</MenuItem>
        <MenuItem>Export as PDF</MenuItem>
    </Menu>

    <h2>Hamburger Menu</h2>
    <div
        style="background: var(--nhs-dark-grey); padding: var(--nhs-space-3); border-radius: var(--nhs-border-radius); display: inline-block;"
    >
        <HamburgerMenu label="Mobile menu" bind:open={hamburgerOpen}>
            <div
                style="padding: var(--nhs-space-3); background: var(--nhs-white); border-radius: var(--nhs-border-radius);"
            >
                <nav>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="padding: var(--nhs-space-2) 0;">
                            <a href="/">Home</a>
                        </li>
                        <li style="padding: var(--nhs-space-2) 0;">
                            <a href="/dashboard">Dashboard</a>
                        </li>
                        <li style="padding: var(--nhs-space-2) 0;">
                            <a href="/settings-page">Settings</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </HamburgerMenu>
    </div>

    <h2>Dropdown Menu</h2>
    <div style="position: relative; display: inline-block;">
        <button class="button" onclick={() => (showDropdown = !showDropdown)}
            >Actions</button
        >
        <DropdownMenu label="Quick actions" bind:open={showDropdown}>
            <MenuItem>Edit profile</MenuItem>
            <MenuItem>Change password</MenuItem>
            <MenuItem>Sign out</MenuItem>
        </DropdownMenu>
    </div>

    <h2>Context Menu</h2>
    <div
        style="position: relative; border: 2px dashed var(--nhs-mid-grey); padding: var(--nhs-space-5); text-align: center; margin-bottom: var(--nhs-space-4); border-radius: var(--nhs-border-radius);"
        role="region"
        aria-label="Context menu demo area"
        oncontextmenu={(e) => {
            e.preventDefault();
            showContext = !showContext;
        }}
    >
        <p>Right-click in this area to open the context menu</p>
        <ContextMenu label="Item actions" bind:open={showContext}>
            <ContextMenuItem>Copy</ContextMenuItem>
            <ContextMenuItem>Paste</ContextMenuItem>
            <ContextMenuItem>Delete</ContextMenuItem>
        </ContextMenu>
    </div>

    <h2>Action Links</h2>
    <div
        style="display: flex; flex-direction: column; gap: var(--nhs-space-2); margin-bottom: var(--nhs-space-4);"
    >
        <ActionLink href="/contact-form">Book an appointment</ActionLink>
        <ActionLink href="/dashboard">View your records</ActionLink>
        <ActionLink href="/settings-page">Manage your account</ActionLink>
    </div>

    <h2>Pagination</h2>
    <PaginationNav label="Results pagination">
        <PaginationList label="Page list">
            {#each [1, 2, 3, 4, 5] as page}
                <PaginationListItem>
                    {#if page === currentPage}
                        <span aria-current="page">{page}</span>
                    {:else}
                        <a
                            href="#{page}"
                            onclick={(e) => {
                                e.preventDefault();
                                currentPage = page;
                            }}>{page}</a
                        >
                    {/if}
                </PaginationListItem>
            {/each}
        </PaginationList>
    </PaginationNav>
</main>

<Footer label="Site footer">
    <div class="page-wrapper">
        <p>Lily Design System — Navigation & Menus Example</p>
    </div>
</Footer>
