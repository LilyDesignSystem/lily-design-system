<script lang="ts">
    // SBAR handover (spec/healthcare-ui item 9, P27-T9): Situation, Background, Assessment and Recommendation, each a
    // labelled field, completed and sent by keyboard alone. e2e/healthcare-pages.spec.ts checks it.
    import Header from "#lib/components/Header/Header.svelte";
    import BackLink from "#lib/components/BackLink/BackLink.svelte";
    import Button from "#lib/components/Button/Button.svelte";
    import Field from "#lib/components/Field/Field.svelte";
    import TextAreaInput from "#lib/components/TextAreaInput/TextAreaInput.svelte";

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
    let sent = $state(false);

    function onsubmit(event: SubmitEvent) {
        event.preventDefault();
        sent = true;
    }
</script>

<svelte:head>
    <title>Handover — Lily Design System</title>
</svelte:head>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Handover</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <p>A handover in the SBAR shape. Every part is required.</p>

    <form
        aria-label="SBAR handover"
        {onsubmit}
    >
        {#each parts as part (part.id)}
            <Field
                label={part.label}
                description={part.description}
                required
                inputId={`sbar-${part.id}`}
            >
                <TextAreaInput
                    id={`sbar-${part.id}`}
                    name={part.id}
                    label={part.label}
                    rows={3}
                    required
                />
            </Field>
        {/each}
        <Button type="submit">Send handover</Button>
    </form>

    {#if sent}
        <p
            class="handover-sent"
            role="status"
        >
            Handover sent
        </p>
    {/if}
</main>
