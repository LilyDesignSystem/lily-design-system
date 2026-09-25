<script lang="ts">
    // CanadaSocialInsuranceNumberView component
    //
    // A headless display component for showing Canada's
    // Social Insurance Number (SIN) in a read-only format.
    // Format: Nine digits, usually displayed in three groups of three (NNN NNN NNN). The leading digit denotes the region of registration (1 Atlantic, 2-3 Quebec, 4-5 Ontario, 6 Prairies, 7 Pacific, 9 temporary residents), the following seven digits are a serial number, and the final digit is a Luhn (Modulus-10) check digit over the first eight.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <CanadaSocialInsuranceNumberView label="Social Insurance Number (SIN)" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Social_Insurance_Number

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

<!-- CanadaSocialInsuranceNumberView.svelte -->
<span
    class={`canada-social-insurance-number-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
