<script lang="ts">
    // OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput component
    //
    // A headless input for entering Uzbekistan's Personal identification number (JShShIR / PINFL).
    // Format: Fourteen digits in five groups (Cabinet of Ministers Resolution No. 177 of 2022): a first digit from 1 to 6 for sex and century of birth, then groups for the date of birth and the issuing district, a three-digit sequence and a final check digit. The check-digit formula is not published, so check the length, the digits and the first digit's range.
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
    //   <OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput label="Personal identification number (JShShIR / PINFL)" bind:value />
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
    //   - https://kun.uz/en/news/2026/01/26/how-to-find-your-pinfl

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
            "OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );
</script>

<!-- OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput.svelte -->
<input
    class={`ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input ${className}`}
    type="text"
    aria-label={label}
    autocomplete="off"
    spellcheck="false"
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
