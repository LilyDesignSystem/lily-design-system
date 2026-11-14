<script lang="ts">
    // Observations chart (spec/healthcare-ui item 9, P27-T9): a line chart of a vital sign with its data table as a sibling
    // (the chart pattern), the latest value as an ObservationView with its flag in words, and the early warning score shown,
    // not computed. e2e/healthcare-pages.spec.ts checks it.
    import Header from "#lib/components/Header/Header.svelte";
    import BackLink from "#lib/components/BackLink/BackLink.svelte";
    import LineChart from "#lib/components/LineChart/LineChart.svelte";
    import ObservationView from "#lib/components/ObservationView/ObservationView.svelte";
    import EarlyWarningScoreView from "#lib/components/EarlyWarningScoreView/EarlyWarningScoreView.svelte";

    const readings = [
        { time: "06:00", rate: 18 },
        { time: "10:00", rate: 20 },
        { time: "14:00", rate: 23 },
        { time: "18:00", rate: 26 },
    ];
    const points = readings.map((r, i) => `${20 + i * 60},${100 - (r.rate - 10) * 4}`).join(" ");
</script>

<svelte:head>
    <title>Observations chart — Lily Design System</title>
</svelte:head>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Observations chart</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <p>
        Respiration rate over today, with the latest reading and the early warning score your own
        validated code computed.
    </p>

    <p>
        Latest:
        <ObservationView
            label="Respiration rate"
            value="26"
            unit="breaths/min"
            interpretation="H"
            flagLabel="High"
            range="12–20"
        />
    </p>
    <p>
        <EarlyWarningScoreView
            system="NEWS2"
            score={5}
            band="medium"
            bandLabel="Medium"
            escalation="Urgent ward-based response"
        />
    </p>

    <LineChart label="Respiration rate today, rising from 18 to 26 breaths per minute">
        <svg
            viewBox="0 0 220 110"
            width="100%"
            aria-hidden="true"
        >
            <polyline
                {points}
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            />
        </svg>
        {#snippet dataTable()}
            <table>
                <caption>Respiration rate, breaths per minute</caption>
                <thead><tr><th scope="col">Time</th><th scope="col">Rate</th></tr></thead>
                <tbody>
                    {#each readings as r (r.time)}<tr
                            ><th scope="row"><time datetime={r.time}>{r.time}</time></th><td
                                >{r.rate}</td
                            ></tr
                        >{/each}
                </tbody>
            </table>
        {/snippet}
    </LineChart>
</main>
