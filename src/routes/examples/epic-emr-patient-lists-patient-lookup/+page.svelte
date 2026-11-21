<!--
  EMR example: the Summary "Index", a page of grouped quick links into the chart, with a patient lookup in the
  shortcut bar. Built from the shared EmrShell; every link is a stub (this is an example). Invented data.
-->
<script lang="ts">
    import EmrShell from "#lib/emr/EmrShell.svelte";
    import { Card } from "@lilydesignsystem/svelte-headless";

    const groups: { heading: string; links: string[] }[] = [
        { heading: "Quick View", links: ["Comprehensive Flowsheet", "Handoff", "Overview", "Patient Care Snapshot", "Encounter Summary", "Care Plan and Patient Education", "Shift Assessment", "Medical, Surgical, Social and Family History", "Restraints", "Discharge", "Code Summary (for printing)", "Blood Transfusion"] },
        { heading: "Therapy", links: ["Therapy Flowsheet", "PT Overview", "OT Overview", "SLP Overview", "Rehab Nursing Flowsheet"] },
        { heading: "Significant Events", links: ["Code", "Code Data", "Sedation", "Blood Products"] },
        { heading: "Orders", links: ["Active Orders", "Medication Administration", "Cancel Individual Lab Collections"] },
        { heading: "Medications", links: ["Current Meds", "Medication History", "Anti-Coagulation Dosing", "Fever/Antibiotic Dosing", "Glucose Monitoring", "Pain Monitoring"] },
        { heading: "Results", links: ["Labs – Last 72 Hours", "Labs – Entire Admission", "Labs – Unresulted", "Microbiology Results", "Radiology Results", "PPD Results"] },
        { heading: "Perinatal", links: ["Current Pregnancy Summary", "Labour Assessment", "Labour Timeline", "Delivery Summary", "Newborn Screening Results"] },
        { heading: "Paediatric / Neonatology", links: ["Paediatric Comprehensive Flowsheet", "Delivery Data", "Apnoea/Bradycardia", "Parenteral Nutrition History", "NICU Nutrition"] },
        { heading: "Infection Control Reports", links: ["Ventilator-Associated Pneumonia", "Central Line Infection", "Device-Related UTI", "Multidrug-Resistant Organisms", "Surgical Site Infection"] },
        { heading: "Oncology", links: ["Oncology Summary", "Treatment & Support Plan", "Infusion Summary"] },
        { heading: "Print", links: ["Patient Summary", "Handoff Report"] },
    ];
    let find = $state("");
    const shown = $derived(
        groups
            .map((g) => ({ ...g, links: g.links.filter((l) => l.toLowerCase().includes(find.trim().toLowerCase())) }))
            .filter((g) => g.links.length > 0),
    );
</script>

<EmrShell
    pageTitle="Patient summary index and patient lookup"
    chartTab="summary"
    subTab="index"
>
    <form
        class="idx-find"
        role="search"
        onsubmit={(e) => e.preventDefault()}
    >
        <label>
            <span class="idx-vh">Find in the index</span>
            <input
                class="text-input"
                type="search"
                placeholder="Find in the index"
                bind:value={find}
            />
        </label>
    </form>

    {#if shown.length === 0}
        <p>No index entries match “{find}”.</p>
    {/if}
    <div class="idx-cols">
        {#each shown as g (g.heading)}
            <Card
                heading={g.heading}
                headingLevel={2}
                class="idx-card"
            >
                <ul class="idx-links">
                    {#each g.links as l (l)}
                        <li><a href="#emr-main">{l}</a></li>
                    {/each}
                </ul>
            </Card>
        {/each}
    </div>
</EmrShell>

<style>
    .idx-vh {
        position: absolute;
        inline-size: 1px;
        block-size: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
    }
    .idx-find {
        display: flex;
        justify-content: flex-end;
        margin-block-end: 0.5rem;
    }
    .idx-find :global(.text-input) {
        min-inline-size: min(16rem, 100%);
    }
    .idx-cols {
        columns: 18rem 3;
        column-gap: 0.75rem;
    }
    .idx-cols :global(.idx-card) {
        break-inside: avoid;
        margin-block-end: 0.75rem;
        border-inline-start: 4px solid var(--color-primary);
        background: var(--color-base-100, Canvas);
    }
    .idx-cols :global(.idx-card h2) {
        margin: 0 0 0.25rem;
        font-size: 1rem;
        color: var(--color-primary);
    }
    .idx-links {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(7.5rem, 1fr));
        gap: 0.5rem 0.75rem;
        margin: 0;
        padding: 0;
        list-style: none;
    }
</style>
