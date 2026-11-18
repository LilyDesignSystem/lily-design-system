<script lang="ts">
    // AlImaratRaqmAlHuwiyahView component
    //
    // A headless display component for showing the United Arab Emirates'
    // Emirates ID number in a read-only format.
    // Format: Fifteen digits, written 784-YYYY-NNNNNNN-C: 784 (the country's ISO numeric code), four digits that are usually but not always the year of birth, a seven-digit serial and a check digit. Vendors document a Luhn check over the fifteen digits; the issuer does not publish it, so treat a failure as a warning.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <AlImaratRaqmAlHuwiyahView label="Emirates ID number" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Emirates_ID

    let {
        class: className = "",
        label,
        value = "",
        ...restProps
    }: {
        label?: string;
        value?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- AlImaratRaqmAlHuwiyahView.svelte -->
<span
    class={`al-imarat-raqm-al-huwiyah-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
