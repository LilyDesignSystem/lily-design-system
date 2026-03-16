<script lang="ts">
    // VitalSignBellyCircumferenceAsCmInput component
    //
    // A headless numeric input for entering a belly circumference value in centimeters.
    // Wraps a native <input type="number"> element with accessible labelling and
    // sensible defaults for belly circumference entry (min 0, max 300, step 1).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the input via aria-label.
    //   value — number | undefined, default undefined. Current belly circumference value; bindable.
    //   min — number, default 0. Minimum allowed value.
    //   max — number, default 300. Maximum allowed value.
    //   step — number, default 1. Increment/decrement step size.
    //   required — boolean, default false. Whether the input is required.
    //   disabled — boolean, default false. Whether the input is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <VitalSignBellyCircumferenceAsCmInput label="Belly circumference (cm)" bind:value />
    //
    // Keyboard:
    //   - Up Arrow: increment value by step (native browser behavior)
    //   - Down Arrow: decrement value by step (native browser behavior)
    //
    // Accessibility:
    //   - aria-label provides an accessible name describing the input purpose
    //   - Implicit spinbutton role from <input type="number">
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses $bindable(undefined) for value, not $bindable(0)
    //   - Do not wrap in a <div> — renders a bare <input> element
    //   - Companion to VitalSignBellyCircumferenceAsCmView for the Input/View pattern

    let {
        class: className = "",
        label,
        value = $bindable(undefined),
        min = 0,
        max = 300,
        step = 1,
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

<!-- VitalSignBellyCircumferenceAsCmInput.svelte -->
<input
    class={`vital-sign-belly-circumference-as-cm-input ${className}`}
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
