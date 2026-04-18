<script lang="ts">
    // VitalSignHeightAsCmView component
    //
    // A read-only display of a height value in centimeters. This is a
    // passive view element used for showing vital sign readings in patient monitors,
    // health dashboards, medical records, and fitness applications. Screen readers
    // receive the full description via aria-label.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — number, required. Height value in centimeters to display.
    //   label — string, required. Accessible description via aria-label (e.g., "175 cm height").
    //   ...restProps — additional HTML attributes spread onto the outer span.
    //
    // Syntax:
    //   <VitalSignHeightAsCmView value={175} label="175 cm height" />
    //
    // Examples:
    //   <!-- Display a normal height -->
    //   <VitalSignHeightAsCmView value={170} label="170 cm height" />
    //
    //   <!-- Display a tall height -->
    //   <VitalSignHeightAsCmView value={195} label="195 cm height" />
    //
    // Keyboard:
    //   - None — this is a passive, read-only display element
    //
    // Accessibility:
    //   - role="img" on the span indicates it represents a visual/graphic element
    //   - aria-label provides the full height description for screen readers
    //   - data-value attribute enables consumer CSS styling based on the numeric value
    //
    // Internationalization:
    //   - The label prop allows localized height descriptions
    //   - No hardcoded user-facing strings; all text comes through props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Companion to VitalSignHeightAsCmInput for the Input/View pattern
    //
    // References:
    //   - WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/

    let {
        class: className = "",
        value,
        label,
        ...restProps
    }: {
        /** Height value in centimeters. */
        value: number;
        /** Accessible description. */
        label: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- VitalSignHeightAsCmView.svelte -->
<span
    class={`vital-sign-height-as-cm-view ${className}`}
    role="img"
    aria-label={label}
    data-value={value}
    {...restProps}
>{value}</span>
