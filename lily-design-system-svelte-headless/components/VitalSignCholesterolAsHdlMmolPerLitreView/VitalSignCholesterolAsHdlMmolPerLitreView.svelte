<script lang="ts">
    // VitalSignCholesterolAsHdlMmolPerLitreView component
    //
    // A read-only display of an HDL cholesterol value in millimoles per litre. This
    // is a passive view element used for showing vital sign readings in patient
    // monitors, health dashboards, medical records, and clinical applications.
    // Screen readers receive the full description via aria-label.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — number, required. HDL cholesterol value in mmol/L to display.
    //   label — string, required. Accessible description via aria-label (e.g., "1.5 mmol/L HDL cholesterol").
    //   ...restProps — additional HTML attributes spread onto the outer span.
    //
    // Syntax:
    //   <VitalSignCholesterolAsHdlMmolPerLitreView value={1.5} label="1.5 mmol/L HDL cholesterol" />
    //
    // Examples:
    //   <!-- Display a normal HDL cholesterol level -->
    //   <VitalSignCholesterolAsHdlMmolPerLitreView value={1.5} label="1.5 mmol/L HDL cholesterol" />
    //
    //   <!-- Display a low HDL cholesterol level -->
    //   <VitalSignCholesterolAsHdlMmolPerLitreView value={0.8} label="0.8 mmol/L HDL cholesterol" />
    //
    // Keyboard:
    //   - None — this is a passive, read-only display element
    //
    // Accessibility:
    //   - role="img" on the span indicates it represents a visual/graphic element
    //   - aria-label provides the full HDL cholesterol description for screen readers
    //   - data-value attribute enables consumer CSS styling based on the numeric value
    //
    // Internationalization:
    //   - The label prop allows localized HDL cholesterol descriptions
    //   - No hardcoded user-facing strings; all text comes through props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Companion to VitalSignCholesterolAsHdlMmolPerLitreInput for the Input/View pattern
    //
    // References:
    //   - WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/

    let {
        class: className = "",
        value,
        label,
        ...restProps
    }: {
        /** HDL cholesterol value in mmol/L. */
        value: number;
        /** Accessible description. */
        label: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- VitalSignCholesterolAsHdlMmolPerLitreView.svelte -->
<span
    class={`vital-sign-cholesterol-as-hdl-mmol-per-litre-view ${className}`}
    role="img"
    aria-label={label}
    data-value={value}
    {...restProps}
>{value}</span>
