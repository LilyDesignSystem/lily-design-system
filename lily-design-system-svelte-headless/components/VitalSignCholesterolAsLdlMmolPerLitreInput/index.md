# VitalSignCholesterolAsLdlMmolPerLitreInput

A headless numeric input for entering LDL ("bad") cholesterol in millimoles per litre (mmol/L). It wraps a native `<input type="number">` with fractional precision and a bindable numeric value.

## What it is

An unstyled, semantic `<input type="number">` for LDL cholesterol entry in mmol/L. No CSS, no visual styling — consumers provide all styles.

## What it does

- Renders `<input type="number">` with `aria-label` from the `label` prop.
- Defaults to `min=0`, `max=10`, `step=0.1` (one-decimal precision in mmol/L).
- Supports `bind:value` via `$bindable(undefined)`.
- Passes through `required`/`disabled` and spreads additional HTML attributes.

## When to use it

- Lab-entry and cardiovascular-risk forms using SI units.
- Patient records storing cholesterol in mmol/L.
- Inside a `VitalSignGroupInput` for lipid-panel capture.

## When not to use it

- Displaying a previously recorded value — use `VitalSignCholesterolAsLdlMmolPerLitreView`.
- Capturing HDL cholesterol — use `VitalSignCholesterolAsHdlMmolPerLitreInput`.
- Entering cholesterol in mg/dL — this component is mmol/L-native.

## How to use it

Import, bind `value`, supply `label`. Combine with the HDL input inside a `VitalSignGroupInput`.

## Props

| Prop        | Type                  | Default     | Description                                                     |
| ----------- | --------------------- | ----------- | --------------------------------------------------------------- |
| `class`     | `string`              | `""`        | Additional CSS class appended to the base class name.           |
| `label`     | `string`              | —           | Required. Accessible name via `aria-label`.                     |
| `value`     | `number \| undefined` | `undefined` | Bindable LDL cholesterol in mmol/L.                             |
| `min`       | `number`              | `0`         | Minimum value.                                                  |
| `max`       | `number`              | `10`        | Maximum value.                                                  |
| `step`      | `number`              | `0.1`       | Step size (one decimal).                                        |
| `required`  | `boolean`             | `false`     | Marks the input as required.                                    |
| `disabled`  | `boolean`             | `false`     | Disables the input.                                             |
| `...rest`   | —                     | —           | Spread onto the `<input>`.                                      |

## Usage

```svelte
<script lang="ts">
    import VitalSignCholesterolAsLdlMmolPerLitreInput from "./VitalSignCholesterolAsLdlMmolPerLitreInput.svelte";

    let ldl = $state<number | undefined>(undefined);
</script>

<VitalSignCholesterolAsLdlMmolPerLitreInput
    label="LDL cholesterol (mmol/L)"
    bind:value={ldl}
/>
```

```svelte
<script lang="ts">
    import VitalSignCholesterolAsLdlMmolPerLitreInput from "./VitalSignCholesterolAsLdlMmolPerLitreInput.svelte";

    let ldl = $state<number | undefined>(3.2);
</script>

<VitalSignCholesterolAsLdlMmolPerLitreInput
    label="LDL (mmol/L)"
    bind:value={ldl}
    min={0.5}
    max={8}
    step={0.01}
    required
/>
```

```svelte
<script lang="ts">
    import VitalSignCholesterolAsLdlMmolPerLitreInput from "./VitalSignCholesterolAsLdlMmolPerLitreInput.svelte";
    import VitalSignCholesterolAsHdlMmolPerLitreInput from "../VitalSignCholesterolAsHdlMmolPerLitreInput/VitalSignCholesterolAsHdlMmolPerLitreInput.svelte";
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
    import VitalSignCholesterolAsLdlMmolPerLitreInput from "./VitalSignCholesterolAsLdlMmolPerLitreInput.svelte";
    import Field from "../Field/Field.svelte";

    let ldl = $state<number | undefined>(undefined);
    let error = $state("");
</script>

<Field label="LDL (mmol/L)" error={error}>
    <VitalSignCholesterolAsLdlMmolPerLitreInput label="LDL (mmol/L)" bind:value={ldl} />
</Field>
```

## Accessibility

- `aria-label` provides the accessible name; include the unit (`mmol/L`).
- Implicit `spinbutton` role; Up/Down arrow keys step by `0.1` by default.
- `min`, `max`, `step` constrain input with native validation.
- Consumer CSS must provide a WCAG 2.2 AAA focus indicator.

## Related components

- `VitalSignCholesterolAsLdlMmolPerLitreView` — the read-only View counterpart in the Input/View pattern.
- `VitalSignCholesterolAsHdlMmolPerLitreInput` — partner HDL input.
- `VitalSignBloodPressureSystolicAsMmhgInput` — cardiovascular risk companion.
- `VitalSignGroupInput` — groups lipid-panel inputs.
- `Field` — provides label/hint/error wrapping.
