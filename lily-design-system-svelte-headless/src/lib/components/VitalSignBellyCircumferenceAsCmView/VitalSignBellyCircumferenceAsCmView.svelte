<script lang="ts">
    // VitalSignBellyCircumferenceAsCmView component
    //
    // A read-only display of a belly circumference value in centimeters. This is a
    // passive view element used for showing vital sign readings in patient monitors,
    // health dashboards, medical records, and fitness applications. Screen readers
    // receive the full description via aria-label.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — number, required. Belly circumference value in centimeters to display.
    //   label — string, required. Accessible description via aria-label.
    //   ...restProps — additional HTML attributes spread onto the outer span.
    //
    // Syntax:
    //   <VitalSignBellyCircumferenceAsCmView value={90} label="90 cm belly circumference" />
    //
    // Keyboard:
    //   - None — this is a passive, read-only display element
    //
    // Accessibility:
    //   - role="img" on the span indicates it represents a visual/graphic element
    //   - aria-label provides the full belly circumference description for screen readers
    //   - data-value attribute enables consumer CSS styling based on the numeric value
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Companion to VitalSignBellyCircumferenceAsCmInput for the Input/View pattern

    let {
        class: className = "",
        value,
        label,
        ...restProps
    }: {
        /** Belly circumference value in centimeters. */
        value: number;
        /** Accessible description. */
        label: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- VitalSignBellyCircumferenceAsCmView.svelte -->
<span
    class={`vital-sign-belly-circumference-as-cm-view ${className}`}
    role="img"
    aria-label={label}
    data-value={value}
    {...restProps}
>{value}</span>
