<script lang="ts">
    // VitalSignBloodPressureDiastolicAsMmhgView component
    //
    // A read-only display of a diastolic blood pressure value in millimeters of
    // mercury (mmHg). This is a passive view element used for showing vital sign
    // readings in patient monitors, health dashboards, medical records, and
    // clinical applications. Screen readers receive the full description via
    // aria-label.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — number, required. Diastolic blood pressure value in mmHg to display.
    //   label — string, required. Accessible description via aria-label (e.g., "80 mmHg diastolic").
    //   ...restProps — additional HTML attributes spread onto the outer span.
    //
    // Syntax:
    //   <VitalSignBloodPressureDiastolicAsMmhgView value={80} label="80 mmHg diastolic" />
    //
    // Examples:
    //   <!-- Display a normal diastolic blood pressure -->
    //   <VitalSignBloodPressureDiastolicAsMmhgView value={80} label="80 mmHg diastolic" />
    //
    //   <!-- Display an elevated diastolic blood pressure -->
    //   <VitalSignBloodPressureDiastolicAsMmhgView value={95} label="95 mmHg diastolic" />
    //
    // Keyboard:
    //   - None — this is a passive, read-only display element
    //
    // Accessibility:
    //   - role="img" on the span indicates it represents a visual/graphic element
    //   - aria-label provides the full diastolic blood pressure description for screen readers
    //   - data-value attribute enables consumer CSS styling based on the numeric value
    //
    // Internationalization:
    //   - The label prop allows localized blood pressure descriptions
    //   - No hardcoded user-facing strings; all text comes through props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Companion to VitalSignBloodPressureDiastolicAsMmhgInput for the Input/View pattern
    //
    // References:
    //   - WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/

    let {
        class: className = "",
        value,
        label,
        ...restProps
    }: {
        /** Diastolic blood pressure value in mmHg. */
        value: number;
        /** Accessible description. */
        label: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- VitalSignBloodPressureDiastolicAsMmhgView.svelte -->
<span
    class={`vital-sign-blood-pressure-diastolic-as-mmhg-view ${className}`}
    role="img"
    aria-label={label}
    data-value={value}
    {...restProps}
>{value}</span>
