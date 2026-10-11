<script lang="ts">
    // UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView component
    //
    // A headless display component for showing Ukraine's
    // Реєстраційний номер облікової картки платника податків (РНОКПП) in a read-only format.
    // Format: Ten digits. The first five encode date of birth as the number of days elapsed since 1 January 1900; the next four are a registration sequence number, whose own last digit's parity encodes sex (odd male, even female); the tenth digit is a check digit computed with a weighted-sum algorithm over the first nine digits.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView label="Реєстраційний номер облікової картки платника податків (РНОКПП)" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Taxpayer_Identification_Number

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

<!-- UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView.svelte -->
<span
    class={`ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
