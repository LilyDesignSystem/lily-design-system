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
    import { formatQuantity } from "#lib/components/clinical-format";

    const times = ["08:00", "12:00", "18:00", "22:00"];
    const rows = [
        {
            medicine: {
                name: "paracetamol",
                strength: formatQuantity(1, "g", "en-GB"),
                route: "oral",
            },
            doses: { "08:00": "Given", "12:00": "Given", "18:00": "Due", "22:00": "Planned" },
        },
        {
            medicine: {
                name: "enoxaparin",
                strength: formatQuantity(40, "mg", "en-GB"),
                route: "subcutaneous",
            },
            doses: {
                "08:00": "Omitted: patient refused",
                "12:00": "Not scheduled",
                "18:00": "Not scheduled",
                "22:00": "Not scheduled",
            },
        },
    ] as const;
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

    <p>
        A medicines administration chart for today. Every cell says what happened, or is planned, in
        words.
    </p>

    <Table label="Medicines administration, 14 Nov 2026">
        <TableHead>
            <TableRow>
                <TableTH scope="col">Medicine</TableTH>
                {#each times as time (time)}<TableTH scope="col"
                        ><time datetime={time}>{time}</time></TableTH
                    >{/each}
            </TableRow>
        </TableHead>
        <TableBody>
            {#each rows as row (row.medicine.name)}
                <TableRow>
                    <TableTH scope="row">
                        <MedicationView
                            name={row.medicine.name}
                            strength={row.medicine.strength}
                            route={row.medicine.route}
                        />
                    </TableTH>
                    {#each times as time (time)}
                        <TableTD
                            data-status={row.doses[time]
                                .split(":")[0]
                                .toLowerCase()
                                .replace(/ /g, "-")}>{row.doses[time]}</TableTD
                        >
                    {/each}
                </TableRow>
            {/each}
        </TableBody>
    </Table>
</main>
