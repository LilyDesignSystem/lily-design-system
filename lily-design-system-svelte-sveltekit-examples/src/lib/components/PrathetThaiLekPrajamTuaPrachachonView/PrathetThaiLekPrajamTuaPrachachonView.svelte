<script lang="ts">
    // PrathetThaiLekPrajamTuaPrachachonView component
    //
    // A headless display component for showing Thailand's
    // เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon) in a read-only format.
    // Format: Thirteen digits. Digit 1 denotes registration category; digits 2-5 denote the district/province office of registration; digits 6-10 form a serial number; digit 11 is a Modulus-11 check digit computed over the first ten digits; digits 12-13 are further disambiguating digits.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <PrathetThaiLekPrajamTuaPrachachonView label="เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Thai_identity_card

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

<!-- PrathetThaiLekPrajamTuaPrachachonView.svelte -->
<span
    class={`prathet-thai-lek-prajam-tua-prachachon-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
