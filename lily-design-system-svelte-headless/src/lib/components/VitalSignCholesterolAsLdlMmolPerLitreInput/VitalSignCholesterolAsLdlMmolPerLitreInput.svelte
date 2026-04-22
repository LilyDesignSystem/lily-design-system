<script lang="ts">
    // VitalSignCholesterolAsLdlMmolPerLitreInput component
    //
    // A headless numeric input for entering an LDL cholesterol value in millimoles
    // per litre. Wraps a native <input type="number"> element with accessible
    // labelling and sensible defaults for LDL cholesterol entry (min 0, max 10,
    // step 0.1). It provides a bindable numeric value for two-way data flow.
    // Commonly used in patient intake forms, health assessments, clinical records,
    // and medical applications.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the input via aria-label.
    //   value — number | undefined, default undefined. Current LDL cholesterol value; bindable.
    //   min — number, default 0. Minimum allowed value.
    //   max — number, default 10. Maximum allowed value.
    //   step — number, default 0.1. Increment/decrement step size.
    //   required — boolean, default false. Whether the input is required.
    //   disabled — boolean, default false. Whether the input is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <VitalSignCholesterolAsLdlMmolPerLitreInput label="LDL cholesterol (mmol/L)" bind:value />
    //
    // Examples:
    //   <!-- Basic LDL cholesterol input -->
    //   <VitalSignCholesterolAsLdlMmolPerLitreInput label="LDL cholesterol (mmol/L)" bind:value />
    //
    //   <!-- Required LDL cholesterol input with custom range -->
    //   <VitalSignCholesterolAsLdlMmolPerLitreInput label="LDL cholesterol (mmol/L)" bind:value min={0.5} max={8} required />
    //
    // Keyboard:
    //   - Up Arrow: increment value by step (native browser behavior)
    //   - Down Arrow: decrement value by step (native browser behavior)
    //
    // Accessibility:
    //   - aria-label provides an accessible name describing the input purpose
    //   - Implicit spinbutton role from <input type="number">
    //   - Native validation via min, max, and step attributes
    //
    // Internationalization:
    //   - The label prop is the only user-facing text; no hardcoded strings
    //   - Consumer can pass placeholder via restProps for localized hint text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses $bindable(undefined) for value, not $bindable(0)
    //   - Do not wrap in a <div> — renders a bare <input> element
    //   - Companion to VitalSignCholesterolAsLdlMmolPerLitreView for the Input/View pattern
    //
    // References:
    //   - HTML number input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
    //   - WAI-ARIA spinbutton role: https://www.w3.org/TR/wai-aria-1.2/#spinbutton

    let {
        class: className = "",
        label,
        value = $bindable(undefined),
        min = 0,
        max = 10,
        step = 0.1,
        required = false,
        disabled = false,
        ...restProps
    }: {
        label: string;
        value?: number | undefined;
        min?: number;
        max?: number;
        step?: number;
        required?: boolean;
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();
</script>

<!-- VitalSignCholesterolAsLdlMmolPerLitreInput.svelte -->
<input
    class={`vital-sign-cholesterol-as-ldl-mmol-per-litre-input ${className}`}
    type="number"
    aria-label={label}
    bind:value
    {min}
    {max}
    {step}
    {required}
    {disabled}
    {...restProps}
/>
