<script lang="ts">
    // Ward board (spec/healthcare-ui item 9, P27-T9): every bed's state is words, not colour, and live updates are summarised
    // in one polite status region rather than announced cell by cell, so the board stays usable with a screen reader.
    // e2e/healthcare-pages.spec.ts checks it.
    import Header from "#lib/components/Header/Header.svelte";
    import BackLink from "#lib/components/BackLink/BackLink.svelte";
    import Button from "#lib/components/Button/Button.svelte";
    import Table from "#lib/components/Table/Table.svelte";
    import TableHead from "#lib/components/TableHead/TableHead.svelte";
    import TableBody from "#lib/components/TableBody/TableBody.svelte";
    import TableRow from "#lib/components/TableRow/TableRow.svelte";
    import TableTH from "#lib/components/TableTH/TableTH.svelte";
    import TableTD from "#lib/components/TableTD/TableTD.svelte";
    import EarlyWarningScoreView from "#lib/components/EarlyWarningScoreView/EarlyWarningScoreView.svelte";

    type Bed = {
        bed: string;
        state: "occupied" | "free" | "cleaning";
        patient: string;
        score?: number;
        band?: string;
    };
    const STATE_WORDS = { occupied: "Occupied", free: "Free", cleaning: "Being cleaned" };
    const BAND_WORDS: Record<string, string> = { low: "Low", medium: "Medium", high: "High" };

    let beds: Bed[] = $state([
        { bed: "Bed 1", state: "occupied", patient: "JONES, Mary", score: 1, band: "low" },
        { bed: "Bed 2", state: "occupied", patient: "OKAFOR, Chidi", score: 6, band: "medium" },
        { bed: "Bed 3", state: "cleaning", patient: "" },
        { bed: "Bed 4", state: "free", patient: "" },
    ]);

    const free = $derived(beds.filter((b) => b.state === "free").length);
    const cleaning = $derived(beds.filter((b) => b.state === "cleaning").length);
    const summary = $derived(`${free} free, ${cleaning} being cleaned, of ${beds.length} beds`);

    function finishCleaning() {
        beds = beds.map((b) => (b.state === "cleaning" ? { ...b, state: "free" } : b));
    }
</script>

<svelte:head>
    <title>Ward board — Lily Design System</title>
</svelte:head>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Ward board</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <p>
        A ward board. Each bed's state is written in words, and changes are summarised in one status
        line instead of being announced one cell at a time.
    </p>

    <p
        class="ward-board-summary"
        role="status"
    >
        {summary}
    </p>

    <Table label="Beds on Ward 7">
        <TableHead>
            <TableRow>
                <TableTH scope="col">Bed</TableTH>
                <TableTH scope="col">State</TableTH>
                <TableTH scope="col">Patient</TableTH>
                <TableTH scope="col">Early warning score</TableTH>
            </TableRow>
        </TableHead>
        <TableBody>
            {#each beds as bed (bed.bed)}
                <TableRow data-state={bed.state}>
                    <TableTH scope="row">{bed.bed}</TableTH>
                    <TableTD>{STATE_WORDS[bed.state]}</TableTD>
                    <TableTD>{bed.patient || "None"}</TableTD>
                    <TableTD>
                        {#if bed.score !== undefined && bed.band}
                            <EarlyWarningScoreView
                                system="NEWS2"
                                score={bed.score}
                                band={bed.band}
                                bandLabel={BAND_WORDS[bed.band]}
                            />
                        {:else}
                            Not applicable
                        {/if}
                    </TableTD>
                </TableRow>
            {/each}
        </TableBody>
    </Table>

    <Button onclick={finishCleaning}>Mark cleaning finished</Button>
</main>
