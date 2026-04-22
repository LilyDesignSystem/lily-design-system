# VitalSignCholesterolAsHdlMmolPerLitreInput

A headless numeric input for entering HDL ("good") cholesterol in millimoles per litre (mmol/L). It wraps a native `<input type="number">` with fractional precision and a bindable numeric value.

## What it is

An unstyled, semantic `<input type="number">` for HDL cholesterol entry in mmol/L. No CSS, no visual styling — consumers provide all styles.

## What it does

- Renders `<input type="number">` with `aria-label` from the `label` prop.
- Defaults to `min=0`, `max=10`, `step=0.1` (one-decimal precision in mmol/L).
- Supports `bind:value` via `$bindable(undefined)`.
- Passes through `required`/`disabled` and spreads additional HTML attributes.

## When to use it

- Lab-entry and cardiovascular-risk forms using SI units.
- Patient health records that store cholesterol in mmol/L (common in UK, EU, AU).
- Inside a `VitalSignGroupInput` for lipid-panel capture.

## When not to use it

- Displaying an existing HDL value — use `VitalSignCholesterolAsHdlMmolPerLitreView`.
- Capturing LDL cholesterol — use `VitalSignCholesterolAsLdlMmolPerLitreInput`.
- Entering cholesterol in mg/dL — this component is mmol/L-native; convert in the consumer if needed.

## How to use it

Import, bind `value`, supply `label`. Optionally wrap with `Field` and combine with the LDL input inside a `VitalSignGroupInput`.

## Props

| Prop        | Type                  | Default     | Description                                                     |
| ----------- | --------------------- | ----------- | --------------------------------------------------------------- |
| `class`     | `string`              | `""`        | Additional CSS class appended to the base class name.           |
| `label`     | `string`              | —           | Required. Accessible name via `aria-label`.                     |
| `value`     | `number \| undefined` | `undefined` | Bindable HDL cholesterol in mmol/L.                             |
| `min`       | `number`              | `0`         | Minimum value.                                                  |
| `max`       | `number`              | `10`        | Maximum value.                                                  |
| `step`      | `number`              | `0.1`       | Step size (one decimal).                                        |
| `required`  | `boolean`             | `false`     | Marks the input as required.                                    |
| `disabled`  | `boolean`             | `false`     | Disables the input.                                             |
| `...rest`   | —                     | —           | Spread onto the `<input>`.                                      |

## Usage

```svelte
<script lang="ts">
    import VitalSignCholesterolAsHdlMmolPerLitreInput from "./VitalSignCholesterolAsHdlMmolPerLitreInput.svelte";

    let hdl = $state<number | undefined>(undefined);
</script>

<VitalSignCholesterolAsHdlMmolPerLitreInput
    label="HDL cholesterol (mmol/L)"
    bind:value={hdl}
/>
```

```svelte
<script lang="ts">
    import VitalSignCholesterolAsHdlMmolPerLitreInput from "./VitalSignCholesterolAsHdlMmolPerLitreInput.svelte";

    let hdl = $state<number | undefined>(1.4);
</script>

<VitalSignCholesterolAsHdlMmolPerLitreInput
    label="HDL (mmol/L)"
    bind:value={hdl}
    min={0.2}
    max={5}
    step={0.01}
    required
/>
```

```svelte
<script lang="ts">
    import VitalSignCholesterolAsHdlMmolPerLitreInput from "./VitalSignCholesterolAsHdlMmolPerLitreInput.svelte";
    import VitalSignCholesterolAsLdlMmolPerLitreInput from "../VitalSignCholesterolAsLdlMmolPerLitreInput/VitalSignCholesterolAsLdlMmolPerLitreInput.svelte";
    import VitalSignGroupInput from "../VitalSignGroupInput/VitalSignGroupInput.svelte";

    let hdl = $state<number | undefined>(undefined);
    let ldl = $state<number | undefined>(undefined);
</script>

<VitalSignGroupInput label="Lipid panel">
    <VitalSignCholesterolAsHdlMmolPerLitreInput label="HDL (mmol/L)" bind:value={hdl} />
    <VitalSignCholesterolAsLdlMmolPerLitreInput label="LDL (mmol/L)" bind:value={ldl} />
</VitalSignGroupInput>
```

```svelte
<script lang="ts">
    import VitalSignCholesterolAsHdlMmolPerLitreInput from "./VitalSignCholesterolAsHdlMmolPerLitreInput.svelte";
    import Field from "../Field/Field.svelte";

    let hdl = $state<number | undefined>(undefined);
    let error = $state("");
</script>

<Field label="HDL (mmol/L)" error={error}>
    <VitalSignCholesterolAsHdlMmolPerLitreInput label="HDL (mmol/L)" bind:value={hdl} />
</Field>
```

## Accessibility

- `aria-label` provides the accessible name; include the unit (`mmol/L`).
- Implicit `spinbutton` role; Up/Down arrow keys step by `0.1` by default.
- `min`, `max`, `step` constrain input with native validation.
- Consumer CSS must provide a WCAG 2.2 AAA focus indicator.

## Related components

- `VitalSignCholesterolAsHdlMmolPerLitreView` — the read-only View counterpart in the Input/View pattern.
- `VitalSignCholesterolAsLdlMmolPerLitreInput` — partner LDL input.
- `VitalSignBloodPressureSystolicAsMmhgInput` — commonly captured for cardiovascular risk.
- `VitalSignGroupInput` — groups lipid-panel inputs.
- `Field` — provides label/hint/error wrapping.
