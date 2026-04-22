<script lang="ts">
    // VitalSignWaistCircumferenceAsCmView component
    //
    // A read-only display of a waist circumference value in centimeters. This is a
    // passive view element used for showing vital sign readings in patient monitors,
    // health dashboards, medical records, and fitness applications. Screen readers
    // receive the full description via aria-label.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — number, required. Waist circumference value in centimeters to display.
    //   label — string, required. Accessible description via aria-label (e.g., "94 cm waist circumference").
    //   ...restProps — additional HTML attributes spread onto the outer span.
    //
    // Syntax:
    //   <VitalSignWaistCircumferenceAsCmView value={94} label="94 cm waist circumference" />
    //
    // Examples:
    //   <!-- Display a normal waist circumference -->
    //   <VitalSignWaistCircumferenceAsCmView value={80} label="80 cm waist circumference" />
    //
    //   <!-- Display an elevated waist circumference -->
    //   <VitalSignWaistCircumferenceAsCmView value={110} label="110 cm waist circumference" />
    //
    // Keyboard:
    //   - None — this is a passive, read-only display element
    //
    // Accessibility:
    //   - role="img" on the span indicates it represents a visual/graphic element
    //   - aria-label provides the full waist circumference description for screen readers
    //   - data-value attribute enables consumer CSS styling based on the numeric value
    //
    // Internationalization:
    //   - The label prop allows localized waist circumference descriptions
    //   - No hardcoded user-facing strings; all text comes through props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Companion to VitalSignWaistCircumferenceAsCmInput for the Input/View pattern
    //
    // References:
    //   - WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/

    let {
        class: className = "",
        value,
        label,
        ...restProps
    }: {
        /** Waist circumference value in centimeters. */
        value: number;
        /** Accessible description. */
        label: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- VitalSignWaistCircumferenceAsCmView.svelte -->
<span
    class={`vital-sign-waist-circumference-as-cm-view ${className}`}
    role="img"
    aria-label={label}
    data-value={value}
    {...restProps}
>{value}</span>
