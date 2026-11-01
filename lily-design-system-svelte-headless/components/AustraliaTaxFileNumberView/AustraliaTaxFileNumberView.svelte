<script lang="ts">
    // AustraliaTaxFileNumberView component
    //
    // A headless display component for showing Australia's
    // Tax File Number (TFN) in a read-only format.
    // Format: Nine digits, written 123 456 782 (older numbers have eight). The digits are multiplied by the weights 1,4,3,7,5,8,6,9,10 and summed, and the sum must be a multiple of 11.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <AustraliaTaxFileNumberView label="Tax File Number (TFN)" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Tax_file_number

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

<!-- AustraliaTaxFileNumberView.svelte -->
<span
    class={`australia-tax-file-number-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
