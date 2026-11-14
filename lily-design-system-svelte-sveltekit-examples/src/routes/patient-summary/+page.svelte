<script lang="ts">
    // International Patient Summary (spec/healthcare-ui item 9, P27-T9): the three sections the IPS (HL7 FHIR IPS, ISO 27269)
    // requires (allergies, medication summary, problems), each with its own heading and record list (P28-T3). A required
    // section with no data shows the consumer's words for why (the IPS emptyReason) as its list's status, never an empty
    // space. Coded values (P28-T9): the display first; "Show codes" reveals each code, and the clinical content carries the
    // document's language. e2e/healthcare-pages.spec.ts checks it.
    import Header from "#lib/components/Header/Header.svelte";
    import BackLink from "#lib/components/BackLink/BackLink.svelte";
    import AllergyRecordList from "#lib/components/AllergyRecordList/AllergyRecordList.svelte";
    import AllergyRecordListItem from "#lib/components/AllergyRecordListItem/AllergyRecordListItem.svelte";
    import MedicationRecordList from "#lib/components/MedicationRecordList/MedicationRecordList.svelte";
    import MedicationRecordListItem from "#lib/components/MedicationRecordListItem/MedicationRecordListItem.svelte";
    import MedicationView from "#lib/components/MedicationView/MedicationView.svelte";
    import ProblemRecordList from "#lib/components/ProblemRecordList/ProblemRecordList.svelte";
    import ToggleButton from "#lib/components/ToggleButton/ToggleButton.svelte";
    import { formatQuantity } from "#lib/components/clinical-format.ts";

    const locale = "en-GB";
    // The document's own language, from Composition.language; it can differ from the interface's.
    const documentLanguage = "en";
    let showCodes = $state(false);
</script>

<svelte:head>
    <title>Patient summary — Lily Design System</title>
</svelte:head>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Patient summary</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <p>
        A patient summary in the shape of the International Patient Summary: allergies, medicines
        and problems, each always present, with a reason when it has nothing to show.
    </p>

    <ToggleButton
        label="Show codes"
        bind:pressed={showCodes}>Show codes</ToggleButton
    >

    <div lang={documentLanguage}>
        <section aria-labelledby="ips-allergies">
            <h2 id="ips-allergies">Allergies and intolerances</h2>
            <AllergyRecordList
                status="known"
                statusLabel="Known allergies"
            >
                <AllergyRecordListItem
                    substance="Penicillin"
                    reaction="Anaphylaxis"
                    severity="severe"
                    severityLabel="Severe"
                    criticality="high"
                    criticalityLabel="High risk"
                    verificationStatus="confirmed"
                    verificationStatusLabel="Confirmed"
                    updated="2026-11-03"
                    updatedLabel="Updated 3 Nov 2026"
                >
                    <span
                        class="patient-summary-code"
                        hidden={!showCodes}><code>SNOMED CT 373270004</code></span
                    >
                </AllergyRecordListItem>
            </AllergyRecordList>
        </section>

        <section aria-labelledby="ips-medicines">
            <h2 id="ips-medicines">Medication summary</h2>
            <MedicationRecordList
                status="known"
                statusLabel="Current medicines"
            >
                <MedicationRecordListItem
                    status="active"
                    statusLabel="Active"
                >
                    <MedicationView
                        name="metformin"
                        strength={formatQuantity(500, "mg", locale)}
                        form="tablet"
                        route="oral"
                        frequency="twice daily"
                    />
                    <span
                        class="patient-summary-code"
                        hidden={!showCodes}><code>ATC A10BA02</code></span
                    >
                </MedicationRecordListItem>
                <MedicationRecordListItem
                    status="active"
                    statusLabel="Active"
                >
                    <MedicationView
                        nameSegments={[{ text: "hydr" }, { text: "ALAZINE", tallMan: true }]}
                        strength={formatQuantity(25, "mg", locale)}
                        form="tablet"
                        route="oral"
                        frequency="twice daily"
                    />
                    <span
                        class="patient-summary-code"
                        hidden={!showCodes}><code>ATC C02DB02</code></span
                    >
                </MedicationRecordListItem>
                <MedicationRecordListItem
                    status="active"
                    statusLabel="Active"
                >
                    <MedicationView
                        name="levothyroxine"
                        strength={formatQuantity(0.05, "mg", locale)}
                        form="tablet"
                        route="oral"
                        frequency="once daily"
                    />
                    <span
                        class="patient-summary-code"
                        hidden={!showCodes}><code>ATC H03AA01</code></span
                    >
                </MedicationRecordListItem>
            </MedicationRecordList>
        </section>

        <section aria-labelledby="ips-problems">
            <h2 id="ips-problems">Problems</h2>
            <ProblemRecordList
                status="not-recorded"
                statusLabel="No information about current problems is available"
            />
        </section>
    </div>
</main>
