<script lang="ts">
    // OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView component
    //
    // A headless display component for showing Uzbekistan's
    // Personal identification number (JShShIR / PINFL) in a read-only format.
    // Format: Fourteen digits in five groups (Cabinet of Ministers Resolution No. 177 of 2022): a first digit from 1 to 6 for sex and century of birth, then groups for the date of birth and the issuing district, a three-digit sequence and a final check digit. The check-digit formula is not published, so check the length, the digits and the first digit's range.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView label="Personal identification number (JShShIR / PINFL)" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://kun.uz/en/news/2026/01/26/how-to-find-your-pinfl

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

<!-- OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView.svelte -->
<span
    class={`ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
