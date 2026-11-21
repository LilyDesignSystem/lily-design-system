<!--
  EMR example: the Summary "Overview" scrolled to its work list, vital signs chart, treatment team and care plan.
  The chart is a LineChart whose graphic is inline SVG; "View table" shows the same readings as a table, so the data
  is never only a picture. Built from the shared EmrShell. Invented data.
-->
<script lang="ts">
    import EmrShell from "#lib/emr/EmrShell.svelte";
    import { LineChart, DataTable, DataTableHead, DataTableBody, DataTableRow, DataTableTH, DataTableTD } from "@lilydesignsystem/svelte-headless";

    const times = ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
    // Each series has its own dash pattern, and the latest values are written in the legend, so nothing rests on colour.
    const series = [
        { id: "temp", label: "Temp (°F)", values: [98.6, 99.1, 98.4, 99.5, 100.2, 99.0, 98.7, 98.9], dash: "" },
        { id: "hr", label: "Heart rate (/min)", values: [78, 82, 88, 95, 104, 92, 85, 80], dash: "6 3" },
        { id: "resp", label: "Resp (/min)", values: [16, 16, 18, 20, 22, 19, 17, 16], dash: "2 3" },
        { id: "spo2", label: "SpO₂ (%)", values: [97, 96, 96, 95, 94, 96, 97, 97], dash: "10 3 2 3" },
    ];
    const W = 360;
    const H = 170;
    const PAD = 24;
    // Each series is scaled to its own range so all four are visible; the table has the real numbers.
    function scaled(values: number[]): string {
        const min = Math.min(...values);
        const max = Math.max(...values);
        return values
            .map((v, i) => {
                const x = PAD + (i * (W - PAD * 2)) / (values.length - 1);
                const y = H - PAD - ((v - min) / (max - min || 1)) * (H - PAD * 2);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(" ");
    }
    let showTable = $state(false);

    const tasks = [
        { time: "1500", task: "Re-check PRN medication (type, reason, follow-up/score required)", priority: "Timed", group: "1500" },
        { time: "PRN", task: "Re-check peripheral IV site and document, based on the frequency in the hospital policy", priority: "Routine", group: "PRN" },
    ];
    const team = [
        { name: "Okoro, Samuel, MD", rel: "Attending", spec: "—", phone: "555-0100" },
        { name: "Bell, Jessica, RN", rel: "Registered nurse", spec: "—", phone: "" },
        { name: "Cole, Terrie, PCT", rel: "Patient care technician", spec: "—", phone: "" },
        { name: "Dean, Weldon, MD", rel: "Resident", spec: "Family medicine", phone: "555-0123" },
    ];
</script>

<EmrShell
    pageTitle="Patient summary overview: vital signs"
    chartTab="summary"
    subTab="overview"
>
    <section
        class="emr-card vs-wide"
        aria-labelledby="vs-tasks"
    >
        <h2 id="vs-tasks"><span class="emr-pill">Work List Tasks</span></h2>
        <p class="vs-range"><time datetime="2020-12-06T07:01/2020-12-06T19:01">12/06/20 0701 – 1901</time></p>
        <div class="emr-scroll">
            <DataTable
                label="Work list tasks"
                class="emr-table"
            >
                <DataTableHead>
                    <DataTableRow>
                        <DataTableTH>Time</DataTableTH>
                        <DataTableTH>Task</DataTableTH>
                        <DataTableTH>Priority</DataTableTH>
                    </DataTableRow>
                </DataTableHead>
                <DataTableBody>
                    {#each tasks as t (t.task)}
                        <DataTableRow>
                            <DataTableTD>{t.time}</DataTableTD>
                            <DataTableTD><a href="#emr-main">{t.task}</a></DataTableTD>
                            <DataTableTD>{t.priority}</DataTableTD>
                        </DataTableRow>
                    {/each}
                </DataTableBody>
            </DataTable>
        </div>
    </section>

    <div class="emr-grid vs-three">
        <section
            class="emr-card"
            aria-labelledby="vs-vitals"
        >
            <h2 id="vs-vitals"><span class="emr-pill">Vital Signs</span></h2>
            <p class="vs-actions">
                <button
                    type="button"
                    class="vs-link"
                    aria-expanded={showTable}
                    aria-controls="vs-table"
                    onclick={() => (showTable = !showTable)}>{showTable ? "Hide table" : "View table"}</button
                >
                <a href="#emr-main">Report</a>
            </p>
            <LineChart
                label="Vital signs for the last eight readings, 06:00 to 20:00. Temperature peaks at 100.2 °F at 14:00; heart rate peaks at 104 per minute at 14:00; SpO₂ is lowest at 94 percent at 14:00."
                class="vs-chart"
            >
                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    focusable="false"
                    aria-hidden="true"
                >
                    <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="currentColor" stroke-opacity="0.4" />
                    {#each series as s, si (s.id)}
                        <polyline
                            points={scaled(s.values)}
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.6"
                            stroke-dasharray={s.dash}
                            opacity={0.55 + si * 0.15}
                        />
                    {/each}
                </svg>
            </LineChart>
            <ul class="vs-legend">
                {#each series as s (s.id)}
                    <li>{s.label}: <strong>{s.values[s.values.length - 1]}</strong> at {times[times.length - 1]}</li>
                {/each}
            </ul>
            {#if showTable}
                <div
                    id="vs-table"
                    class="emr-scroll"
                >
                    <DataTable
                        label="Vital signs readings"
                        class="emr-table"
                    >
                        <DataTableHead>
                            <DataTableRow>
                                <DataTableTH>Time</DataTableTH>
                                {#each series as s (s.id)}<DataTableTH>{s.label}</DataTableTH>{/each}
                            </DataTableRow>
                        </DataTableHead>
                        <DataTableBody>
                            {#each times as t, i (t)}
                                <DataTableRow>
                                    <DataTableTD>{t}</DataTableTD>
                                    {#each series as s (s.id)}<DataTableTD>{s.values[i]}</DataTableTD>{/each}
                                </DataTableRow>
                            {/each}
                        </DataTableBody>
                    </DataTable>
                </div>
            {/if}
        </section>

        <section
            class="emr-card"
            aria-labelledby="vs-team"
        >
            <h2 id="vs-team"><span class="emr-pill">Treatment Team</span></h2>
            <div class="emr-scroll">
                <DataTable
                    label="Treatment team"
                    class="emr-table"
                >
                    <DataTableHead>
                        <DataTableRow>
                            <DataTableTH>Provider</DataTableTH>
                            <DataTableTH>Relationship</DataTableTH>
                            <DataTableTH>Specialty</DataTableTH>
                            <DataTableTH>Contact</DataTableTH>
                        </DataTableRow>
                    </DataTableHead>
                    <DataTableBody>
                        {#each team as m (m.name)}
                            <DataTableRow>
                                <DataTableTD>{m.name}</DataTableTD>
                                <DataTableTD>{m.rel}</DataTableTD>
                                <DataTableTD>{m.spec}</DataTableTD>
                                <DataTableTD>{m.phone || "No number recorded"}</DataTableTD>
                            </DataTableRow>
                        {/each}
                    </DataTableBody>
                </DataTable>
            </div>
        </section>

        <section
            class="emr-card"
            data-tone="notes"
            aria-labelledby="vs-plan"
        >
            <h2 id="vs-plan"><span class="emr-pill">Care Plan Problems/Goals</span></h2>
            <p class="vs-actions"><a href="#emr-main">Show details</a> <a href="#emr-main">Report</a></p>
            <h3 class="vs-h3">Discharge planning</h3>
            <p>Patient or caregiver is able to verbalise the discharge instructions. <em>Status: in progress</em></p>
            <h3 class="vs-h3">Pain – acute</h3>
            <p>Patient or caregiver states a pain score at or below their stated pain goal. <em>Status: in progress</em></p>
        </section>
    </div>
</EmrShell>

<style>
    .vs-range,
    .vs-actions {
        margin: 0 0 0.5rem;
        font-size: 0.75rem;
    }
    .vs-actions {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
    }
    .vs-link {
        padding: 0;
        border: 0;
        background: none;
        color: var(--color-secondary);
        text-decoration: underline;
        cursor: pointer;
        font: inherit;
    }
    .vs-three {
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
    }
    .vs-legend {
        margin: 0.5rem 0 0;
        padding: 0;
        list-style: none;
        font-size: 0.75rem;
    }
    .vs-h3 {
        margin: 0.5rem 0 0.125rem;
        font-size: 0.8125rem;
    }
    :global(.vs-chart svg) {
        inline-size: 100%;
        block-size: auto;
        color: var(--color-primary);
    }
</style>
