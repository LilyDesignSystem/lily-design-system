<script lang="ts">
    // MisrAlRaqmAlQawmiView component
    //
    // A headless display component for showing Egypt's
    // الرقم القومي (Al-Raqm Al-Qawmi) in a read-only format.
    // Format: Fourteen digits. The first digit encodes century of birth (2 for 1900-1999, 3 for 2000-2099); the next six encode date of birth (YYMMDD); the next two encode governorate of birth/registration; the next four are a serial number whose own parity encodes sex (odd male, even female); the fourteenth digit is a check digit.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <MisrAlRaqmAlQawmiView label="الرقم القومي (Al-Raqm Al-Qawmi)" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Egyptian_National_Identity_Card

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

<!-- MisrAlRaqmAlQawmiView.svelte -->
<span
    class={`misr-al-raqm-al-qawmi-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
