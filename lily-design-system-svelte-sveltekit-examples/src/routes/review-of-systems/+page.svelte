<script lang="ts">
    // Review of systems (tasks.md P30-T2, spec/lessons/openemr item 5): each symptom is answered present, absent or not
    // asked, a radio group with none chosen at first, never a checkbox, which cannot tell "denied" from "never asked". One
    // fieldset per body system; its "All others absent" button sets only the symptoms not yet answered.
    // e2e/review-of-systems.spec.ts checks it.
    import Header from "#lib/components/Header/Header.svelte";
    import BackLink from "#lib/components/BackLink/BackLink.svelte";
    import Button from "#lib/components/Button/Button.svelte";
    import Fieldset from "#lib/components/Fieldset/Fieldset.svelte";
    import RadioGroup from "#lib/components/RadioGroup/RadioGroup.svelte";

    type Answer = "present" | "absent" | "not-asked" | "";
    const ANSWERS: { value: Exclude<Answer, "">; label: string }[] = [
        { value: "present", label: "Present" },
        { value: "absent", label: "Absent" },
        { value: "not-asked", label: "Not asked" },
    ];
    const SYSTEMS = [
        { id: "respiratory", name: "Respiratory", symptoms: ["Cough", "Breathlessness", "Wheeze"] },
        {
            id: "cardiovascular",
            name: "Cardiovascular",
            symptoms: ["Chest pain", "Palpitations", "Ankle swelling"],
        },
    ];

    let answers: Record<string, Answer> = $state(
        Object.fromEntries(
            SYSTEMS.flatMap((s) => s.symptoms.map((symptom) => [`${s.id}-${symptom}`, ""])),
        ),
    );

    function othersAbsent(systemId: string, symptoms: string[]) {
        for (const symptom of symptoms) {
            const key = `${systemId}-${symptom}`;
            if (answers[key] === "") answers[key] = "absent";
        }
    }
</script>

<svelte:head>
    <title>Review of systems — Lily Design System</title>
</svelte:head>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Review of systems</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <p>
        Each symptom is answered present, absent or not asked, so a symptom nobody asked about is
        never recorded as denied. "All others absent" fills in only the symptoms not yet answered.
    </p>

    <form onsubmit={(event) => event.preventDefault()}>
        {#each SYSTEMS as system (system.id)}
            <Fieldset legend={system.name}>
                {#each system.symptoms as symptom (symptom)}
                    {@const key = `${system.id}-${symptom}`}
                    <RadioGroup
                        label={symptom}
                        data-answer={answers[key] || undefined}
                    >
                        {#each ANSWERS as answer (answer.value)}
                            <label>
                                <input
                                    type="radio"
                                    name={key}
                                    value={answer.value}
                                    bind:group={answers[key]}
                                />
                                {answer.label}
                            </label>
                        {/each}
                    </RadioGroup>
                {/each}
                <Button onclick={() => othersAbsent(system.id, system.symptoms)}>
                    All other {system.name.toLowerCase()} symptoms absent
                </Button>
            </Fieldset>
        {/each}
    </form>
</main>
