<script lang="ts">
    // RepublicaDominicanaCedulaDeIdentidadYElectoralInput component
    //
    // A headless input for entering the Dominican Republic's Cédula de Identidad y Electoral.
    // Format: Eleven digits, usually written 3-7-1 (001-1391820-5): a three-digit issuing office, a seven-digit sequence and a check digit computed with the Luhn algorithm over all eleven digits. A few early numbers fail the check and are still valid, so treat a Luhn failure as a warning, not a rejection.
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
    //   <RepublicaDominicanaCedulaDeIdentidadYElectoralInput label="Cédula de Identidad y Electoral" bind:value />
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
    //   - https://es.wikipedia.org/wiki/Junta_Central_Electoral_(Rep%C3%BAblica_Dominicana)

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
            "RepublicaDominicanaCedulaDeIdentidadYElectoralInput",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );
</script>

<!-- RepublicaDominicanaCedulaDeIdentidadYElectoralInput.svelte -->
<input
    class={`republica-dominicana-cedula-de-identidad-y-electoral-input ${className}`}
    type="text"
    aria-label={label}
    autocomplete="off"
    spellcheck="false"
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
