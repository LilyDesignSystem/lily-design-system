<script lang="ts">
    // VitalSignCholesterolAsLdlMmolPerLitreView component
    //
    // A read-only display of an LDL cholesterol value in millimoles per litre. This
    // is a passive view element used for showing vital sign readings in patient
    // monitors, health dashboards, medical records, and clinical applications.
    // Screen readers receive the full description via aria-label.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — number, required. LDL cholesterol value in mmol/L to display.
    //   label — string, required. Accessible description via aria-label (e.g., "2.5 mmol/L LDL cholesterol").
    //   ...restProps — additional HTML attributes spread onto the outer span.
    //
    // Syntax:
    //   <VitalSignCholesterolAsLdlMmolPerLitreView value={2.5} label="2.5 mmol/L LDL cholesterol" />
    //
    // Examples:
    //   <!-- Display a normal LDL cholesterol level -->
    //   <VitalSignCholesterolAsLdlMmolPerLitreView value={2.5} label="2.5 mmol/L LDL cholesterol" />
    //
    //   <!-- Display an elevated LDL cholesterol level -->
    //   <VitalSignCholesterolAsLdlMmolPerLitreView value={4.2} label="4.2 mmol/L LDL cholesterol" />
    //
    // Keyboard:
    //   - None — this is a passive, read-only display element
    //
    // Accessibility:
    //   - role="img" on the span indicates it represents a visual/graphic element
    //   - aria-label provides the full LDL cholesterol description for screen readers
    //   - data-value attribute enables consumer CSS styling based on the numeric value
    //
    // Internationalization:
    //   - The label prop allows localized LDL cholesterol descriptions
    //   - No hardcoded user-facing strings; all text comes through props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Companion to VitalSignCholesterolAsLdlMmolPerLitreInput for the Input/View pattern
    //
    // References:
    //   - WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/

    let {
        class: className = "",
        value,
        label,
        ...restProps
    }: {
        /** LDL cholesterol value in mmol/L. */
        value: number;
        /** Accessible description. */
        label: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- VitalSignCholesterolAsLdlMmolPerLitreView.svelte -->
<span
    class={`vital-sign-cholesterol-as-ldl-mmol-per-litre-view ${className}`}
    role="img"
    aria-label={label}
    data-value={value}
    {...restProps}
>{value}</span>
