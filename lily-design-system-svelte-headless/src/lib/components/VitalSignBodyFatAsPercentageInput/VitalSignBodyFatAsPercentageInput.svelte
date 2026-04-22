<script lang="ts">
    // VitalSignBodyFatAsPercentageInput component
    //
    // A headless numeric input for entering a body fat percentage (BFP) value.
    // Wraps a native <input type="number"> element with accessible labelling and
    // sensible defaults for body fat percentage entry (min 0, max 100, step 0.1). It provides
    // a bindable numeric value for two-way data flow. Commonly used in patient
    // intake forms, health assessments, fitness applications, clinical records,
    // and medical applications.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the input via aria-label.
    //   value — number | undefined, default undefined. Current body fat percentage value; bindable.
    //   min — number, default 0. Minimum allowed value.
    //   max — number, default 100. Maximum allowed value.
    //   step — number, default 0.1. Increment/decrement step size.
    //   required — boolean, default false. Whether the input is required.
    //   disabled — boolean, default false. Whether the input is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <VitalSignBodyFatAsPercentageInput label="Body fat percentage" bind:value />
    //
    // Examples:
    //   <!-- Basic body fat percentage input -->
    //   <VitalSignBodyFatAsPercentageInput label="Body fat percentage" bind:value />
    //
    //   <!-- Required body fat percentage input with custom range -->
    //   <VitalSignBodyFatAsPercentageInput label="Body fat percentage" bind:value min={5} max={60} required />
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
    //   - Companion to VitalSignBodyFatAsPercentageView for the Input/View pattern
    //
    // References:
    //   - HTML number input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
    //   - WAI-ARIA spinbutton role: https://www.w3.org/TR/wai-aria-1.2/#spinbutton

    let {
        class: className = "",
        label,
        value = $bindable(undefined),
        min = 0,
        max = 100,
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

<!-- VitalSignBodyFatAsPercentageInput.svelte -->
<input
    class={`vital-sign-body-fat-as-percentage-input ${className}`}
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
