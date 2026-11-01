<script lang="ts">
    // UruguayCedulaDeIdentidadView component
    //
    // A headless display component for showing Uruguay's
    // Cedula de Identidad Number in a read-only format.
    // Format: Six or seven digits plus a trailing check digit, written 1.234.567-2. The body is left-padded with zeros to seven digits, multiplied by the weights 2,9,8,7,6,3,4 and summed, and the check digit is the amount that brings the sum to the next multiple of 10 (0 when it already is one).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <UruguayCedulaDeIdentidadView label="Cedula de Identidad Number" value={value} />
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

<!-- UruguayCedulaDeIdentidadView.svelte -->
<span
    class={`uruguay-cedula-de-identidad-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
