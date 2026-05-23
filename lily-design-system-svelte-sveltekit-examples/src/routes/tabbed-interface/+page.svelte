<script lang="ts">
    import TabBar from "$lib/components/TabBar/TabBar.svelte";
    import TabBarButton from "$lib/components/TabBarButton/TabBarButton.svelte";
    import AccordionNav from "$lib/components/AccordionNav/AccordionNav.svelte";
    import AccordionList from "$lib/components/AccordionList/AccordionList.svelte";
    import AccordionListItem from "$lib/components/AccordionListItem/AccordionListItem.svelte";
    import Badge from "$lib/components/Badge/Badge.svelte";
    import Card from "$lib/components/Card/Card.svelte";
    import Panel from "$lib/components/Panel/Panel.svelte";
    import TreeNav from "$lib/components/TreeNav/TreeNav.svelte";
    import TreeList from "$lib/components/TreeList/TreeList.svelte";
    import ToggleGroup from "$lib/components/ToggleGroup/ToggleGroup.svelte";
    import ToggleButton from "$lib/components/ToggleButton/ToggleButton.svelte";
    import Separator from "$lib/components/Separator/Separator.svelte";
    import Header from "$lib/components/Header/Header.svelte";
    import Footer from "$lib/components/Footer/Footer.svelte";
    import BackLink from "$lib/components/BackLink/BackLink.svelte";

    let activeTab = $state("overview");
    let boldPressed = $state(false);
    let italicPressed = $state(false);
    let underlinePressed = $state(false);
</script>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Tabbed Interface</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <h2>Tabs</h2>
    <TabBar label="Patient sections">
        <TabBarButton
            controls="overview"
            selected={activeTab === "overview"}
            onclick={() => (activeTab = "overview")}
        >
            Overview
        </TabBarButton>
        <TabBarButton
            controls="records"
            selected={activeTab === "records"}
            onclick={() => (activeTab = "records")}
        >
            Records <Badge>12</Badge>
        </TabBarButton>
        <TabBarButton
            controls="appointments"
            selected={activeTab === "appointments"}
            onclick={() => (activeTab = "appointments")}
        >
            Appointments <Badge type="warning">3</Badge>
        </TabBarButton>
        <TabBarButton
            controls="notes"
            selected={activeTab === "notes"}
            onclick={() => (activeTab = "notes")}
        >
            Notes
        </TabBarButton>
    </TabBar>

    <div style="margin-bottom: var(--nhs-space-4);">
        {#if activeTab === "overview"}
            <Panel label="Overview panel" id="overview">
                <h3>Patient Overview</h3>
                <p>
                    General information about the patient, including
                    demographics, primary conditions, and care team.
                </p>
                <Card heading="Primary Condition" headingLevel={4}>
                    <p>
                        Type 2 Diabetes — managed with medication and lifestyle
                        changes.
                    </p>
                </Card>
            </Panel>
        {:else if activeTab === "records"}
            <Panel label="Records panel" id="records">
                <h3>Medical Records</h3>
                <p>
                    12 records on file. Most recent: Blood test results from 28
                    February 2026.
                </p>
            </Panel>
        {:else if activeTab === "appointments"}
            <Panel label="Appointments panel" id="appointments">
                <h3>Upcoming Appointments</h3>
                <ul>
                    <li>10 March 2026 — GP Follow-up</li>
                    <li>24 March 2026 — Diabetes Clinic</li>
                    <li>15 April 2026 — Eye Screening</li>
                </ul>
            </Panel>
        {:else if activeTab === "notes"}
            <Panel label="Notes panel" id="notes">
                <h3>Clinical Notes</h3>
                <p>No new notes since last consultation.</p>
            </Panel>
        {/if}
    </div>

    <Separator />

    <h2>Accordion</h2>
    <AccordionNav label="FAQ accordion">
        <AccordionList>
            <AccordionListItem>
                <details>
                    <summary>How do I register with a GP?</summary>
                    <div style="padding: var(--nhs-space-3);">
                        <p>
                            You can register with any GP surgery that covers
                            your area. Visit the surgery or register online
                            through their website.
                        </p>
                    </div>
                </details>
            </AccordionListItem>
            <AccordionListItem>
                <details>
                    <summary>How do I book an appointment?</summary>
                    <div style="padding: var(--nhs-space-3);">
                        <p>
                            Call your GP surgery, use their online booking
                            system, or use the NHS App to book appointments.
                        </p>
                    </div>
                </details>
            </AccordionListItem>
            <AccordionListItem>
                <details>
                    <summary>What should I do in an emergency?</summary>
                    <div style="padding: var(--nhs-space-3);">
                        <p>
                            Call 999 for life-threatening emergencies. Call 111
                            for urgent medical help when it's not a 999
                            emergency.
                        </p>
                    </div>
                </details>
            </AccordionListItem>
        </AccordionList>
    </AccordionNav>

    <Separator />

    <h2>Tree Navigation</h2>
    <TreeNav label="Department hierarchy">
        <TreeList label="Hospital">
            <li>
                Medicine
                <TreeList label="Medicine departments">
                    <li>Cardiology</li>
                    <li>Neurology</li>
                    <li>Gastroenterology</li>
                </TreeList>
            </li>
            <li>
                Surgery
                <TreeList label="Surgery departments">
                    <li>General Surgery</li>
                    <li>Orthopaedics</li>
                    <li>Urology</li>
                </TreeList>
            </li>
            <li>
                Diagnostics
                <TreeList label="Diagnostics departments">
                    <li>Radiology</li>
                    <li>Pathology</li>
                </TreeList>
            </li>
        </TreeList>
    </TreeNav>

    <Separator />

    <h2>Toggle Group</h2>
    <ToggleGroup label="Text formatting">
        <ToggleButton label="Bold" bind:pressed={boldPressed}>
            <strong>B</strong>
        </ToggleButton>
        <ToggleButton label="Italic" bind:pressed={italicPressed}>
            <em>I</em>
        </ToggleButton>
        <ToggleButton label="Underline" bind:pressed={underlinePressed}>
            <u>U</u>
        </ToggleButton>
    </ToggleGroup>

    <p style="margin-top: var(--nhs-space-3);">
        Preview:
        <span
            style:font-weight={boldPressed ? "bold" : "normal"}
            style:font-style={italicPressed ? "italic" : "normal"}
            style:text-decoration={underlinePressed ? "underline" : "none"}
        >
            Sample formatted text
        </span>
    </p>
</main>

<Footer label="Site footer">
    <div class="page-wrapper">
        <p>Lily Design System — Tabbed Interface Example</p>
    </div>
</Footer>
