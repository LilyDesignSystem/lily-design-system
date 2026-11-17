<script lang="ts">
    // International Patient Summary (spec/healthcare-ui items 9 and 21, P27-T9): the three sections the IPS (HL7 FHIR IPS,
    // ISO 27269) requires (allergies, medication summary, problems) in an InternationalPatientSummary, each section with its own
    // record list (P28-T3). A required section with no data shows the consumer's words for why (the IPS emptyReason), never an
    // empty space; a required section missing from `sections` would be added by the component, in words. Coded values (P28-T9): the display first; "Show codes" reveals each code, and the clinical content carries the
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
    import InternationalPatientSummary from "#lib/components/InternationalPatientSummary/InternationalPatientSummary.svelte";
    import InternationalPatientSummarySection from "#lib/components/InternationalPatientSummarySection/InternationalPatientSummarySection.svelte";
    import { formatQuantity } from "#lib/components/clinical-format.ts";

    const locale = "en-GB";
    // The document's own language, from Composition.language; it can differ from the interface's.
    const documentLanguage = "en";
    let showCodes = $state(false);
    // A section the service could not load is "unavailable" in words, with a way to try again (spec/lessons/openmrs item 3,
    // P33-T3). The failure on page load is not announced; the outcome of a retry, which the person asked for, is.
    let results: "unavailable" | "known" = $state("unavailable");
    let resultsStatus = $state("");
    function retryResults() {
        results = "known";
        resultsStatus = "Results loaded";
    }

    const sections = [
        { key: "allergies", heading: "Allergies and intolerances" },
        { key: "medications", heading: "Medication summary" },
        { key: "problems", heading: "Problems", status: "not-recorded" as const },
        { key: "results", heading: "Results" },
    ];
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

    <InternationalPatientSummary
        label="Patient summary"
        contentsLabel="Contents"
        omittedLabel="Section missing from document"
        requiredHeadings={{
            medications: "Medication summary",
            allergies: "Allergies and intolerances",
            problems: "Problems",
        }}
        {sections}
        lang={documentLanguage}
    >
        <InternationalPatientSummarySection
            section="allergies"
            heading="Allergies and intolerances"
        >
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
        </InternationalPatientSummarySection>

        <InternationalPatientSummarySection
            section="medications"
            heading="Medication summary"
        >
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
        </InternationalPatientSummarySection>

        <InternationalPatientSummarySection
            section="problems"
            heading="Problems"
            status="not-recorded"
            statusLabel="Not recorded"
            narrativeLabel="Narrative from the document"
            narrativeOpen
        >
            <ProblemRecordList
                status="not-recorded"
                statusLabel="No information about current problems is available"
            />
            {#snippet narrative()}
                <p>No problems were recorded at the last review.</p>
            {/snippet}
        </InternationalPatientSummarySection>

        <InternationalPatientSummarySection
            section="results"
            heading="Results"
            status={results}
            statusLabel={results === "unavailable" ? "Unavailable" : undefined}
        >
            {#if results === "unavailable"}
                <p>
                    The results service did not answer, so results cannot be shown. This does not
                    mean there are none.
                </p>
                <button
                    type="button"
                    class="button"
                    onclick={retryResults}>Try again</button
                >
            {:else}
                <p>Potassium 4.6 mmol/L, 3 November 2026.</p>
            {/if}
            <p
                class="patient-summary-results-status"
                role="status"
            >
                {resultsStatus}
            </p>
        </InternationalPatientSummarySection>

        {#snippet details()}
            <h2>About this document</h2>
            <dl>
                <dt>Date</dt>
                <dd><time datetime="2026-11-03">3 November 2026</time></dd>
                <dt>Author</dt>
                <dd>Example General Practice</dd>
                <dt>IPS version</dt>
                <dd>2.0.1</dd>
            </dl>
        {/snippet}
    </InternationalPatientSummary>
</main>
