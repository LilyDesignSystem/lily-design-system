<script lang="ts">
    // PeruDocumentoNacionalDeIdentidadView component
    //
    // A headless display component for showing Peru's
    // Documento Nacional de Identidad (DNI) in a read-only format.
    // Format: Eight digits, the Código Único de Identificación (CUI), often followed by a hyphen and a check character (10117410-2). The check character is a digit or a letter: multiply the eight digits by the weights 3, 2, 7, 6, 5, 4, 3, 2, sum them and take the remainder modulo 11, r; the digit is "65432110987"[r] and the letter "KJIHGFEDCBA"[r], and either is accepted.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <PeruDocumentoNacionalDeIdentidadView label="Documento Nacional de Identidad (DNI)" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://es.wikipedia.org/wiki/Documento_Nacional_de_Identidad_(Per%C3%BA)

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

<!-- PeruDocumentoNacionalDeIdentidadView.svelte -->
<span
    class={`peru-documento-nacional-de-identidad-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
