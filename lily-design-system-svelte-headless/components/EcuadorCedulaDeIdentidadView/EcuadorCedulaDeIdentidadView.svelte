<script lang="ts">
    // EcuadorCedulaDeIdentidadView component
    //
    // A headless display component for showing Ecuador's
    // Cedula de Identidad Number in a read-only format.
    // Format: Ten digits: a two-digit province code (01 to 24, or 30 for those born abroad), a third digit below 6 for a natural person, six more digits, and a check digit. The first nine digits are multiplied alternately by 2 and 1 (starting with 2), subtracting 9 from any product above 9, and the check digit brings the sum to the next multiple of 10.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <EcuadorCedulaDeIdentidadView label="Cedula de Identidad Number" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/C%C3%A9dula_de_identidad

    let {
        class: className = "",
        label,
        value = "",
        ...restProps
    }: {
        label: string;
        value?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- EcuadorCedulaDeIdentidadView.svelte -->
<span
    class={`ecuador-cedula-de-identidad-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
