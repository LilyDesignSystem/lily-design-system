<script lang="ts">
    // MauritiusNationalIdentityCardNumberView component
    //
    // A headless display component for showing Mauritius's
    // National Identity Card number in a read-only format.
    // Format: Fourteen characters: the first letter of the surname at birth, the date of birth as DDMMYY, a six-digit serial and a check character. The check character comes from the alphabet 0-9A-Z: sum each of the first thirteen characters' positions in that alphabet times the weights 14 down to 2, and take the character at (17 - sum) modulo 17.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <MauritiusNationalIdentityCardNumberView label="National Identity Card number" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.mu.nid

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

<!-- MauritiusNationalIdentityCardNumberView.svelte -->
<span
    class={`mauritius-national-identity-card-number-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
