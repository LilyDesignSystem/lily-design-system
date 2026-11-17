<script lang="ts">
    // Test host: binds DateField's value and shows it, so a test can read what the parts produce.
    import DateField from "./DateField.svelte";

    let {
        value = "",
        yearLabel = "Year",
        ...props
    }: { value?: string; yearLabel?: string; [key: string]: unknown } = $props();
    let bound = $state(value);
</script>

<DateField
    label="Onset"
    {yearLabel}
    {...props}
    bind:value={bound}
/>
<output data-testid="value">{bound}</output>
