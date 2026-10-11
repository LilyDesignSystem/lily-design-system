<script lang="ts">
    // LuxembourgMatriculeView component
    //
    // A headless display component for showing Luxembourg's
    // Numéro d'Identification Nationale (Matricule) in a read-only format.
    // Format: Thirteen digits in the form YYYYMMDDNNNCC: the first eight digits encode date of birth (YYYYMMDD); the next three are a sequence number; the twelfth digit is a Luhn (Modulus-10) check digit computed over the first eleven digits; the thirteenth digit is a second, independent check digit computed with the Verhoeff algorithm over the first twelve digits.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <LuxembourgMatriculeView label="Numéro d'Identification Nationale (Matricule)" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://ccss.public.lu/fr/glossaire/numero-identification-national/matricule-national.html

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

<!-- LuxembourgMatriculeView.svelte -->
<span
    class={`luxembourg-matricule-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
