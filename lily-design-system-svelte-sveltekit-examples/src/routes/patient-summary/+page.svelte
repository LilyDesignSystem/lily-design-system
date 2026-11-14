<script lang="ts">
    // International Patient Summary (spec/healthcare-ui item 9, P27-T9): the three sections the IPS (HL7 FHIR IPS, ISO 27269)
    // requires (allergies, medication summary, problems), each with its own heading. A required section with no data shows
    // the consumer's words for why (the IPS emptyReason), never an empty space. e2e/healthcare-pages.spec.ts checks it.
    import Header from "#lib/components/Header/Header.svelte";
    import BackLink from "#lib/components/BackLink/BackLink.svelte";
    import AllergyRecordList from "#lib/components/AllergyRecordList/AllergyRecordList.svelte";
    import AllergyRecordListItem from "#lib/components/AllergyRecordListItem/AllergyRecordListItem.svelte";
    import MedicationRecordList from "#lib/components/MedicationRecordList/MedicationRecordList.svelte";
    import MedicationRecordListItem from "#lib/components/MedicationRecordListItem/MedicationRecordListItem.svelte";
    import MedicationView from "#lib/components/MedicationView/MedicationView.svelte";
    import ProblemRecordList from "#lib/components/ProblemRecordList/ProblemRecordList.svelte";
    import { formatQuantity } from "#lib/components/clinical-format";

    const locale = "en-GB";
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
            />
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
</main>
