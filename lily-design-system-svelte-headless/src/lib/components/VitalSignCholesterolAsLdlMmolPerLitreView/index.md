# VitalSignCholesterolAsLdlMmolPerLitreView

A headless read-only display of an LDL ("bad") cholesterol reading in millimoles per litre (mmol/L). It renders a semantic `<span>` with `role="img"`, `aria-label`, and `data-value`.

## What it is

A passive, unstyled view element for LDL cholesterol readings. Screen readers hear the full description via `aria-label`; sighted users see the numeric value.

## What it does

- Renders `<span role="img">` with `aria-label` from the `label` prop.
- Exposes the numeric value through `data-value={value}`.
- Renders the `value` as the visible text content.
- Spreads additional HTML attributes onto the `<span>`.

## When to use it

- Lab result summaries, patient health records, dashboards.
- Paired with `VitalSignCholesterolAsHdlMmolPerLitreView` for a full lipid snapshot.
- Inside a `VitalSignGroupView`.

## When not to use it

- Capturing a new value — use `VitalSignCholesterolAsLdlMmolPerLitreInput`.
- Displaying HDL cholesterol — use `VitalSignCholesterolAsHdlMmolPerLitreView`.
- Rendering cholesterol in mg/dL — convert in the consumer; this component is mmol/L-native.

## How to use it

Pass the numeric `value` and a localized, descriptive `label`.

## Props

| Prop        | Type     | Default | Description                                                           |
| ----------- | -------- | ------- | --------------------------------------------------------------------- |
| `class`     | `string` | `""`    | Additional CSS class appended to the base class name.                 |
| `value`     | `number` | —       | Required. LDL cholesterol in mmol/L.                                  |
| `label`     | `string` | —       | Required. Accessible description via `aria-label`.                    |
| `...rest`   | —        | —       | Spread onto the `<span>`.                                             |

## Usage

```svelte
<script lang="ts">
    import VitalSignCholesterolAsLdlMmolPerLitreView from "./VitalSignCholesterolAsLdlMmolPerLitreView.svelte";
</script>

<VitalSignCholesterolAsLdlMmolPerLitreView
    value={3.2}
    label="LDL cholesterol: 3.2 millimoles per litre"
/>
```

```svelte
<script lang="ts">
    import VitalSignCholesterolAsLdlMmolPerLitreView from "./VitalSignCholesterolAsLdlMmolPerLitreView.svelte";

    const ldl = 4.5;
    const label = `LDL: ${ldl} mmol/L (high)`;
</script>

<VitalSignCholesterolAsLdlMmolPerLitreView value={ldl} {label} />
```

```svelte
<script lang="ts">
    import VitalSignCholesterolAsLdlMmolPerLitreView from "./VitalSignCholesterolAsLdlMmolPerLitreView.svelte";
    import VitalSignCholesterolAsHdlMmolPerLitreView from "../VitalSignCholesterolAsHdlMmolPerLitreView/VitalSignCholesterolAsHdlMmolPerLitreView.svelte";
    import VitalSignGroupView from "../VitalSignGroupView/VitalSignGroupView.svelte";
</script>

<VitalSignGroupView label="Lipid panel">
    <VitalSignCholesterolAsHdlMmolPerLitreView value={1.4} label="HDL: 1.4 mmol/L" />
    <VitalSignCholesterolAsLdlMmolPerLitreView value={3.2} label="LDL: 3.2 mmol/L" />
</VitalSignGroupView>
```

```svelte
<script lang="ts">
    import VitalSignCholesterolAsLdlMmolPerLitreView from "./VitalSignCholesterolAsLdlMmolPerLitreView.svelte";
</script>

<dl>
    <dt>LDL</dt>
    <dd>
        <VitalSignCholesterolAsLdlMmolPerLitreView value={3.2} label="LDL: 3.2 mmol/L" />
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

- `VitalSignCholesterolAsLdlMmolPerLitreInput` — the editable Input counterpart in the Input/View pattern.
- `VitalSignCholesterolAsHdlMmolPerLitreView` — partner HDL view.
- `VitalSignBloodPressureSystolicAsMmhgView` — cardiovascular risk companion.
- `VitalSignGroupView` — groups lipid-panel views.
- `SummaryList` / `SummaryListItem` — grouped readings displays.
