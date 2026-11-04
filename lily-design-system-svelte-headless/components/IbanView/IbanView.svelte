<script lang="ts">
    // IbanView component
    //
    // A headless display component for showing an International Bank Account Number (IBAN) in a read-only format.
    // Format: Up to 34 letters and digits: a two-letter country code, two check digits, then the national account number.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <IbanView label="IBAN" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/International_Bank_Account_Number

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

<!-- IbanView.svelte -->
<span
    class={`iban-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
