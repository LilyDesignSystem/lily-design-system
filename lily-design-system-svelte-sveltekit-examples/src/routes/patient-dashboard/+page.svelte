<script lang="ts">
    // Patient dashboard (tasks.md P30-T5, spec/lessons/openemr item 2; P33-T4, spec/lessons/openmrs item 4): the patient
    // banner with its flags as words, then summary cards for problems, allergies, medicines, immunizations, reminders and
    // appointments. Each card is a never-blank record list with a provenance line (who last reviewed it, when). "Add an
    // allergy" opens a workspace panel beside the chart, not a modal: Close returns focus to the opener, Minimise keeps what
    // was typed, and closing with unsaved changes asks first. e2e/patient-dashboard.spec.ts checks it.
    import { tick } from "svelte";
    import Header from "#lib/components/Header/Header.svelte";
    import BackLink from "#lib/components/BackLink/BackLink.svelte";
    import Button from "#lib/components/Button/Button.svelte";
    import AlertDialog from "#lib/components/AlertDialog/AlertDialog.svelte";
    import TagGroup from "#lib/components/TagGroup/TagGroup.svelte";
    import Tag from "#lib/components/Tag/Tag.svelte";
    import RecordList from "#lib/components/RecordList/RecordList.svelte";
    import RecordListItem from "#lib/components/RecordListItem/RecordListItem.svelte";
    import AllergyRecordList from "#lib/components/AllergyRecordList/AllergyRecordList.svelte";
    import AllergyRecordListItem from "#lib/components/AllergyRecordListItem/AllergyRecordListItem.svelte";
    import ProblemRecordList from "#lib/components/ProblemRecordList/ProblemRecordList.svelte";
    import ProblemRecordListItem from "#lib/components/ProblemRecordListItem/ProblemRecordListItem.svelte";
    import MedicationRecordList from "#lib/components/MedicationRecordList/MedicationRecordList.svelte";
    import MedicationRecordListItem from "#lib/components/MedicationRecordListItem/MedicationRecordListItem.svelte";
    import ImmunizationRecordList from "#lib/components/ImmunizationRecordList/ImmunizationRecordList.svelte";
    import RecordProvenanceView from "#lib/components/RecordProvenanceView/RecordProvenanceView.svelte";
    import Sparkline from "#lib/components/Sparkline/Sparkline.svelte";
    import HorizontalScroller from "#lib/components/HorizontalScroller/HorizontalScroller.svelte";
    import Table from "#lib/components/Table/Table.svelte";
    import TableHead from "#lib/components/TableHead/TableHead.svelte";
    import TableBody from "#lib/components/TableBody/TableBody.svelte";
    import TableRow from "#lib/components/TableRow/TableRow.svelte";
    import TableTH from "#lib/components/TableTH/TableTH.svelte";
    import TableTD from "#lib/components/TableTD/TableTD.svelte";

    // Vital signs over the last five readings (tasks.md P40-T7, spec/lessons/ehr-products item 10): the last, lowest and
    // highest value of each sign in words, and a sparkline whose label gives the same numbers, so the line is never the only
    // way to read the trend. The readings and their units are the application's.
    const VITALS = [
        { sign: "Pulse", unit: "beats a minute", readings: [72, 76, 81, 88, 94] },
        { sign: "Systolic blood pressure", unit: "mmHg", readings: [128, 131, 126, 122, 118] },
        { sign: "Temperature", unit: "°C", readings: [36.8, 37.1, 37.4, 37.9, 38.2] },
    ];
    const points = (values: number[]) => {
        const low = Math.min(...values);
        const span = Math.max(...values) - low || 1;
        return values.map((v, i) => `${i * 25},${20 - ((v - low) / span) * 20}`).join(" ");
    };

    type Allergy = { substance: string; reaction: string };
    let allergies: Allergy[] = $state([{ substance: "Penicillin", reaction: "Anaphylaxis" }]);

    // The workspace panel: closed, open, or minimised with its draft kept.
    let workspace: "closed" | "open" | "minimised" = $state("closed");
    let draft = $state({ substance: "", reaction: "" });
    let confirmOpen = $state(false);
    let status = $state("");
    let opener: HTMLElement | null = null;
    let firstField: HTMLInputElement | undefined = $state();
    const unsaved = $derived(draft.substance.trim() !== "" || draft.reaction.trim() !== "");

    async function openWorkspace(event: MouseEvent) {
        opener = event.currentTarget as HTMLElement;
        workspace = "open";
        await tick();
        firstField?.focus();
    }
    async function finish(message: string) {
        workspace = "closed";
        draft = { substance: "", reaction: "" };
        status = message;
        await tick();
        opener?.focus();
    }
    function close() {
        if (unsaved) confirmOpen = true;
        else void finish("");
    }
    async function minimise() {
        workspace = "minimised";
        await tick();
        document.getElementById("restore-workspace")?.focus();
    }
    async function restore() {
        workspace = "open";
        await tick();
        firstField?.focus();
    }
    function save(event: SubmitEvent) {
        event.preventDefault();
        if (!draft.substance.trim()) return;
        allergies = [
            ...allergies,
            { substance: draft.substance.trim(), reaction: draft.reaction.trim() },
        ];
        void finish(`Allergy to ${draft.substance.trim()} added`);
    }
</script>

<svelte:head>
    <title>Patient dashboard — Lily Design System</title>
</svelte:head>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Patient dashboard</h1>
        <p class="session-location">Location: Riverside Health Centre, Clinic 3</p>
    </div>
</Header>

<main class="page-wrapper patient-dashboard">
    <BackLink href="/">Back to examples</BackLink>

    <section
        class="patient-banner"
        aria-label="Patient details: JONES, Mary"
    >
        <dl>
            <div>
                <dt>Name</dt>
                <dd>JONES, Mary</dd>
            </div>
            <div>
                <dt>Born</dt>
                <dd><time datetime="1958-03-04">4 Mar 1958</time></dd>
            </div>
            <div>
                <dt>NHS No.</dt>
                <dd>943 476 5919</dd>
            </div>
            <div>
                <dt>Visit</dt>
                <dd>Active visit: outpatient, started 09:10</dd>
            </div>
            <div>
                <dt>Flags</dt>
                <dd>
                    <TagGroup label="Patient flags">
                        <Tag label="Needs an interpreter: Polish">Needs an interpreter: Polish</Tag>
                        <Tag label="Falls risk">Falls risk</Tag>
                    </TagGroup>
                </dd>
            </div>
        </dl>
    </section>

    <p
        class="patient-dashboard-status"
        role="status"
    >
        {status}
    </p>

    <div class="patient-dashboard-cards">
        <section aria-labelledby="problems-heading">
            <h2 id="problems-heading">Problems</h2>
            <ProblemRecordList
                status="known"
                statusLabel="Problems"
            >
                <ProblemRecordListItem
                    condition="Type 2 diabetes"
                    clinicalStatus="active"
                    clinicalStatusLabel="Active"
                    onset="2019"
                    onsetLabel="Since 2019"
                />
                <ProblemRecordListItem
                    subjectLabel="Mother"
                    condition="Breast cancer"
                    onset="1998"
                    onsetLabel="Diagnosed 1998"
                />
            </ProblemRecordList>
            <RecordProvenanceView
                attestation="signed"
                attestationLabel="Signed"
                authorLabel="Reviewed by Dr A Patel"
                recorded="2026-11-03"
                recordedLabel="3 Nov 2026"
            />
        </section>

        <section aria-labelledby="allergies-heading">
            <h2 id="allergies-heading">Allergies</h2>
            <AllergyRecordList
                status={allergies.length ? "known" : "none-known"}
                statusLabel={allergies.length ? "Allergies" : "No known allergies"}
            >
                {#each allergies as allergy (allergy.substance)}
                    <AllergyRecordListItem
                        substance={allergy.substance}
                        reaction={allergy.reaction || undefined}
                    />
                {/each}
            </AllergyRecordList>
            <Button
                aria-controls="workspace"
                aria-expanded={workspace === "open"}
                onclick={openWorkspace}
                disabled={workspace === "minimised"}>Add an allergy</Button
            >
        </section>

        <section aria-labelledby="medicines-heading">
            <h2 id="medicines-heading">Medicines</h2>
            <MedicationRecordList
                status="known"
                statusLabel="Medicines"
            >
                <MedicationRecordListItem
                    status="active"
                    statusLabel="Active"
                >
                    Metformin 500 mg tablets, one twice a day
                </MedicationRecordListItem>
            </MedicationRecordList>
            <RecordProvenanceView
                attestation="pending"
                attestationLabel="Awaiting a pharmacist's review"
                authorLabel="Added by Nurse B Okafor"
            />
        </section>

        <section aria-labelledby="immunizations-heading">
            <h2 id="immunizations-heading">Immunizations</h2>
            <ImmunizationRecordList
                status="not-recorded"
                statusLabel="No immunizations have been recorded"
            />
        </section>

        <section aria-labelledby="vitals-heading">
            <h2 id="vitals-heading">Vital signs</h2>
            <p>The last five readings, oldest to newest, from 06:00 to 10:00 today.</p>
            <HorizontalScroller label="Vital signs trend">
                <Table label="Vital signs trend">
                    <TableHead>
                        <TableRow>
                            <TableTH scope="col">Sign</TableTH>
                            <TableTH scope="col">Last</TableTH>
                            <TableTH scope="col">Lowest</TableTH>
                            <TableTH scope="col">Highest</TableTH>
                            <TableTH scope="col">Trend</TableTH>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {#each VITALS as v (v.sign)}
                            <TableRow>
                                <TableTH scope="row">{v.sign}</TableTH>
                                <TableTD>{v.readings.at(-1)} {v.unit}</TableTD>
                                <TableTD>{Math.min(...v.readings)} {v.unit}</TableTD>
                                <TableTD>{Math.max(...v.readings)} {v.unit}</TableTD>
                                <TableTD>
                                    <Sparkline
                                        label={`${v.sign}: ${v.readings.join(", ")} ${v.unit}`}
                                        pointCount={v.readings.length}
                                    >
                                        <svg
                                            viewBox="0 0 100 20"
                                            width="100"
                                            height="20"
                                            aria-hidden="true"
                                        >
                                            <polyline
                                                points={points(v.readings)}
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="1.5"
                                            />
                                        </svg>
                                    </Sparkline>
                                </TableTD>
                            </TableRow>
                        {/each}
                    </TableBody>
                </Table>
            </HorizontalScroller>
        </section>

        <section aria-labelledby="reminders-heading">
            <h2 id="reminders-heading">Reminders</h2>
            <RecordList
                status="known"
                statusLabel="Reminders"
            >
                <RecordListItem
                    data-due="overdue"
                    status="overdue"
                    statusLabel="Overdue"
                    updated="2026-10-01"
                    updatedLabel="Due 1 Oct 2026"
                >
                    Diabetic eye screening
                </RecordListItem>
                <RecordListItem
                    data-due="soon"
                    status="soon"
                    statusLabel="Due soon"
                    updated="2026-12-01"
                    updatedLabel="Due 1 Dec 2026"
                >
                    Annual diabetes review
                </RecordListItem>
            </RecordList>
        </section>

        <section aria-labelledby="appointments-heading">
            <h2 id="appointments-heading">Appointments</h2>
            <RecordList
                status="known"
                statusLabel="Upcoming appointments"
            >
                <RecordListItem>
                    <time datetime="2026-11-24T10:30">24 Nov 2026, 10:30</time>: practice nurse,
                    Riverside Health Centre
                </RecordListItem>
            </RecordList>
        </section>
    </div>

    {#if workspace === "minimised"}
        <Button
            id="restore-workspace"
            onclick={restore}>Return to: Add an allergy (not saved)</Button
        >
    {/if}

    <aside
        id="workspace"
        class="workspace-panel"
        aria-labelledby="workspace-title"
        hidden={workspace !== "open"}
    >
        <h2 id="workspace-title">Add an allergy</h2>
        <form onsubmit={save}>
            <label for="allergy-substance">Substance</label>
            <input
                id="allergy-substance"
                bind:this={firstField}
                bind:value={draft.substance}
                required
            />
            <label for="allergy-reaction">Reaction</label>
            <input
                id="allergy-reaction"
                bind:value={draft.reaction}
            />
            <Button type="submit">Save allergy</Button>
            <Button onclick={minimise}>Minimise</Button>
            <Button onclick={close}>Close</Button>
        </form>
    </aside>

    <AlertDialog
        bind:open={confirmOpen}
        title="Discard this allergy?"
        description="What you typed has not been saved."
    >
        <Button
            onclick={() => {
                confirmOpen = false;
                void finish("Allergy not saved");
            }}>Discard</Button
        >
        <Button
            onclick={async () => {
                confirmOpen = false;
                await tick();
                firstField?.focus();
            }}>Keep editing</Button
        >
    </AlertDialog>
</main>
