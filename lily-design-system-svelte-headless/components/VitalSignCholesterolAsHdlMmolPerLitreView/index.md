# VitalSignCholesterolAsHdlMmolPerLitreView

A headless read-only display of an HDL ("good") cholesterol reading in millimoles per litre (mmol/L). It renders a semantic `<span>` with `role="img"`, `aria-label`, and `data-value`.

## What it is

A passive, unstyled view element for HDL cholesterol readings. Screen readers hear the full description via `aria-label`; sighted users see the numeric value.

## What it does

- Renders `<span role="img">` with `aria-label` from the `label` prop.
- Exposes the numeric value through `data-value={value}`.
- Renders the `value` as the visible text content.
- Spreads additional HTML attributes onto the `<span>`.

## When to use it

- Lab result summaries, patient health records, dashboards.
- Paired with `VitalSignCholesterolAsLdlMmolPerLitreView` to show a full lipid snapshot.
- Inside a `VitalSignGroupView` composition.

## When not to use it

- Capturing a new value — use `VitalSignCholesterolAsHdlMmolPerLitreInput`.
- Displaying LDL cholesterol — use `VitalSignCholesterolAsLdlMmolPerLitreView`.
- Rendering cholesterol in mg/dL — convert in the consumer; this component is mmol/L-native.

## How to use it

Pass the numeric `value` and a localized, descriptive `label`.

## Props

| Prop        | Type     | Default | Description                                                           |
| ----------- | -------- | ------- | --------------------------------------------------------------------- |
| `class`     | `string` | `""`    | Additional CSS class appended to the base class name.                 |
| `value`     | `number` | —       | Required. HDL cholesterol in mmol/L.                                  |
| `label`     | `string` | —       | Required. Accessible description via `aria-label`.                    |
| `...rest`   | —        | —       | Spread onto the `<span>`.                                             |

## Usage

```svelte
<script lang="ts">
    import VitalSignCholesterolAsHdlMmolPerLitreView from "./VitalSignCholesterolAsHdlMmolPerLitreView.svelte";
</script>

<VitalSignCholesterolAsHdlMmolPerLitreView
    value={1.4}
    label="HDL cholesterol: 1.4 millimoles per litre"
/>
```

```svelte
<script lang="ts">
    import VitalSignCholesterolAsHdlMmolPerLitreView from "./VitalSignCholesterolAsHdlMmolPerLitreView.svelte";

    const hdl = 1.8;
    const label = `HDL: ${hdl} mmol/L (optimal)`;
</script>

<VitalSignCholesterolAsHdlMmolPerLitreView value={hdl} {label} />
```

```svelte
<script lang="ts">
    import VitalSignCholesterolAsHdlMmolPerLitreView from "./VitalSignCholesterolAsHdlMmolPerLitreView.svelte";
    import VitalSignCholesterolAsLdlMmolPerLitreView from "../VitalSignCholesterolAsLdlMmolPerLitreView/VitalSignCholesterolAsLdlMmolPerLitreView.svelte";
    import VitalSignGroupView from "../VitalSignGroupView/VitalSignGroupView.svelte";
</script>

<VitalSignGroupView label="Lipid panel">
    <VitalSignCholesterolAsHdlMmolPerLitreView value={1.4} label="HDL: 1.4 mmol/L" />
    <VitalSignCholesterolAsLdlMmolPerLitreView value={3.2} label="LDL: 3.2 mmol/L" />
</VitalSignGroupView>
```

```svelte
<script lang="ts">
    import VitalSignCholesterolAsHdlMmolPerLitreView from "./VitalSignCholesterolAsHdlMmolPerLitreView.svelte";
</script>

<dl>
    <dt>HDL</dt>
    <dd>
        <VitalSignCholesterolAsHdlMmolPerLitreView value={1.4} label="HDL: 1.4 mmol/L" />
        <span aria-hidden="true"> mmol/L</span>
    </dd>
</dl>
```

## Accessibility

- `role="img"` marks the element as a cohesive graphic for assistive tech.
- `aria-label` carries the full, localized description including units.
- `data-value={value}` is a styling/testing hook only.
- Consumer CSS is responsible for any range/risk indicators.

## Related components

- `VitalSignCholesterolAsHdlMmolPerLitreInput` — the editable Input counterpart in the Input/View pattern.
- `VitalSignCholesterolAsLdlMmolPerLitreView` — partner LDL view.
- `VitalSignBloodPressureSystolicAsMmhgView` — cardiovascular risk companion.
- `VitalSignGroupView` — groups lipid-panel views.
- `SummaryList` / `SummaryListItem` — grouped readings displays.
