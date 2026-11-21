<!--
  EMR example: a patient list, "Surgical Specialty", with the user's lists beside it and a toolbar above. Each status
  column is written in words as well as drawn: a mark never carries meaning alone. Built from the shared EmrShell.
  Invented patients.
-->
<script lang="ts">
    import EmrShell from "#lib/emr/EmrShell.svelte";
    import { DataTable, DataTableHead, DataTableBody, DataTableRow, DataTableTH, DataTableTD, ToolBar, ToolBarButton } from "@lilydesignsystem/svelte-headless";

    type Mark = "done" | "none" | "due" | "alert";
    const MARK: Record<Mark, { glyph: string; word: string }> = {
        done: { glyph: "✔", word: "Done" },
        none: { glyph: "–", word: "None" },
        due: { glyph: "◷", word: "Due" },
        alert: { glyph: "!", word: "Needs attention" },
    };
    const columns = [
        { id: "code", head: "Code status" },
        { id: "shift", head: "Shift requirements documented" },
        { id: "orders", head: "Unacknowledged orders" },
        { id: "meds", head: "Medications overdue or pending" },
        { id: "notes", head: "New notes" },
        { id: "result", head: "New result flag" },
        { id: "discharge", head: "Discharge medication reconciliation complete" },
    ] as const;

    const patients: { room: string; name: string; age: string; cls: string; private: string; problem: string; marks: Record<(typeof columns)[number]["id"], Mark> }[] = [
        { room: "4B-01", name: "Adeyemi, Tola", age: "71 y F", cls: "Observation", private: "No", problem: "Urinary tract infection due to ESBL organism", marks: { code: "done", shift: "done", orders: "none", meds: "none", notes: "done", result: "alert", discharge: "due" } },
        { room: "4B-02", name: "Brandt, Henrik", age: "64 y M", cls: "Observation", private: "No", problem: "Small bowel obstruction", marks: { code: "done", shift: "done", orders: "none", meds: "none", notes: "done", result: "alert", discharge: "due" } },
        { room: "4B-03", name: "Castellano, Rosa", age: "83 y F", cls: "Inpatient", private: "No", problem: "Dementia", marks: { code: "done", shift: "done", orders: "none", meds: "none", notes: "done", result: "alert", discharge: "due" } },
        { room: "4B-05", name: "Dube, Nomsa", age: "52 y F", cls: "Inpatient", private: "No", problem: "Pyelonephritis", marks: { code: "done", shift: "none", orders: "due", meds: "none", notes: "done", result: "alert", discharge: "due" } },
        { room: "4B-06", name: "Eriksen, Lars", age: "77 y M", cls: "Inpatient", private: "No", problem: "Sepsis due to Staphylococcus", marks: { code: "done", shift: "done", orders: "none", meds: "none", notes: "done", result: "alert", discharge: "due" } },
        { room: "4B-08", name: "Fontaine, Marie", age: "69 y F", cls: "Inpatient", private: "No", problem: "Fever", marks: { code: "done", shift: "done", orders: "none", meds: "alert", notes: "done", result: "alert", discharge: "due" } },
        { room: "4B-09", name: "Gupta, Anil", age: "58 y M", cls: "Inpatient", private: "No", problem: "Acute on chronic pancreatitis", marks: { code: "due", shift: "none", orders: "alert", meds: "none", notes: "done", result: "none", discharge: "due" } },
    ];

    let listName = $state("Surgical Specialty");
    const myLists = ["All My Patients"];
    const unitLists = ["My Login Dept"];
    const available = ["Community Care Unit", "Emergency Short Stay", "Pre-Op / Post-Op", "Surgical Admissions", "Paediatrics", "Surgical Specialty"];
    const actions = ["Edit List", "MAR", "Flowsheets", "Work List", "Arrived", "Sign In", "Sign Out", "Pain/Med Reassess", "Care Handoff", "Provider Notify/Critical Result", "Daily Cares", "More"];
</script>

<EmrShell
    pageTitle="Patient list: Surgical Specialty"
    chartTab="lists"
    subTab=""
>
    <ToolBar
        label="Patient list actions"
        class="pl-toolbar"
    >
        {#each actions as a (a)}
            <ToolBarButton disabled={["MAR", "Flowsheets", "Arrived", "Pain/Med Reassess", "Care Handoff", "Provider Notify/Critical Result", "Daily Cares"].includes(a)}>{a}</ToolBarButton>
        {/each}
    </ToolBar>

    <div class="pl-layout">
        <nav
            class="pl-lists"
            aria-label="Patient lists"
        >
            <h2>My Lists</h2>
            <h3>My Patients</h3>
            <ul>
                {#each myLists as l (l)}
                    <li><button type="button" class="pl-list" aria-pressed={listName === l} onclick={() => (listName = l)}>{l}</button></li>
                {/each}
            </ul>
            <h3>My Unit</h3>
            <ul>
                {#each unitLists as l (l)}
                    <li><button type="button" class="pl-list" aria-pressed={listName === l} onclick={() => (listName = l)}>{l}</button></li>
                {/each}
            </ul>
            <h2>Available Lists</h2>
            <ul>
                {#each available as l (l)}
                    <li><button type="button" class="pl-list" aria-pressed={listName === l} onclick={() => (listName = l)}>{l}</button></li>
                {/each}
            </ul>
        </nav>

        <section
            class="pl-main"
            aria-labelledby="pl-title"
        >
            <header class="pl-head">
                <h2 id="pl-title">{listName} <span class="pl-count">{patients.length} patients</span></h2>
                <p class="pl-refresh">
                    Refreshed <time datetime="PT3M">3 minutes ago</time>
                    <button type="button" class="pl-link">Refresh</button>
                </p>
                <form role="search" onsubmit={(e) => e.preventDefault()}>
                    <label><span class="emr-vh">Search this list</span><input class="text-input" type="search" placeholder="Search this list" /></label>
                </form>
            </header>

            <div class="emr-scroll">
                <DataTable
                    label={`Patients on the ${listName} list`}
                    class="emr-table pl-table"
                >
                    <DataTableHead>
                        <DataTableRow>
                            <DataTableTH>Room/bed</DataTableTH>
                            <DataTableTH>Patient name</DataTableTH>
                            <DataTableTH>Age/gender</DataTableTH>
                            <DataTableTH>Patient class</DataTableTH>
                            <DataTableTH>Private encounter</DataTableTH>
                            <DataTableTH>Problem</DataTableTH>
                            {#each columns as c (c.id)}<DataTableTH>{c.head}</DataTableTH>{/each}
                        </DataTableRow>
                    </DataTableHead>
                    <DataTableBody>
                        {#each patients as p (p.room)}
                            <DataTableRow>
                                <DataTableTD>{p.room}</DataTableTD>
                                <DataTableTD><a href="#emr-main">{p.name}</a></DataTableTD>
                                <DataTableTD>{p.age}</DataTableTD>
                                <DataTableTD>{p.cls}</DataTableTD>
                                <DataTableTD>{p.private}</DataTableTD>
                                <DataTableTD>{p.problem}</DataTableTD>
                                {#each columns as c (c.id)}
                                    <DataTableTD>
                                        <span class="pl-mark" data-mark={p.marks[c.id]}>
                                            <span aria-hidden="true">{MARK[p.marks[c.id]].glyph}</span>
                                            <span class="emr-vh">{MARK[p.marks[c.id]].word}</span>
                                        </span>
                                    </DataTableTD>
                                {/each}
                            </DataTableRow>
                        {/each}
                    </DataTableBody>
                </DataTable>
            </div>
            <p class="pl-legend">
                Marks: <span aria-hidden="true">✔</span> done · <span aria-hidden="true">–</span> none · <span aria-hidden="true">◷</span> due ·
                <span aria-hidden="true">!</span> needs attention. Each mark is also written for a screen reader.
            </p>
        </section>
    </div>
</EmrShell>

<style>
    :global(.pl-toolbar) {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem 0.5rem;
        margin-block-end: 0.5rem;
    }
    .pl-layout {
        display: grid;
        grid-template-columns: 13rem minmax(0, 1fr);
        gap: 0.75rem;
        align-items: start;
    }
    .pl-lists {
        background: var(--color-base-100, Canvas);
        border: 1px solid var(--color-base-300, currentColor);
        padding: 0.5rem;
    }
    .pl-lists h2 {
        margin: 0.25rem 0;
        font-size: 0.9375rem;
        color: var(--color-primary);
    }
    .pl-lists h3 {
        margin: 0.5rem 0 0.125rem;
        font-size: 0.8125rem;
    }
    .pl-lists ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    .pl-list {
        inline-size: 100%;
        padding: 0.25rem 0.5rem;
        border: 0;
        background: none;
        color: inherit;
        text-align: start;
        cursor: pointer;
        font: inherit;
    }
    .pl-list[aria-pressed="true"] {
        background: color-mix(in oklab, var(--color-primary) 18%, var(--color-base-100, Canvas));
        font-weight: 600;
    }
    .pl-main {
        min-inline-size: 0;
        background: var(--color-base-100, Canvas);
        border: 1px solid var(--color-base-300, currentColor);
        padding: 0.5rem;
    }
    .pl-head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem 1rem;
    }
    .pl-head h2 {
        margin: 0;
        font-size: 1rem;
        color: var(--color-primary);
    }
    .pl-count,
    .pl-refresh {
        font-size: 0.75rem;
        font-weight: 400;
    }
    .pl-refresh {
        margin: 0;
    }
    .pl-link {
        padding: 0;
        border: 0;
        background: none;
        color: var(--color-secondary);
        text-decoration: underline;
        cursor: pointer;
        font: inherit;
    }
    /* Whole words in every cell (the theme's anywhere would split them); the table scrolls in its own region instead. */
    :global(.pl-table td) {
        overflow-wrap: break-word;
        word-break: normal;
        min-inline-size: 6rem;
    }
    :global(.pl-table th) {
        white-space: normal;
        min-inline-size: 5rem;
    }
    .pl-mark {
        position: relative;
        display: inline-grid;
        place-items: center;
        min-inline-size: 1.25rem;
        font-weight: 700;
    }
    .pl-mark[data-mark="done"] {
        color: var(--color-success);
    }
    .pl-mark[data-mark="due"] {
        color: var(--color-warning-content);
    }
    .pl-mark[data-mark="alert"] {
        color: var(--lily-error-text, var(--color-error));
    }
    .pl-legend {
        margin: 0.5rem 0 0;
        font-size: 0.75rem;
    }
    @media (max-width: 48rem) {
        .pl-layout {
            grid-template-columns: minmax(0, 1fr);
        }
    }
</style>
