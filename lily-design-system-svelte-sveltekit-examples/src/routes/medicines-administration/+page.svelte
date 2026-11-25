<script lang="ts">
    // Medicines administration chart (spec/healthcare-ui item 9, P27-T9): past, current and planned administrations for each
    // medicine, each status in words (given, due, omitted with its reason), never a tick or a colour alone. The medicine is
    // the row header, so a screen reader names it in every cell. e2e/healthcare-pages.spec.ts checks it.
    import Header from "#lib/components/Header/Header.svelte";
    import BackLink from "#lib/components/BackLink/BackLink.svelte";
    import Table from "#lib/components/Table/Table.svelte";
    import TableHead from "#lib/components/TableHead/TableHead.svelte";
    import TableBody from "#lib/components/TableBody/TableBody.svelte";
    import TableRow from "#lib/components/TableRow/TableRow.svelte";
    import TableTH from "#lib/components/TableTH/TableTH.svelte";
    import TableTD from "#lib/components/TableTD/TableTD.svelte";
    import MedicationView from "#lib/components/MedicationView/MedicationView.svelte";
    import { formatPartialDate, formatQuantity } from "#lib/components/clinical-format.ts";

    // An invented patient and chart. Product strength (what is on the box), prescribed dose and what was given are three
    // different things, and here they differ.
    const chartDate = "2026-11-14";
    const chartDateWords = formatPartialDate(chartDate, "en-GB");
    const times = ["08:00", "12:00", "18:00", "22:00"] as const;
    type Dose = { status: string; words: string };
    const none: Dose = { status: "not-scheduled", words: "Not scheduled" };
    const rows: {
        name: string;
        product: string;
        dose: string;
        route: string;
        doses: Record<string, Dose>;
    }[] = [
        {
            name: "paracetamol",
            product: `${formatQuantity(500, "mg", "en-GB")} tablet`,
            dose: formatQuantity(1, "g", "en-GB"),
            route: "oral",
            doses: {
                "08:00": { status: "given", words: "Given 08:07, 1\u00a0g (2 tablets)" },
                "12:00": { status: "given", words: "Given 12:20, 1\u00a0g (2 tablets)" },
                "18:00": { status: "due", words: "Due" },
                "22:00": { status: "planned", words: "Planned" },
            },
        },
        {
            name: "enoxaparin",
            product: `${formatQuantity(60, "mg", "en-GB")} in ${formatQuantity(0.6, "mL", "en-GB")} syringe`,
            dose: formatQuantity(40, "mg", "en-GB"),
            route: "subcutaneous",
            doses: {
                "08:00": { status: "omitted", words: "Omitted 08:10: patient refused" },
                "12:00": none,
                "18:00": none,
                "22:00": none,
            },
        },
    ];
</script>

<svelte:head>
    <title>Medicines administration — Lily Design System</title>
</svelte:head>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Medicines administration</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <section
        class="patient-banner"
        aria-label="Patient details: EXAMPLE, Alex"
    >
        <dl>
            <div>
                <dt>Name</dt>
                <dd>EXAMPLE, Alex</dd>
            </div>
            <div>
                <dt>Born</dt>
                <dd><time datetime="1949-02-03">3 Feb 1949</time></dd>
            </div>
            <div>
                <dt>Hospital number</dt>
                <dd>Invented-0001</dd>
            </div>
            <div>
                <dt>Allergies</dt>
                <dd>No known allergies</dd>
            </div>
        </dl>
    </section>

    <p>
        Chart for <time datetime={chartDate}>{chartDateWords}</time>. Every cell says what happened,
        or is planned, in words. The product is what is on the box; the dose is what was prescribed.
    </p>

    <Table label={`Medicines administration, ${chartDateWords}`}>
        <TableHead>
            <TableRow>
                <TableTH scope="col">Medicine and product</TableTH>
                <TableTH scope="col">Prescribed dose and route</TableTH>
                {#each times as time (time)}<TableTH scope="col"
                        >Scheduled <time datetime={time}>{time}</time></TableTH
                    >{/each}
            </TableRow>
        </TableHead>
        <TableBody>
            {#each rows as row (row.name)}
                <TableRow>
                    <TableTH scope="row">
                        <MedicationView
                            name={row.name}
                            strength={row.product}
                        />
                    </TableTH>
                    <TableTD>{row.dose} {row.route}</TableTD>
                    {#each times as time (time)}
                        <TableTD data-status={row.doses[time].status}
                            >{row.doses[time].words}</TableTD
                        >
                    {/each}
                </TableRow>
            {/each}
        </TableBody>
    </Table>
</main>
