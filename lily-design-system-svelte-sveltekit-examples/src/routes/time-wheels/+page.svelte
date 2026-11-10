<script lang="ts">
    // Time with wheels: the several-wheels pattern (spec/detent-lessons, P26-T6). One <fieldset> named by its <legend>
    // holds one WheelPicker per part, each with its own label, in the order the consumer chooses (here hours then minutes,
    // 24-hour). Each part is its own field in the form, and a form reset puts both back. e2e/time-wheels.spec.ts checks it.
    import Header from "#lib/components/Header/Header.svelte";
    import BackLink from "#lib/components/BackLink/BackLink.svelte";
    import Button from "#lib/components/Button/Button.svelte";
    import Fieldset from "#lib/components/Fieldset/Fieldset.svelte";
    import WheelPicker from "#lib/components/WheelPicker/WheelPicker.svelte";

    const pad = (n: number) => String(n).padStart(2, "0");
    const hours = Array.from({ length: 24 }, (_, h) => ({ value: pad(h), label: pad(h) }));
    const minutes = Array.from({ length: 12 }, (_, i) => ({
        value: pad(i * 5),
        label: pad(i * 5),
    }));

    let hour = $state("09");
    let minute = $state("30");
    let submitted = $state("");

    function onsubmit(event: SubmitEvent) {
        event.preventDefault();
        const data = new FormData(event.currentTarget as HTMLFormElement);
        submitted = `${data.get("hour")}:${data.get("minute")}`;
    }
</script>

<svelte:head>
    <title>Time with wheels — Lily Design System</title>
</svelte:head>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Time with wheels</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <p>
        Two wheel pickers make one time. The fieldset's legend names the whole time, and each wheel
        names its own part. Tab moves from the hours to the minutes; the arrow keys, typing or a
        click choose within a wheel.
    </p>

    <form
        {onsubmit}
        onreset={() => (submitted = "")}
    >
        <Fieldset
            legend="Appointment time"
            class="time-wheels"
        >
            <WheelPicker
                label="Hours"
                options={hours}
                bind:value={hour}
                name="hour"
            />
            <WheelPicker
                label="Minutes"
                options={minutes}
                bind:value={minute}
                name="minute"
            />
        </Fieldset>
        <Button type="submit">Book this time</Button>
        <Button type="reset">Start again</Button>
    </form>

    <!-- The readout sits outside the form: a form reset also resets an <output> inside it, and WebKit then replaces the
         output's text, so a framework's later updates go to a node that is no longer in the page. -->
    <p>Chosen: <output>{hour}:{minute}</output></p>

    {#if submitted}
        <p class="time-wheels-submitted">Submitted: {submitted}</p>
    {/if}
</main>

<style>
    :global(.time-wheels) {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: flex-start;
    }
    :global(.time-wheels .wheel-picker) {
        inline-size: 6rem;
    }
</style>
