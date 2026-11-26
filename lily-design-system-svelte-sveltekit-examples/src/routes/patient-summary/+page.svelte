<script lang="ts">
    // International Patient Summary (spec/healthcare-ui items 9 and 21, P27-T9): the three sections the IPS (HL7 FHIR IPS,
    // ISO 27269) requires (allergies, medication summary, problems) in an InternationalPatientSummary, each section with its own
    // record list (P28-T3). A required section with no data shows the consumer's words for why (the IPS emptyReason), never an
    // empty space; a required section missing from `sections` would be added by the component, in words. Coded values (P28-T9): the display first; "Show codes" reveals each code, and the clinical content carries the
    // document's language. The patient banner is the summary's own banner (P50-T8): two patients with similar names, and
    // everything on the page is one patient's. A switch drops a results request that is still running, so a late answer is never
    // shown under another patient. e2e/healthcare-pages.spec.ts checks it.
    import { onMount, untrack } from "svelte";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { DEMO_PATIENTS, demoPatient, demoPatientName } from "#lib/demo-patients.ts";
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
    import AgeView from "#lib/components/AgeView/AgeView.svelte";
    import EnglandNationalHealthServiceNumberView from "#lib/components/EnglandNationalHealthServiceNumberView/EnglandNationalHealthServiceNumberView.svelte";
    import {
        ageParts,
        formatPartialDate,
        formatQuantity,
    } from "#lib/components/clinical-format.ts";

    const locale = "en-GB";
    // The document's own language, from Composition.language; it can differ from the interface's.
    const documentLanguage = "en";
    let showCodes = $state(false);
    // Invented patients. The names are alike on purpose: the birth date and the number tell them apart.
    const today = "2026-11-25";
    // The patients are the find-a-patient page's (P53-T1): a search result links here with its opaque key, and the key is
    // resolved before anything about a patient is shown. No key opens the first patient, as a demonstration; a key that names
    // no one shows a way back to the search and no patient at all, never somebody else's record.
    const patients = DEMO_PATIENTS.map((p) => ({ ...p, id: p.key, name: demoPatientName(p) }));
    const requestedKey = $derived(page.url.searchParams.get("patient"));
    // An address from before the keys (`?nhs=…`) is treated as unknown too, never as the bare demo default.
    const unknownKey = $derived(
        page.url.searchParams.has("nhs") ||
            (requestedKey !== null && demoPatient(requestedKey) === undefined),
    );
    type Patient = (typeof patients)[number];
    let patientId = $state(
        demoPatient(page.url.searchParams.get("patient"))?.key ?? patients[0].id,
    );
    const patient: Patient = $derived(patients.find((p) => p.id === patientId) ?? patients[0]);
    let switched = $state("");

    // A press before the page's script is ready would be lost without a word, so the controls wait for it.
    let ready = $state(false);
    onMount(() => (ready = true));

    const ageWords = (born: string) =>
        ageParts(born, today)
            .map((part) => `${part.value} ${part.unit}`)
            .join(" ");

    // A section the service could not load is "unavailable" in words, with a way to try again (spec/lessons/openmrs item 3,
    // P33-T3). The failure on page load is not announced; the outcome of a retry, which the person asked for, is.
    let results: "unavailable" | "known" = $state("unavailable");
    let resultsFor = $state("");
    let resultsText = $state("");
    let resultsStatus = $state("");
    let request: ReturnType<typeof setTimeout> | undefined;

    function retryResults() {
        // The answer belongs to the patient it was asked for, whoever is on screen when it comes.
        const asked = patient;
        resultsStatus = `Loading results for ${asked.name}`;
        clearTimeout(request);
        request = setTimeout(() => {
            if (asked.id !== patientId) return;
            results = "known";
            resultsFor = asked.id;
            resultsText = asked.result;
            resultsStatus = "Results loaded";
        }, 600);
    }

    function switchPatient() {
        clearTimeout(request);
        results = "unavailable";
        resultsFor = "";
        resultsText = "";
        resultsStatus = "";
        switched = `Now showing ${patient.name}, born ${formatPartialDate(patient.born, locale)}`;
        // The address follows the switch, so a reload or a shared link opens the patient on screen, not the one first opened.
        const url = new URL(page.url.href);
        url.searchParams.set("patient", patientId);
        goto(url, { replace: true, shallow: true });
    }

    // A new key in the address (a link, Back or Forward to another patient's page) opens that patient, with the same reset.
    $effect(() => {
        const key = requestedKey;
        untrack(() => {
            const wanted = demoPatient(key);
            if (!wanted || wanted.key === patientId) return;
            clearTimeout(request);
            patientId = wanted.key;
            results = "unavailable";
            resultsFor = "";
            resultsText = "";
            resultsStatus = "";
        });
    });

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

    {#if unknownKey}
        <h2>No patient record</h2>
        <p class="patient-summary-not-found">
            This link does not name a patient. <a href="/find-patient">Find a patient</a> and choose them
            from the results.
        </p>
    {:else}
        <p class="patient-summary-switch">
            <label for="patient-summary-patient">Patient</label>
            <select
                id="patient-summary-patient"
                class="select"
                bind:value={patientId}
                disabled={!ready}
                onchange={switchPatient}
            >
                {#each patients as p (p.id)}
                    <option value={p.id}>{p.name}, born {formatPartialDate(p.born, locale)}</option>
                {/each}
            </select>
        </p>
        <p
            class="patient-summary-switched"
            role="status"
        >
            {switched}
        </p>

        <ToggleButton
            label="Show codes"
            bind:pressed={showCodes}>Show codes</ToggleButton
        >

        {#key patient.id}
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
                {#snippet banner()}
                    <section
                        class="patient-banner"
                        aria-label={`Patient details: ${patient.name}`}
                    >
                        <dl>
                            <div>
                                <dt>Name</dt>
                                <dd>{patient.name}</dd>
                            </div>
                            <div>
                                <dt>Born</dt>
                                <dd>
                                    <time datetime={patient.born}
                                        >{formatPartialDate(patient.born, locale)}</time
                                    >
                                    (<AgeView value={ageWords(patient.born)} />)
                                </dd>
                            </div>
                            <div>
                                <dt>NHS No.</dt>
                                <dd>
                                    <EnglandNationalHealthServiceNumberView
                                        value={patient.number}
                                    />
                                </dd>
                            </div>
                        </dl>
                    </section>
                {/snippet}
                <InternationalPatientSummarySection
                    section="allergies"
                    heading="Allergies and intolerances"
                    status={patient.allergies.length ? "known" : "none-known"}
                    statusLabel={patient.allergies.length ? undefined : "No known allergies"}
                    statusPlacement="list"
                >
                    <AllergyRecordList
                        status={patient.allergies.length ? "known" : "none-known"}
                        statusLabel={patient.allergies.length
                            ? "Known allergies"
                            : "No known allergies"}
                    >
                        {#each patient.allergies as allergy (allergy.substance)}
                            <AllergyRecordListItem
                                substance={allergy.substance}
                                reaction={allergy.reaction}
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
                                    hidden={!showCodes}><code>{allergy.code}</code></span
                                >
                            </AllergyRecordListItem>
                        {/each}
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
                        {#each patient.medicines as medicine (medicine.code)}
                            <MedicationRecordListItem
                                status="active"
                                statusLabel="Active"
                            >
                                <MedicationView
                                    nameSegments={medicine.segments}
                                    strength={formatQuantity(medicine.strength, "mg", locale)}
                                    form="tablet"
                                    route="oral"
                                    frequency={medicine.frequency}
                                />
                                <span
                                    class="patient-summary-code"
                                    hidden={!showCodes}><code>{medicine.code}</code></span
                                >
                            </MedicationRecordListItem>
                        {/each}
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
                            The results service did not answer, so results cannot be shown. This
                            does not mean there are none.
                        </p>
                        <button
                            type="button"
                            class="button"
                            disabled={!ready}
                            onclick={retryResults}>Try again</button
                        >
                    {:else}
                        <p data-results-for={resultsFor}>{resultsText}</p>
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
        {/key}
    {/if}
</main>
