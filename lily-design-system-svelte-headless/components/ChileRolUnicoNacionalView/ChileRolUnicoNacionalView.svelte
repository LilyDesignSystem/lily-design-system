<script lang="ts">
    // ChileRolUnicoNacionalView component
    //
    // A headless display component for showing Chile's
    // Rol Único Nacional (RUN) in a read-only format.
    // Format: Seven or eight digits plus a trailing check character. The check character is computed with a Modulus-11 algorithm: each body digit, read right to left, is multiplied by a repeating weight sequence 2,3,4,5,6,7; the products are summed; the check value is 11 minus the sum's Modulus-11 remainder, where a result of 11 maps to 0 and a result of 10 maps to the letter K.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <ChileRolUnicoNacionalView label="Rol Único Nacional (RUN)" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/RUT

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

<!-- ChileRolUnicoNacionalView.svelte -->
<span
    class={`chile-rol-unico-nacional-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
