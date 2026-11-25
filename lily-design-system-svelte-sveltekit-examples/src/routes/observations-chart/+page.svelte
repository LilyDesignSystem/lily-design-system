<script lang="ts">
    // Observations chart (spec/healthcare-ui item 9, P27-T9): a line chart of a vital sign with its data table as a sibling
    // (the chart pattern), the latest value as an ObservationView with its flag in words, and the early warning score shown,
    // not computed. e2e/healthcare-pages.spec.ts checks it.
    import Header from "#lib/components/Header/Header.svelte";
    import BackLink from "#lib/components/BackLink/BackLink.svelte";
    import Button from "#lib/components/Button/Button.svelte";
    import LineChart from "#lib/components/LineChart/LineChart.svelte";
    import ObservationView from "#lib/components/ObservationView/ObservationView.svelte";
    import EarlyWarningScoreView from "#lib/components/EarlyWarningScoreView/EarlyWarningScoreView.svelte";

    // One list, as the host's own validated code supplies it: each reading with its interpretation, and the score for it. The
    // headline, the chart, its description and the table are all read from it, so they cannot disagree.
    type Reading = {
        time: string;
        rate: number;
        code: string;
        flag?: string;
        score: number;
        band: string;
        bandWords: string;
        escalation: string;
    };
    const all: Reading[] = [
        {
            time: "06:00",
            rate: 18,
            code: "N",
            score: 0,
            band: "low",
            bandWords: "Low",
            escalation: "Routine monitoring",
        },
        {
            time: "10:00",
            rate: 20,
            code: "N",
            score: 0,
            band: "low",
            bandWords: "Low",
            escalation: "Routine monitoring",
        },
        {
            time: "14:00",
            rate: 23,
            code: "H",
            flag: "High",
            score: 2,
            band: "low",
            bandWords: "Low",
            escalation: "Ward-based response",
        },
        {
            time: "18:00",
            rate: 26,
            code: "H",
            flag: "High",
            score: 5,
            band: "medium",
            bandWords: "Medium",
            escalation: "Urgent ward-based response",
        },
        {
            time: "22:00",
            rate: 16,
            code: "N",
            score: 1,
            band: "low",
            bandWords: "Low",
            escalation: "Ward-based response",
        },
    ];
    let shown = $state(4);
    const readings = $derived(all.slice(0, shown));
    const first = $derived(readings[0]);
    const latest = $derived(readings[readings.length - 1]);
    const points = $derived(
        readings.map((r, i) => `${20 + i * 45},${100 - (r.rate - 10) * 4}`).join(" "),
    );
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
        Respiration rate for an invented patient on 14 November 2026, with the latest reading and
        the early warning score your own validated code computed.
    </p>

    <p>
        Latest, <time datetime={latest.time}>{latest.time}</time>:
        <ObservationView
            label="Respiration rate"
            value={String(latest.rate)}
            unit="breaths/min"
            interpretation={latest.code}
            flagLabel={latest.flag}
            range="12–20"
        />
    </p>
    <p>
        <EarlyWarningScoreView
            system="NEWS2"
            score={latest.score}
            band={latest.band}
            bandLabel={latest.bandWords}
            escalation={latest.escalation}
        />
    </p>

    <p>
        <Button
            type="button"
            disabled={shown === all.length}
            onclick={() => (shown = all.length)}>Show the 22:00 reading</Button
        >
    </p>

    <LineChart
        label={`Respiration rate, ${first.rate} breaths per minute at ${first.time}, ${latest.rate} at ${latest.time}`}
    >
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
                <thead
                    ><tr
                        ><th scope="col">Time</th><th scope="col">Rate</th><th scope="col">Flag</th
                        ></tr
                    ></thead
                >
                <tbody>
                    {#each readings as r (r.time)}<tr
                            ><th scope="row"><time datetime={r.time}>{r.time}</time></th><td
                                >{r.rate}</td
                            ><td>{r.flag ?? "None"}</td></tr
                        >{/each}
                </tbody>
            </table>
        {/snippet}
    </LineChart>

    <h2>A corrected result</h2>
    <p>
        Who follows up a corrected result is the service's decision; the page shows what the service
        supplies. Seeing, acknowledging and finishing the follow-up are three different things.
    </p>
    <section
        class="corrected-result"
        aria-label="Corrected potassium result"
    >
        <p>
            <ObservationView
                label="Potassium"
                value="4.8"
                unit="mmol/L"
                range="3.5–5.3"
                interpretation="N"
                status="corrected"
                statusLabel="Corrected 14 Nov 2026, 16:40"
                previousValue="6.1"
                previousLabel="was 6.1 until 16:40"
            />
        </p>
        <dl>
            <div>
                <dt>Sample collected</dt>
                <dd><time datetime="2026-11-14T09:15">14 Nov 2026, 09:15</time></dd>
            </div>
            <div>
                <dt>Amended</dt>
                <dd><time datetime="2026-11-14T16:40">14 Nov 2026, 16:40</time></dd>
            </div>
            <div>
                <dt>Responsible for follow-up</dt>
                <dd>Ward 4B medical team (invented)</dd>
            </div>
            <div>
                <dt>Seen</dt>
                <dd>Yes, 14 Nov 2026, 16:52</dd>
            </div>
            <div>
                <dt>Acknowledged</dt>
                <dd>No</dd>
            </div>
            <div>
                <dt>Follow-up</dt>
                <dd>Not completed: review of the earlier treatment is open</dd>
            </div>
        </dl>
    </section>
</main>
