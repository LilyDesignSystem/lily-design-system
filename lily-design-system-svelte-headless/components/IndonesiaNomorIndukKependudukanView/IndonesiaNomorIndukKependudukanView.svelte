<script lang="ts">
    // IndonesiaNomorIndukKependudukanView component
    //
    // A headless display component for showing Indonesia's
    // Nomor Induk Kependudukan (NIK) in a read-only format.
    // Format: Sixteen digits in the form PPKKCC-DDMMYY-NNNN: the first six digits encode province, regency/city, and sub-district of first registration; the next six encode date of birth (with 40 added to the day-of-month digits for a female holder, e.g. day 10 becomes 50); the final four digits are a sequence number disambiguating same-day-same-subdistrict registrations. No published check digit.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <IndonesiaNomorIndukKependudukanView label="Nomor Induk Kependudukan (NIK)" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Indonesia

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

<!-- IndonesiaNomorIndukKependudukanView.svelte -->
<span
    class={`indonesia-nomor-induk-kependudukan-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
