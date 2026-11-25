<script lang="ts">
    // SBAR handover rehearsal (spec/healthcare-ui item 9, P27-T9; docs/audits/gpt-6-2-astra-high finding 3). It sends nothing,
    // and says so. The fields have no name and are disabled until this script runs, so the first HTML cannot submit a
    // narrative or put one in the URL. A draft belongs to its patient and is never cleared by rehearsing.
    // e2e/healthcare-pages.spec.ts checks it.
    import { onMount } from "svelte";
    import HorizontalScroller from "#lib/components/HorizontalScroller/HorizontalScroller.svelte";
    import Header from "#lib/components/Header/Header.svelte";
    import BackLink from "#lib/components/BackLink/BackLink.svelte";
    import Button from "#lib/components/Button/Button.svelte";

    const parts = [
        { id: "situation", label: "Situation", description: "What is happening now" },
        { id: "background", label: "Background", description: "What led to it" },
        { id: "assessment", label: "Assessment", description: "What you think the problem is" },
        {
            id: "recommendation",
            label: "Recommendation",
            description: "What you need, and by when",
        },
    ];
    // Invented people: no record is anywhere in this repository.
    const patients = ["Example, Alex (born 3 Feb 1949)", "Example, Alexis (born 3 Feb 1979)"];
    const states = [
        {
            state: "Not sent",
            words: "Not sent. Draft kept on this device.",
            draft: "Kept, editable",
        },
        {
            state: "Pending",
            words: "Sending to Ward 4B night team. Not delivered yet.",
            draft: "Kept, locked while sending",
        },
        {
            state: "Delivery confirmed",
            words: "Delivered to Ward 4B night team at 19:42. Not yet read.",
            draft: "Kept as the sent copy",
        },
        {
            state: "Failed",
            words: "Not delivered to Ward 4B night team. Try again, or telephone.",
            draft: "Kept, editable, with a retry",
        },
        {
            state: "Outcome unknown",
            words: "We do not know if Ward 4B night team has this. Telephone to check.",
            draft: "Kept; a retry says it may arrive twice",
        },
        {
            state: "Accepted",
            words: "Accepted by S. Okoro, Ward 4B, at 19:50.",
            draft: "Kept as the sent copy",
        },
    ];

    let ready = $state(false);
    let patient = $state(0);
    let drafts = $state(patients.map(() => Object.fromEntries(parts.map((p) => [p.id, ""]))));
    let message = $state("");
    onMount(() => (ready = true));

    function onsubmit(event: SubmitEvent) {
        event.preventDefault();
        message = `Rehearsal only. Nothing was sent, and the text is still here, under ${patients[patient]}.`;
    }
</script>

<svelte:head>
    <title>Handover rehearsal — Lily Design System</title>
</svelte:head>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Handover rehearsal</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <p>
        <strong>This page is a local rehearsal. It sends nothing to anyone.</strong> Use invented text,
        never a real person's details. It shows a handover in the SBAR shape; every part is required.
    </p>
    <noscript
        ><p>The rehearsal form needs JavaScript. Without it, it stays switched off.</p></noscript
    >

    <form
        method="post"
        aria-label="SBAR handover rehearsal"
        {onsubmit}
    >
        <fieldset
            class="fieldset"
            disabled={!ready}
        >
            <legend>Rehearse a handover</legend>
            <p>
                <label for="sbar-patient">Patient</label>
                <select
                    id="sbar-patient"
                    class="select"
                    bind:value={patient}
                    onchange={() => (message = "")}
                >
                    {#each patients as name, i (name)}<option value={i}>{name}</option>{/each}
                </select>
            </p>
            <!-- A closed select can clip a long name; this line wraps, so who it is for is always whole. -->
            <p class="handover-patient">This handover is for: {patients[patient]}</p>
            <p>Destination in this rehearsal: Ward 4B night team (invented)</p>
            {#each parts as part (part.id)}
                <p>
                    <label for={`sbar-${part.id}`}>{part.label}</label>
                    <span id={`sbar-${part.id}-hint`}>{part.description}</span>
                    <textarea
                        id={`sbar-${part.id}`}
                        aria-describedby={`sbar-${part.id}-hint`}
                        class="text-area-input"
                        rows="3"
                        required
                        autocomplete="off"
                        bind:value={drafts[patient][part.id]}></textarea>
                </p>
            {/each}
            <Button type="submit">Rehearse handover</Button>
        </fieldset>
    </form>

    <p
        class="handover-rehearsed"
        role="status"
    >
        {message}
    </p>

    <h2>What a service that delivers must say</h2>
    <p>
        Write the destination into every message, keep the draft until delivery is confirmed, and
        use "delivered" or "accepted" only for the event your service received. None of these states
        happens on this page.
    </p>
    <HorizontalScroller label="Delivery states, with example words">
        <table>
            <caption>Delivery states, with example words</caption>
            <thead>
                <tr>
                    <th scope="col">State</th><th scope="col">Example words</th><th scope="col"
                        >Draft</th
                    >
                </tr>
            </thead>
            <tbody>
                {#each states as row (row.state)}
                    <tr><th scope="row">{row.state}</th><td>{row.words}</td><td>{row.draft}</td></tr
                    >
                {/each}
            </tbody>
        </table>
    </HorizontalScroller>
</main>
