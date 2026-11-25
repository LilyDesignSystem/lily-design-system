<script lang="ts">
    // Clinic flow board (tasks.md P30-T3, spec/lessons/openemr item 1, spec/lessons/openmrs item 8): today's appointments,
    // each status, priority and time in status written in words; an overdue entry says so in words and data-overdue, and
    // nothing blinks or animates. The board updates only when Refresh is pressed, the change is summarised in one polite
    // status line, and focus stays where it was. A coverage line says what the board shows. e2e/flow-board.spec.ts checks it.
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
    import DurationView from "#lib/components/DurationView/DurationView.svelte";

    type Status = "booked" | "arrived" | "in-room" | "done";
    type Appointment = {
        time: string;
        timeLabel: string;
        patient: string;
        born: string;
        number: string;
        status: Status;
        priority: "routine" | "urgent";
        room: string;
        minutes: number;
    };
    const STATUS_WORDS: Record<Status, string> = {
        booked: "Booked",
        arrived: "Arrived, waiting",
        "in-room": "In the consulting room",
        done: "Seen",
    };
    const PRIORITY_WORDS = { routine: "Routine", urgent: "Urgent" };
    // Waiting longer than this is overdue; the clinic sets the rule, the page only shows it.
    const OVERDUE_AFTER = 20;

    let appointments: Appointment[] = $state([
        {
            time: "2026-11-17T09:00",
            timeLabel: "09:00",
            patient: "JONES, Mary",
            born: "4 Mar 1958",
            number: "943 476 5919",
            status: "done",
            priority: "routine",
            room: "Room 1",
            minutes: 0,
        },
        {
            time: "2026-11-17T09:20",
            timeLabel: "09:20",
            patient: "OKAFOR, Chidi",
            born: "12 Jul 1990",
            number: "943 476 5870",
            status: "in-room",
            priority: "urgent",
            room: "Room 2",
            minutes: 12,
        },
        {
            time: "2026-11-17T09:40",
            timeLabel: "09:40",
            patient: "NGUYEN, Linh",
            born: "30 Jan 2001",
            number: "943 476 5845",
            status: "arrived",
            priority: "routine",
            room: "",
            minutes: 25,
        },
        {
            time: "2026-11-17T10:00",
            timeLabel: "10:00",
            patient: "SINGH, Harpreet",
            born: "18 Sep 1972",
            number: "943 476 5921",
            status: "booked",
            priority: "routine",
            room: "",
            minutes: 0,
        },
    ]);
    let summary = $state("");

    const overdue = (a: Appointment) => a.status === "arrived" && a.minutes > OVERDUE_AFTER;
    const waiting = $derived(appointments.filter((a) => a.status === "arrived").length);

    // A refresh stands in for new data from the clinic system: it arrives when asked for, never on a timer.
    function refresh() {
        appointments = appointments.map((a) =>
            a.status === "booked"
                ? { ...a, status: "arrived", minutes: 1 }
                : a.status === "arrived"
                  ? { ...a, minutes: a.minutes + 5 }
                  : a,
        );
        const late = appointments.filter(overdue).length;
        summary = `Updated: ${appointments.filter((a) => a.status === "arrived").length} waiting, ${late} waiting over ${OVERDUE_AFTER} minutes`;
    }
</script>

<svelte:head>
    <title>Clinic flow board — Lily Design System</title>
</svelte:head>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Clinic flow board</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <p>
        Today's appointments in one clinic. Every status is written in words, an overdue wait says
        so, nothing blinks, and the board changes only when you ask it to.
    </p>

    <p class="flow-board-coverage">
        {appointments.length} appointments today, in time order; {waiting} waiting. Updated only when
        you press Refresh.
    </p>

    <Button onclick={refresh}>Refresh</Button>
    <p
        class="flow-board-summary"
        role="status"
    >
        {summary}
    </p>

    <HorizontalScroller label="Today's appointments">
        <Table label="Today's appointments">
            <TableHead>
                <TableRow>
                    <TableTH scope="col">Time</TableTH>
                    <TableTH scope="col">Patient</TableTH>
                    <TableTH scope="col">Status</TableTH>
                    <TableTH scope="col">Priority</TableTH>
                    <TableTH scope="col">Room</TableTH>
                    <TableTH scope="col">Time in status</TableTH>
                </TableRow>
            </TableHead>
            <TableBody>
                {#each appointments as a (a.time)}
                    <TableRow
                        data-status={a.status}
                        data-priority={a.priority}
                        data-overdue={overdue(a) ? "" : undefined}
                    >
                        <TableTD><time datetime={a.time}>{a.timeLabel}</time></TableTD>
                        <TableTH scope="row"
                            >{a.patient}<br />Born {a.born}, NHS number {a.number}</TableTH
                        >
                        <TableTD>
                            {STATUS_WORDS[a.status]}{#if overdue(a)}<br /><strong
                                    >Waiting over {OVERDUE_AFTER} minutes</strong
                                >{/if}
                        </TableTD>
                        <TableTD>{PRIORITY_WORDS[a.priority]}</TableTD>
                        <TableTD>{a.room || "Not yet given"}</TableTD>
                        <TableTD>
                            {#if a.status === "arrived" || a.status === "in-room"}
                                <DurationView
                                    value={`${a.minutes} minutes`}
                                    duration={`PT${a.minutes}M`}
                                />
                            {:else}
                                Not applicable
                            {/if}
                        </TableTD>
                    </TableRow>
                {/each}
            </TableBody>
        </Table>
    </HorizontalScroller>
</main>
