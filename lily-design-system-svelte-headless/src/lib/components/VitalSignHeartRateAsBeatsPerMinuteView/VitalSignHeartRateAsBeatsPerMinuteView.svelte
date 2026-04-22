<script lang="ts">
    // VitalSignHeartRateAsBeatsPerMinuteView component
    //
    // A read-only display of a heart rate value in beats per minute. This is a
    // passive view element used for showing vital sign readings in patient monitors,
    // health dashboards, medical records, and fitness applications. Screen readers
    // receive the full description via aria-label.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — number, required. Heart rate value in beats per minute to display.
    //   label — string, required. Accessible description via aria-label (e.g., "Heart rate: 72 beats per minute").
    //   ...restProps — additional HTML attributes spread onto the outer span.
    //
    // Syntax:
    //   <VitalSignHeartRateAsBeatsPerMinuteView value={72} label="Heart rate: 72 beats per minute" />
    //
    // Examples:
    //   <!-- Display a normal resting heart rate -->
    //   <VitalSignHeartRateAsBeatsPerMinuteView value={72} label="Heart rate: 72 beats per minute" />
    //
    //   <!-- Display an elevated heart rate -->
    //   <VitalSignHeartRateAsBeatsPerMinuteView value={110} label="Heart rate: 110 beats per minute" />
    //
    // Keyboard:
    //   - None — this is a passive, read-only display element
    //
    // Accessibility:
    //   - role="img" on the span indicates it represents a visual/graphic element
    //   - aria-label provides the full heart rate description for screen readers
    //   - data-value attribute enables consumer CSS styling based on the numeric value
    //
    // Internationalization:
    //   - The label prop allows localized heart rate descriptions
    //   - No hardcoded user-facing strings; all text comes through props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Companion to VitalSignHeartRateAsBeatsPerMinuteInput for the Input/View pattern
    //
    // References:
    //   - WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/

    let {
        class: className = "",
        value,
        label,
        ...restProps
    }: {
        /** Heart rate value in beats per minute. */
        value: number;
        /** Accessible description. */
        label: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- VitalSignHeartRateAsBeatsPerMinuteView.svelte -->
<span
    class={`vital-sign-heart-rate-as-beats-per-minute-view ${className}`}
    role="img"
    aria-label={label}
    data-value={value}
    {...restProps}
>{value}</span>
