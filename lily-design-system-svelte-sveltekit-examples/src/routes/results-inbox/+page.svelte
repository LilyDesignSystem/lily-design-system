<script lang="ts">
    // Results inbox (tasks.md P40-T7, spec/lessons/ehr-products item 9): results awaiting review, each with two identifiers,
    // the result's flag in words, a priority in words and data-priority, and a review state in words ("Not reviewed",
    // "Reviewed by … at …"). Rows are chosen with real checkboxes and a select-all with a mixed state; the bulk actions are
    // buttons named for what they do. A change is summarised once in a polite status line and focus stays on the button.
    // e2e/clinic-pages.spec.ts checks it.
    import Header from "#lib/components/Header/Header.svelte";
    import BackLink from "#lib/components/BackLink/BackLink.svelte";
    import Button from "#lib/components/Button/Button.svelte";
    import HorizontalScroller from "#lib/components/HorizontalScroller/HorizontalScroller.svelte";
    import Table from "#lib/components/Table/Table.svelte";
    import TableHead from "#lib/components/TableHead/TableHead.svelte";
    import TableBody from "#lib/components/TableBody/TableBody.svelte";
    import TableRow from "#lib/components/TableRow/TableRow.svelte";
    import TableTH from "#lib/components/TableTH/TableTH.svelte";
    import TableTD from "#lib/components/TableTD/TableTD.svelte";
    import ObservationView from "#lib/components/ObservationView/ObservationView.svelte";

    type Result = {
        id: string;
        patient: string;
        born: string;
        number: string;
        test: string;
        value: string;
        unit: string;
        interpretation: string;
        flagLabel: string;
        range: string;
        received: string;
        receivedLabel: string;
        priority: "routine" | "urgent";
        reviewedBy?: string;
    };
    const PRIORITY_WORDS = { routine: "Routine", urgent: "Urgent" };
    // The reviewer is the signed-in clinician; the time is when the button was pressed. Both are the application's.
    const REVIEWER = "Dr A. Rahman";

    let results: Result[] = $state([
        {
            id: "r1",
            patient: "JONES, Mary",
            born: "4 Mar 1958",
            number: "943 476 5919",
            test: "Potassium",
            value: "5.9",
            unit: "mmol/L",
            interpretation: "H",
            flagLabel: "High",
            range: "3.5–5.3",
            received: "2026-11-20T08:12",
            receivedLabel: "08:12",
            priority: "urgent",
        },
        {
            id: "r2",
            patient: "OKAFOR, Chidi",
            born: "12 Jul 1990",
            number: "943 476 5870",
            test: "Haemoglobin",
            value: "131",
            unit: "g/L",
            interpretation: "N",
            flagLabel: "",
            range: "130–170",
            received: "2026-11-20T08:40",
            receivedLabel: "08:40",
            priority: "routine",
        },
        {
            id: "r3",
            patient: "NGUYEN, Linh",
            born: "30 Sep 1977",
            number: "943 476 5900",
            test: "Sodium",
            value: "128",
            unit: "mmol/L",
            interpretation: "L",
            flagLabel: "Low",
            range: "133–146",
            received: "2026-11-20T09:05",
            receivedLabel: "09:05",
            priority: "routine",
        },
    ]);

    let selected: string[] = $state([]);
    let summary = $state("");
    let selectAll: HTMLInputElement | undefined = $state();

    const unreviewed = $derived(results.filter((r) => !r.reviewedBy).length);
    const allSelected = $derived(selected.length === results.length);
    // The select-all box shows "some" as its mixed state, which a screen reader announces as "mixed".
    $effect(() => {
        if (selectAll) selectAll.indeterminate = selected.length > 0 && !allSelected;
    });

    function toggleAll(event: Event) {
        selected = (event.currentTarget as HTMLInputElement).checked
            ? results.map((r) => r.id)
            : [];
    }

    function toggle(id: string, on: boolean) {
        selected = on ? [...selected, id] : selected.filter((x) => x !== id);
    }

    function markReviewed() {
        if (selected.length === 0) {
            summary = "Select at least one result first.";
            return;
        }
        const at = "09:30";
        for (const result of results)
            if (selected.includes(result.id)) result.reviewedBy = `${REVIEWER} at ${at}`;
        summary = `${selected.length} marked as reviewed.`;
        selected = [];
    }

    function markUrgent() {
        if (selected.length === 0) {
            summary = "Select at least one result first.";
            return;
        }
        for (const result of results) if (selected.includes(result.id)) result.priority = "urgent";
        summary = `${selected.length} marked as urgent.`;
    }
</script>

<svelte:head>
    <title>Results inbox — Lily Design System</title>
</svelte:head>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Results inbox</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <p>
        Results waiting for a clinician to review. Each flag, priority and review state is written
        in words; choose results with the checkboxes and act on them together.
    </p>

    <p class="results-inbox-coverage">
        {results.length} results received today, oldest first; {unreviewed} not yet reviewed.
    </p>

    <div
        class="results-inbox-actions"
        role="group"
        aria-label="Actions on the selected results"
    >
        <Button onclick={markReviewed}>Mark selected as reviewed</Button>
        <Button onclick={markUrgent}>Mark selected as urgent</Button>
    </div>
    <p
        class="results-inbox-summary"
        role="status"
    >
        {summary}
    </p>

    <HorizontalScroller label="Results waiting for review">
        <Table label="Results waiting for review">
            <TableHead>
                <TableRow>
                    <TableTH scope="col">
                        <input
                            bind:this={selectAll}
                            type="checkbox"
                            aria-label="Select all results"
                            checked={allSelected}
                            onchange={toggleAll}
                        />
                    </TableTH>
                    <TableTH scope="col">Patient</TableTH>
                    <TableTH scope="col">Result</TableTH>
                    <TableTH scope="col">Received</TableTH>
                    <TableTH scope="col">Priority</TableTH>
                    <TableTH scope="col">Review</TableTH>
                </TableRow>
            </TableHead>
            <TableBody>
                {#each results as r (r.id)}
                    <TableRow
                        data-priority={r.priority}
                        data-reviewed={r.reviewedBy ? "" : undefined}
                    >
                        <TableTD>
                            <input
                                type="checkbox"
                                aria-label={`Select ${r.test} for ${r.patient}`}
                                checked={selected.includes(r.id)}
                                onchange={(event) => toggle(r.id, event.currentTarget.checked)}
                            />
                        </TableTD>
                        <TableTH scope="row"
                            >{r.patient}<br />Born {r.born}, NHS number {r.number}</TableTH
                        >
                        <TableTD>
                            {r.test}:
                            <ObservationView
                                value={r.value}
                                unit={r.unit}
                                interpretation={r.interpretation}
                                flagLabel={r.flagLabel || undefined}
                                range={r.range}
                            />
                        </TableTD>
                        <TableTD><time datetime={r.received}>{r.receivedLabel}</time></TableTD>
                        <TableTD>{PRIORITY_WORDS[r.priority]}</TableTD>
                        <TableTD
                            >{r.reviewedBy
                                ? `Reviewed by ${r.reviewedBy}`
                                : "Not reviewed"}</TableTD
                        >
                    </TableRow>
                {/each}
            </TableBody>
        </Table>
    </HorizontalScroller>
</main>
