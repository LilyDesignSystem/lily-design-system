<script lang="ts">
    // YisraelTeudatZehutView component
    //
    // A headless display component for showing Israel's
    // Teudat Zehut (תעודת זהות) in a read-only format.
    // Format: Nine digits (left-padded with zeros when shorter), with the ninth a Luhn (Modulus-10) check digit: digits alternate between weights of 1 and 2 from the left, any doubled product over 9 has its own two digits summed, and the total must be a multiple of 10.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <YisraelTeudatZehutView label="Teudat Zehut (תעודת זהות)" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Israeli_identity_card

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

<!-- YisraelTeudatZehutView.svelte -->
<span
    class={`yisrael-teudat-zehut-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
