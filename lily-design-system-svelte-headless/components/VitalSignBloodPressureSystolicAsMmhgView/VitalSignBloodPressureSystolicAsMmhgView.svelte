<script lang="ts">
    // VitalSignBloodPressureSystolicAsMmhgView component
    //
    // A read-only display of a systolic blood pressure value in millimeters of
    // mercury (mmHg). This is a passive view element used for showing vital sign
    // readings in patient monitors, health dashboards, medical records, and
    // clinical applications. Screen readers receive the full description via
    // aria-label.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — number, required. Systolic blood pressure value in mmHg to display.
    //   label — string, required. Accessible description via aria-label (e.g., "120 mmHg systolic").
    //   ...restProps — additional HTML attributes spread onto the outer span.
    //
    // Syntax:
    //   <VitalSignBloodPressureSystolicAsMmhgView value={120} label="120 mmHg systolic" />
    //
    // Examples:
    //   <!-- Display a normal systolic blood pressure -->
    //   <VitalSignBloodPressureSystolicAsMmhgView value={120} label="120 mmHg systolic" />
    //
    //   <!-- Display an elevated systolic blood pressure -->
    //   <VitalSignBloodPressureSystolicAsMmhgView value={140} label="140 mmHg systolic" />
    //
    // Keyboard:
    //   - None — this is a passive, read-only display element
    //
    // Accessibility:
    //   - role="img" on the span indicates it represents a visual/graphic element
    //   - aria-label provides the full systolic blood pressure description for screen readers
    //   - data-value attribute enables consumer CSS styling based on the numeric value
    //
    // Internationalization:
    //   - The label prop allows localized blood pressure descriptions
    //   - No hardcoded user-facing strings; all text comes through props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Companion to VitalSignBloodPressureSystolicAsMmhgInput for the Input/View pattern
    //
    // References:
    //   - WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/

    let {
        class: className = "",
        value,
        label,
        ...restProps
    }: {
        /** Systolic blood pressure value in mmHg. */
        value: number;
        /** Accessible description. */
        label: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- VitalSignBloodPressureSystolicAsMmhgView.svelte -->
<span
    class={`vital-sign-blood-pressure-systolic-as-mmhg-view ${className}`}
    role="img"
    aria-label={label}
    data-value={value}
    {...restProps}
>{value}</span>
