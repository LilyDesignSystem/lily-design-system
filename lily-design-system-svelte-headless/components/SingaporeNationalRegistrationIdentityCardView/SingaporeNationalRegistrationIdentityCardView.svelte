<script lang="ts">
    // SingaporeNationalRegistrationIdentityCardView component
    //
    // A headless display component for showing Singapore's
    // National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN) in a read-only format.
    // Format: One letter (S or T for citizens/permanent residents; F or G for long-term foreign residents; M for newer FIN series), seven digits, and a trailing check letter. The check letter is computed by multiplying the seven digits by fixed weights (2,7,6,5,4,3,2), summing the products (adding 4 for a G/T prefix or 3 for an M prefix), taking the sum Modulus 11, and mapping (10 - remainder) through a lookup table to a letter.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <SingaporeNationalRegistrationIdentityCardView label="National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_Registration_Identity_Card

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

<!-- SingaporeNationalRegistrationIdentityCardView.svelte -->
<span
    class={`singapore-national-registration-identity-card-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
