<script lang="ts">
    // TurkiyeTcKimlikNumarasiView component
    //
    // A headless display component for showing Turkey's
    // T.C. Kimlik Numarası in a read-only format.
    // Format: Eleven digits, the first never zero. The tenth digit is the units digit of ((sum of digits 1,3,5,7,9) × 7) plus ((sum of digits 2,4,6,8) × 9); the eleventh digit is the units digit of the sum of the first ten digits. The eleventh digit is always even.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <TurkiyeTcKimlikNumarasiView label="T.C. Kimlik Numarası" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Turkish_Identification_Number

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

<!-- TurkiyeTcKimlikNumarasiView.svelte -->
<span
    class={`turkiye-tc-kimlik-numarasi-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
