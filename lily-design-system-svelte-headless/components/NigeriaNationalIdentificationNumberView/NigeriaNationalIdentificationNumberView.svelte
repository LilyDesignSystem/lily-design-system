<script lang="ts">
    // NigeriaNationalIdentificationNumberView component
    //
    // A headless display component for showing Nigeria's
    // National Identification Number (NIN) in a read-only format.
    // Format: Eleven digits issued by the National Identity Management Commission (NIMC). No check-digit algorithm is published, so only the length and digits can be checked.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <NigeriaNationalIdentificationNumberView label="National Identification Number (NIN)" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_Identity_Management_Commission

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

<!-- NigeriaNationalIdentificationNumberView.svelte -->
<span
    class={`nigeria-national-identification-number-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
