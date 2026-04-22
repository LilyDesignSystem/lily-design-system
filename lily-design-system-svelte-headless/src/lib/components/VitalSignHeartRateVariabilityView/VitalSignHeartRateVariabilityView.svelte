<script lang="ts">
    // VitalSignHeartRateVariabilityView component
    //
    // A read-only display of a heart rate variability (HRV) value in milliseconds.
    // This is a passive view element used for showing vital sign readings in patient
    // monitors, health dashboards, medical records, and fitness applications. Screen
    // readers receive the full description via aria-label.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — number, required. Heart rate variability value in milliseconds to display.
    //   label — string, required. Accessible description via aria-label (e.g., "HRV: 45 milliseconds").
    //   ...restProps — additional HTML attributes spread onto the outer span.
    //
    // Syntax:
    //   <VitalSignHeartRateVariabilityView value={45} label="HRV: 45 milliseconds" />
    //
    // Examples:
    //   <!-- Display a normal HRV reading -->
    //   <VitalSignHeartRateVariabilityView value={45} label="HRV: 45 milliseconds" />
    //
    //   <!-- Display a high HRV reading -->
    //   <VitalSignHeartRateVariabilityView value={120} label="HRV: 120 milliseconds" />
    //
    // Keyboard:
    //   - None — this is a passive, read-only display element
    //
    // Accessibility:
    //   - role="img" on the span indicates it represents a visual/graphic element
    //   - aria-label provides the full HRV description for screen readers
    //   - data-value attribute enables consumer CSS styling based on the numeric value
    //
    // Internationalization:
    //   - The label prop allows localized HRV descriptions
    //   - No hardcoded user-facing strings; all text comes through props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Companion to VitalSignHeartRateVariabilityInput for the Input/View pattern
    //
    // References:
    //   - WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/

    let {
        class: className = "",
        value,
        label,
        ...restProps
    }: {
        /** Heart rate variability value in milliseconds. */
        value: number;
        /** Accessible description. */
        label: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- VitalSignHeartRateVariabilityView.svelte -->
<span
    class={`vital-sign-heart-rate-variability-view ${className}`}
    role="img"
    aria-label={label}
    data-value={value}
    {...restProps}
>{value}</span>
