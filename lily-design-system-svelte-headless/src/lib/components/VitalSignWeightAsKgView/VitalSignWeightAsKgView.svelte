<script lang="ts">
    // VitalSignWeightAsKgView component
    //
    // A read-only display of a weight value in kilograms. This is a
    // passive view element used for showing vital sign readings in patient monitors,
    // health dashboards, medical records, and fitness applications. Screen readers
    // receive the full description via aria-label.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — number, required. Weight value in kilograms to display.
    //   label — string, required. Accessible description via aria-label (e.g., "75 kg weight").
    //   ...restProps — additional HTML attributes spread onto the outer span.
    //
    // Syntax:
    //   <VitalSignWeightAsKgView value={75} label="75 kg weight" />
    //
    // Examples:
    //   <!-- Display a normal weight -->
    //   <VitalSignWeightAsKgView value={70} label="70 kg weight" />
    //
    //   <!-- Display a heavy weight -->
    //   <VitalSignWeightAsKgView value={120} label="120 kg weight" />
    //
    // Keyboard:
    //   - None — this is a passive, read-only display element
    //
    // Accessibility:
    //   - role="img" on the span indicates it represents a visual/graphic element
    //   - aria-label provides the full weight description for screen readers
    //   - data-value attribute enables consumer CSS styling based on the numeric value
    //
    // Internationalization:
    //   - The label prop allows localized weight descriptions
    //   - No hardcoded user-facing strings; all text comes through props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Companion to VitalSignWeightAsKgInput for the Input/View pattern
    //
    // References:
    //   - WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/

    let {
        class: className = "",
        value,
        label,
        ...restProps
    }: {
        /** Weight value in kilograms. */
        value: number;
        /** Accessible description. */
        label: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- VitalSignWeightAsKgView.svelte -->
<span
    class={`vital-sign-weight-as-kg-view ${className}`}
    role="img"
    aria-label={label}
    data-value={value}
    {...restProps}
>{value}</span>
