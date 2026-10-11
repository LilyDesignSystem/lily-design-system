<script lang="ts">
    // OsterreichSozialversicherungsnummerInput component
    //
    // A headless input for entering Austria's Sozialversicherungsnummer (SVNR).
    // Format: Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number (the first not zero) followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY). If the Modulus-11 remainder is 10, the serial number is incremented by one and the check digit recalculated.
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
    //   <OsterreichSozialversicherungsnummerInput label="Sozialversicherungsnummer (SVNR)" bind:value />
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
    //   - https://de.wikipedia.org/wiki/Sozialversicherungsnummer

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
</script>

<!-- OsterreichSozialversicherungsnummerInput.svelte -->
<input
    class={`osterreich-sozialversicherungsnummer-input ${className}`}
    type="text"
    aria-label={label}
    autocomplete="off"
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
