<script lang="ts">
    // RepublicaDominicanaCedulaDeIdentidadYElectoralView component
    //
    // A headless display component for showing the Dominican Republic's
    // Cédula de Identidad y Electoral in a read-only format.
    // Format: Eleven digits, usually written 3-7-1 (001-1391820-5): a three-digit issuing office, a seven-digit sequence and a check digit computed with the Luhn algorithm over all eleven digits. A few early numbers fail the check and are still valid, so treat a Luhn failure as a warning, not a rejection.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <RepublicaDominicanaCedulaDeIdentidadYElectoralView label="Cédula de Identidad y Electoral" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://es.wikipedia.org/wiki/Junta_Central_Electoral_(Rep%C3%BAblica_Dominicana)

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

<!-- RepublicaDominicanaCedulaDeIdentidadYElectoralView.svelte -->
<span
    class={`republica-dominicana-cedula-de-identidad-y-electoral-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
