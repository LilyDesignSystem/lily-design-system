<script lang="ts">
    import Dialog from "$lib/components/Dialog/Dialog.svelte";
    import AlertDialog from "$lib/components/AlertDialog/AlertDialog.svelte";
    import Drawer from "$lib/components/Drawer/Drawer.svelte";
    import SlideOutDrawer from "$lib/components/SlideOutDrawer/SlideOutDrawer.svelte";
    import Sheet from "$lib/components/Sheet/Sheet.svelte";
    import Popover from "$lib/components/Popover/Popover.svelte";
    import Popup from "$lib/components/Popup/Popup.svelte";
    import HoverCard from "$lib/components/HoverCard/HoverCard.svelte";
    import Tooltip from "$lib/components/Tooltip/Tooltip.svelte";
    import FloatingPanel from "$lib/components/FloatingPanel/FloatingPanel.svelte";
    import Button from "$lib/components/Button/Button.svelte";
    import Collapsible from "$lib/components/Collapsible/Collapsible.svelte";
    import Details from "$lib/components/Details/Details.svelte";
    import Expander from "$lib/components/Expander/Expander.svelte";
    import Header from "$lib/components/Header/Header.svelte";
    import Footer from "$lib/components/Footer/Footer.svelte";
    import BackLink from "$lib/components/BackLink/BackLink.svelte";

    let showDialog = $state(false);
    let showAlert = $state(false);
    let showDrawer = $state(false);
    let showSlideOut = $state(false);
    let showSheet = $state(false);
    let showPopover = $state(false);
    let showPopup = $state(false);
    let showHoverCard = $state(false);
    let showTooltip = $state(false);
    let showFloating = $state(false);
</script>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Dialog Flow</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <h2>Dialogs</h2>
    <div
        style="display: flex; gap: var(--nhs-space-3); flex-wrap: wrap; margin-bottom: var(--nhs-space-4);"
    >
        <Button onclick={() => (showDialog = true)}>Open Dialog</Button>
        <Button onclick={() => (showAlert = true)}>Open Alert Dialog</Button>
    </div>

    <Dialog label="Example dialog" bind:open={showDialog}>
        <h2>Dialog Title</h2>
        <p>This is a modal dialog. Press Escape or click Close to dismiss.</p>
        <Button onclick={() => (showDialog = false)}>Close</Button>
    </Dialog>

    <AlertDialog label="Confirm deletion" bind:open={showAlert}>
        <h2>Are you sure?</h2>
        <p>
            This action cannot be undone. All data will be permanently deleted.
        </p>
        <div style="display: flex; gap: var(--nhs-space-3);">
            <Button onclick={() => (showAlert = false)}>Cancel</Button>
            <Button onclick={() => (showAlert = false)}>Delete</Button>
        </div>
    </AlertDialog>

    <h2>Drawers & Sheets</h2>
    <div
        style="display: flex; gap: var(--nhs-space-3); flex-wrap: wrap; margin-bottom: var(--nhs-space-4);"
    >
        <Button onclick={() => (showDrawer = true)}>Open Drawer</Button>
        <Button onclick={() => (showSlideOut = true)}
            >Open Slide-Out Drawer</Button
        >
        <Button onclick={() => (showSheet = true)}>Open Sheet</Button>
    </div>

    <Drawer label="Settings drawer" bind:open={showDrawer} side="right">
        <h2>Settings</h2>
        <p>Configure your preferences here.</p>
        <Button onclick={() => (showDrawer = false)}>Close</Button>
    </Drawer>

    <SlideOutDrawer label="Details drawer" bind:open={showSlideOut}>
        <h2>Record Details</h2>
        <p>Additional information about the selected record.</p>
        <Button onclick={() => (showSlideOut = false)}>Close</Button>
    </SlideOutDrawer>

    <Sheet label="Actions sheet" bind:open={showSheet} side="right">
        <h2>Quick Actions</h2>
        <ul>
            <li>Edit record</li>
            <li>Share record</li>
            <li>Export as PDF</li>
            <li>Delete record</li>
        </ul>
        <Button onclick={() => (showSheet = false)}>Close</Button>
    </Sheet>

    <h2>Popovers & Tooltips</h2>
    <div
        style="display: flex; gap: var(--nhs-space-3); flex-wrap: wrap; margin-bottom: var(--nhs-space-4); align-items: flex-start;"
    >
        <div style="position: relative;">
            <Button onclick={() => (showPopover = !showPopover)}
                >Toggle Popover</Button
            >
            <Popover label="Info popover" bind:open={showPopover}>
                <p style="margin: 0;">
                    This is a popover with additional context.
                </p>
            </Popover>
        </div>

        <div style="position: relative;">
            <Button onclick={() => (showHoverCard = !showHoverCard)}
                >Toggle Hover Card</Button
            >
            <HoverCard label="User info" bind:open={showHoverCard}>
                <p style="margin: 0;"><strong>Dr. Jane Smith</strong></p>
                <p style="margin: 0;">Senior Consultant, Cardiology</p>
            </HoverCard>
        </div>

        <div
            style="position: relative; display: inline-block;"
            role="group"
            onmouseenter={() => (showTooltip = true)}
            onmouseleave={() => (showTooltip = false)}
        >
            <Button>Hover for Tooltip</Button>
            <Tooltip
                label="This button saves your progress"
                bind:visible={showTooltip}
            />
        </div>
    </div>

    <h2>Popups & Floating Panels</h2>
    <div
        style="display: flex; gap: var(--nhs-space-3); flex-wrap: wrap; margin-bottom: var(--nhs-space-4);"
    >
        <Button onclick={() => (showPopup = !showPopup)}>Toggle Popup</Button>
        <Button onclick={() => (showFloating = !showFloating)}
            >Toggle Floating Panel</Button
        >
    </div>

    <Popup label="Notification popup" bind:open={showPopup}>
        <h3>Notification</h3>
        <p>Your changes have been saved successfully.</p>
        <Button onclick={() => (showPopup = false)}>Dismiss</Button>
    </Popup>

    <FloatingPanel label="Quick notes" open={showFloating}>
        <h3>Quick Notes</h3>
        <p>This floating panel stays visible as you scroll.</p>
        <Button onclick={() => (showFloating = false)}>Close</Button>
    </FloatingPanel>

    <h2>Collapsible Content</h2>

    <Collapsible summary="What is the NHS?">
        <p>
            The National Health Service (NHS) is the publicly funded healthcare
            system in the United Kingdom.
        </p>
    </Collapsible>

    <Details summary="View technical details">
        <p>Version: 2.1.0</p>
        <p>Last updated: 3 March 2026</p>
        <p>API endpoint: /api/v2/records</p>
    </Details>

    <Expander label="Show advanced options">
        <p>Advanced configuration options would appear here.</p>
    </Expander>
</main>

<Footer label="Site footer">
    <div class="page-wrapper">
        <p>Lily Design System — Dialog Flow Example</p>
    </div>
</Footer>
