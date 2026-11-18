<script lang="ts">
    // ItyopyaFaydaIdentificationNumberView component
    //
    // A headless display component for showing Ethiopia's
    // Fayda Identification Number (FIN) in a read-only format.
    // Format: Twelve digits issued by the National ID Program (NIDP). The number encodes no personal attributes and no check-digit algorithm is published, so only the length and digits can be checked. Do not confuse it with the six-digit Fayda alternative number used to link bank accounts.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <ItyopyaFaydaIdentificationNumberView label="Fayda Identification Number (FIN)" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Fayda_ID

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

<!-- ItyopyaFaydaIdentificationNumberView.svelte -->
<span
    class={`ityopya-fayda-identification-number-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
