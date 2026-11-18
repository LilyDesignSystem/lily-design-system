<script lang="ts">
    // GuatemalaCodigoUnicoDeIdentificacionInput component
    //
    // A headless input for entering Guatemala's Código Único de Identificación (CUI).
    // Format: Thirteen digits, written 4-5-4 on the DPI card: eight assigned in sequence, one check digit, then two for the department and two for the municipality of birth (RENAP). RENAP does not publish the check-digit formula; open-source validators use weights 2 to 9 over the first eight digits, modulo 11, but that is not confirmed by the registry.
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
    //   <GuatemalaCodigoUnicoDeIdentificacionInput label="Código Único de Identificación (CUI)" bind:value />
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
    //   - https://www.renap.gob.gt/sites/default/files/boletines-publicaciones/inforenap_163_-_08042021_-_que_es_el_cui.pdf

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
            "GuatemalaCodigoUnicoDeIdentificacionInput",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );
</script>

<!-- GuatemalaCodigoUnicoDeIdentificacionInput.svelte -->
<input
    class={`guatemala-codigo-unico-de-identificacion-input ${className}`}
    type="text"
    aria-label={label}
    autocomplete="off"
    spellcheck="false"
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
