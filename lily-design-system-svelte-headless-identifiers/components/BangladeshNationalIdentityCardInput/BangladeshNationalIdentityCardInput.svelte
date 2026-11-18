<script lang="ts">
    // BangladeshNationalIdentityCardInput component
    //
    // A headless input for entering Bangladesh's National ID (NID) number.
    // Format: Three lengths are in use: 13 digits on the older laminated cards, 17 digits (the 13-digit number with the four-digit year of birth in front) and 10 digits on the smart card since 2016, nine of them random and the last a check digit whose algorithm is not published. Accept all three lengths.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". Bindable input value; supports bind:value.
    //   required — boolean, default false. Whether the input is required for form submission.
    //   disabled — boolean, default false. Whether the input is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <BangladeshNationalIdentityCardInput label="National ID (NID) number" bind:value />
    //
    // Accessibility:
    //   - aria-label provides the accessible name for screen readers
    //   - autocomplete="off" protects sensitive identifiers
    //   - required and disabled states are conveyed to assistive technology
    //
    // Internationalization:
    //   - The label prop externalizes user-facing text for translation
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identity_card_(Bangladesh)

    import { warnMissingName } from "../dev-warning";

    let {
        class: className = "",
        label,
        value = $bindable(""),
        required = false,
        disabled = false,
        ...restProps
    }: {
        label: string;
        value?: string;
        required?: boolean;
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName(
            "BangladeshNationalIdentityCardInput",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );
</script>

<!-- BangladeshNationalIdentityCardInput.svelte -->
<input
    class={`bangladesh-national-identity-card-input ${className}`}
    type="text"
    aria-label={label}
    autocomplete="off"
    spellcheck="false"
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
