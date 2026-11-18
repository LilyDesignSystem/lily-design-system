<script lang="ts">
    // GhanaCardPersonalIdentificationNumberView component
    //
    // A headless display component for showing Ghana's
    // Ghana Card PIN in a read-only format.
    // Format: A three-letter prefix (GHA for citizens), a hyphen, a run of digits and a hyphen before a final check character (GHA-123456789-1). Sources disagree on the length of the digit run (eight, nine or ten), and the National Identification Authority does not publish the check-character algorithm, so check the prefix and shape, not the checksum.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <GhanaCardPersonalIdentificationNumberView label="Ghana Card PIN" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Ghana_Card

    let {
        class: className = "",
        label,
        value = "",
        ...restProps
    }: {
        label?: string;
        value?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- GhanaCardPersonalIdentificationNumberView.svelte -->
<span
    class={`ghana-card-personal-identification-number-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
