<script lang="ts">
    // ArgentinaCodigoUnicoDeIdentificacionLaboralView component
    //
    // A headless display component for showing Argentina's
    // Código Único de Identificación Laboral (CUIL) in a read-only format.
    // Format: Displayed as XX-NNNNNNNN-X: a two-digit prefix denoting registration type/sex (historically 20 male, 27 female, though this classification was discontinued in 2012), the eight-digit DNI (national identity document) number, and a Modulus-11 check digit computed over the ten preceding digits.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <ArgentinaCodigoUnicoDeIdentificacionLaboralView label="Código Único de Identificación Laboral (CUIL)" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/C%C3%B3digo_%C3%9Anico_de_Identificaci%C3%B3n_Laboral

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

<!-- ArgentinaCodigoUnicoDeIdentificacionLaboralView.svelte -->
<span
    class={`argentina-codigo-unico-de-identificacion-laboral-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
