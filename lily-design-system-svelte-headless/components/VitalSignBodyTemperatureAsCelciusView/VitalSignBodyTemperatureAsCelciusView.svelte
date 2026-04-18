<script lang="ts">
    // VitalSignBodyTemperatureAsCelciusView component
    //
    // A read-only display of a body temperature value in degrees Celsius. This is a
    // passive view element used for showing vital sign readings in patient monitors,
    // health dashboards, medical records, and clinical applications. Screen readers
    // receive the full description via aria-label.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — number, required. Body temperature value in degrees Celsius to display.
    //   label — string, required. Accessible description via aria-label (e.g., "Body temperature: 37.0 degrees Celsius").
    //   ...restProps — additional HTML attributes spread onto the outer span.
    //
    // Syntax:
    //   <VitalSignBodyTemperatureAsCelciusView value={37.0} label="Body temperature: 37.0 degrees Celsius" />
    //
    // Examples:
    //   <!-- Display a normal body temperature -->
    //   <VitalSignBodyTemperatureAsCelciusView value={37.0} label="Body temperature: 37.0 degrees Celsius" />
    //
    //   <!-- Display an elevated body temperature -->
    //   <VitalSignBodyTemperatureAsCelciusView value={38.5} label="Body temperature: 38.5 degrees Celsius" />
    //
    // Keyboard:
    //   - None — this is a passive, read-only display element
    //
    // Accessibility:
    //   - role="img" on the span indicates it represents a visual/graphic element
    //   - aria-label provides the full body temperature description for screen readers
    //   - data-value attribute enables consumer CSS styling based on the numeric value
    //
    // Internationalization:
    //   - The label prop allows localized body temperature descriptions
    //   - No hardcoded user-facing strings; all text comes through props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Companion to VitalSignBodyTemperatureAsCelciusInput for the Input/View pattern
    //
    // References:
    //   - WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/

    let {
        class: className = "",
        value,
        label,
        ...restProps
    }: {
        /** Body temperature value in degrees Celsius. */
        value: number;
        /** Accessible description. */
        label: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- VitalSignBodyTemperatureAsCelciusView.svelte -->
<span
    class={`vital-sign-body-temperature-as-celcius-view ${className}`}
    role="img"
    aria-label={label}
    data-value={value}
    {...restProps}
>{value}</span>
