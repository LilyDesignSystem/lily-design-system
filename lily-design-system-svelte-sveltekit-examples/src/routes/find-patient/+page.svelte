<script lang="ts">
    // Find a patient (tasks.md P30-T4, spec/lessons/openemr item 4): a search of several fields; each result shows two
    // identifiers; no results is said in words; a single match is never opened by itself, so the person always confirms who
    // they mean; possible duplicates are shown side by side, never merged. e2e/find-patient.spec.ts checks it.
    import { tick } from "svelte";
    import Header from "#lib/components/Header/Header.svelte";
    import BackLink from "#lib/components/BackLink/BackLink.svelte";
    import Button from "#lib/components/Button/Button.svelte";
    import Table from "#lib/components/Table/Table.svelte";
    import TableHead from "#lib/components/TableHead/TableHead.svelte";
    import TableBody from "#lib/components/TableBody/TableBody.svelte";
    import TableRow from "#lib/components/TableRow/TableRow.svelte";
    import TableTH from "#lib/components/TableTH/TableTH.svelte";
    import TableTD from "#lib/components/TableTD/TableTD.svelte";

    type Person = {
        family: string;
        given: string;
        born: string;
        bornLabel: string;
        number: string;
    };
    const PEOPLE: Person[] = [
        {
            family: "JONES",
            given: "Mary",
            born: "1958-03-04",
            bornLabel: "4 Mar 1958",
            number: "943 476 5919",
        },
        {
            family: "JONES",
            given: "Mary",
            born: "1958-03-04",
            bornLabel: "4 Mar 1958",
            number: "943 476 5994",
        },
        {
            family: "JONES",
            given: "Martin",
            born: "1949-11-21",
            bornLabel: "21 Nov 1949",
            number: "943 476 5873",
        },
        {
            family: "OKAFOR",
            given: "Chidi",
            born: "1990-07-12",
            bornLabel: "12 Jul 1990",
            number: "943 476 5870",
        },
    ];

    let family = $state("");
    let given = $state("");
    let results: Person[] | null = $state(null);
    let resultsHeading: HTMLHeadingElement | undefined = $state();

    async function search(event: SubmitEvent) {
        event.preventDefault();
        const f = family.trim().toUpperCase();
        const g = given.trim().toLowerCase();
        results = PEOPLE.filter(
            (p) => (!f || p.family.startsWith(f)) && (!g || p.given.toLowerCase().startsWith(g)),
        );
        // Focus moves to the results heading, never into a record: even one match waits for the person to choose it.
        await tick();
        resultsHeading?.focus();
    }

    const key = (p: Person) => `${p.family}|${p.given}|${p.born}`;
    const duplicates = (p: Person) => (results ?? []).filter((q) => key(q) === key(p)).length > 1;
</script>

<svelte:head>
    <title>Find a patient — Lily Design System</title>
</svelte:head>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Find a patient</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <p>
        Search by name. Every result shows a date of birth and an NHS number, a single match is
        never opened for you, and records that may be the same person are shown side by side.
    </p>

    <form
        role="search"
        aria-label="Find a patient"
        onsubmit={search}
    >
        <label for="family">Family name</label>
        <input
            id="family"
            bind:value={family}
            autocomplete="off"
        />
        <label for="given">Given name</label>
        <input
            id="given"
            bind:value={given}
            autocomplete="off"
        />
        <Button type="submit">Search</Button>
    </form>

    {#if results !== null}
        <h2
            bind:this={resultsHeading}
            tabindex="-1"
        >
            {results.length === 0
                ? "No patients match"
                : results.length === 1
                  ? "1 patient matches"
                  : `${results.length} patients match`}
        </h2>
        {#if results.length === 0}
            <p>Check the spelling, or search with fewer details.</p>
        {:else}
            <Table label="Matching patients">
                <TableHead>
                    <TableRow>
                        <TableTH scope="col">Name</TableTH>
                        <TableTH scope="col">Date of birth</TableTH>
                        <TableTH scope="col">NHS number</TableTH>
                        <TableTH scope="col">Record</TableTH>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {#each results as p (p.number)}
                        <TableRow data-possible-duplicate={duplicates(p) ? "" : undefined}>
                            <TableTH scope="row">
                                {p.family}, {p.given}{#if duplicates(p)}<br /><strong
                                        >Possible duplicate record</strong
                                    >{/if}
                            </TableTH>
                            <TableTD><time datetime={p.born}>{p.bornLabel}</time></TableTD>
                            <TableTD>{p.number}</TableTD>
                            <TableTD
                                ><a href={`/patient-summary?nhs=${p.number.replaceAll(" ", "")}`}
                                    >Open record for {p.given} {p.family}, {p.bornLabel}</a
                                ></TableTD
                            >
                        </TableRow>
                    {/each}
                </TableBody>
            </Table>
        {/if}
    {/if}
</main>
