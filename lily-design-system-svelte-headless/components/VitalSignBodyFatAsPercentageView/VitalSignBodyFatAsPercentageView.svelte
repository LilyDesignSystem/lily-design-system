<script lang="ts">
    // VitalSignBodyFatAsPercentageView component
    //
    // A read-only display of a body fat percentage (BFP) value. This is a
    // passive view element used for showing vital sign readings in patient monitors,
    // health dashboards, medical records, fitness applications, and clinical
    // applications. Screen readers receive the full description via aria-label.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — number, required. Body fat percentage value to display.
    //   label — string, required. Accessible description via aria-label (e.g., "22.5 percent body fat").
    //   ...restProps — additional HTML attributes spread onto the outer span.
    //
    // Syntax:
    //   <VitalSignBodyFatAsPercentageView value={22.5} label="22.5 percent body fat" />
    //
    // Examples:
    //   <!-- Display a normal body fat percentage -->
    //   <VitalSignBodyFatAsPercentageView value={22.5} label="22.5 percent body fat" />
    //
    //   <!-- Display an elevated body fat percentage -->
    //   <VitalSignBodyFatAsPercentageView value={35.0} label="35.0 percent body fat" />
    //
    // Keyboard:
    //   - None — this is a passive, read-only display element
    //
    // Accessibility:
    //   - role="img" on the span indicates it represents a visual/graphic element
    //   - aria-label provides the full body fat percentage description for screen readers
    //   - data-value attribute enables consumer CSS styling based on the numeric value
    //
    // Internationalization:
    //   - The label prop allows localized body fat percentage descriptions
    //   - No hardcoded user-facing strings; all text comes through props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Companion to VitalSignBodyFatAsPercentageInput for the Input/View pattern
    //
    // References:
    //   - WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/

    let {
        class: className = "",
        value,
        label,
        ...restProps
    }: {
        /** Body fat percentage value. */
        value: number;
        /** Accessible description. */
        label: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- VitalSignBodyFatAsPercentageView.svelte -->
<span
    class={`vital-sign-body-fat-as-percentage-view ${className}`}
    role="img"
    aria-label={label}
    data-value={value}
    {...restProps}
>{value}</span>
