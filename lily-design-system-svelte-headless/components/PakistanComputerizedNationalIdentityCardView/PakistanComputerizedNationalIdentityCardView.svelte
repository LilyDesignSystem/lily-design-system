<script lang="ts">
    // PakistanComputerizedNationalIdentityCardView component
    //
    // A headless display component for showing Pakistan's
    // Computerized National Identity Card Number (CNIC) in a read-only format.
    // Format: Thirteen digits, written 12345-1234567-1: a five-digit locality code (province, division, district and tehsil), a seven-digit family number, and a final digit that is odd for a male and even for a female. There is no check digit.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <PakistanComputerizedNationalIdentityCardView label="Computerized National Identity Card Number (CNIC)" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Computerized_National_Identity_Card

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

<!-- PakistanComputerizedNationalIdentityCardView.svelte -->
<span
    class={`pakistan-computerized-national-identity-card-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
