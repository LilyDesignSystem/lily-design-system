<script lang="ts">
    // VitalSignRespiratoryRateAsBreathsPerMinuteView component
    //
    // A read-only display of a respiratory rate value in breaths per minute. This is a
    // passive view element used for showing vital sign readings in patient monitors,
    // health dashboards, medical records, and fitness applications. Screen readers
    // receive the full description via aria-label.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — number, required. Respiratory rate value in breaths per minute to display.
    //   label — string, required. Accessible description via aria-label (e.g., "Respiratory rate: 16 breaths per minute").
    //   ...restProps — additional HTML attributes spread onto the outer span.
    //
    // Syntax:
    //   <VitalSignRespiratoryRateAsBreathsPerMinuteView value={16} label="Respiratory rate: 16 breaths per minute" />
    //
    // Examples:
    //   <!-- Display a normal resting respiratory rate -->
    //   <VitalSignRespiratoryRateAsBreathsPerMinuteView value={16} label="Respiratory rate: 16 breaths per minute" />
    //
    //   <!-- Display an elevated respiratory rate -->
    //   <VitalSignRespiratoryRateAsBreathsPerMinuteView value={28} label="Respiratory rate: 28 breaths per minute" />
    //
    // Keyboard:
    //   - None — this is a passive, read-only display element
    //
    // Accessibility:
    //   - role="img" on the span indicates it represents a visual/graphic element
    //   - aria-label provides the full respiratory rate description for screen readers
    //   - data-value attribute enables consumer CSS styling based on the numeric value
    //
    // Internationalization:
    //   - The label prop allows localized respiratory rate descriptions
    //   - No hardcoded user-facing strings; all text comes through props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Companion to VitalSignRespiratoryRateAsBreathsPerMinuteInput for the Input/View pattern
    //
    // References:
    //   - WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/

    let {
        class: className = "",
        value,
        label,
        ...restProps
    }: {
        /** Respiratory rate value in breaths per minute. */
        value: number;
        /** Accessible description. */
        label: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- VitalSignRespiratoryRateAsBreathsPerMinuteView.svelte -->
<span
    class={`vital-sign-respiratory-rate-as-breaths-per-minute-view ${className}`}
    role="img"
    aria-label={label}
    data-value={value}
    {...restProps}
>{value}</span>
