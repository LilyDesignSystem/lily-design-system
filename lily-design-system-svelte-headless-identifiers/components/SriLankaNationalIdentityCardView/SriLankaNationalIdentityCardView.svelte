<script lang="ts">
    // SriLankaNationalIdentityCardView component
    //
    // A headless display component for showing Sri Lanka's
    // National Identity Card (NIC) number in a read-only format.
    // Format: Two forms. Before 2016: nine digits and a letter, V or X (742192757V): the two-digit year of birth, the day of the year (with 500 added for women), a serial and a check digit. Since 2016: twelve digits (197419202757): the four-digit year of birth, the same day of the year, a four-digit serial and the check digit. The check-digit algorithm is not published.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <SriLankaNationalIdentityCardView label="National Identity Card (NIC) number" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identity_card_(Sri_Lanka)

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

<!-- SriLankaNationalIdentityCardView.svelte -->
<span
    class={`sri-lanka-national-identity-card-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
