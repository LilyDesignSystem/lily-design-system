# VitalSignBloodPressureDiastolicAsMmhgInput

A headless numeric input for entering the diastolic blood pressure reading (the lower number) in millimetres of mercury (mmHg). It wraps a native `<input type="number">` with sensible defaults for adult diastolic values and a bindable numeric value.

## What it is

An unstyled, semantic `<input type="number">` tailored to diastolic blood pressure entry. The component owns no CSS and no visual styling; consumers bring their own.

## What it does

- Renders `<input type="number">` with `aria-label` from the `label` prop.
- Defaults to `min=0`, `max=200`, `step=1` (integer mmHg).
- Supports `bind:value` via `$bindable(undefined)`; value type is `number | undefined`.
- Passes through `required` and `disabled` and spreads any additional HTML attributes.

## When to use it

- Capturing a manual blood pressure reading in an intake or follow-up form.
- Paired alongside `VitalSignBloodPressureSystolicAsMmhgInput` to record a full BP measurement.
- Inside a `VitalSignGroupInput` composition.

## When not to use it

- Displaying an existing diastolic reading — use `VitalSignBloodPressureDiastolicAsMmhgView`.
- Recording the systolic component — use `VitalSignBloodPressureSystolicAsMmhgInput`.
- Capturing a pressure in a different unit — this component is fixed to mmHg.

## How to use it

Import the component, bind `value`, and supply an accessible `label`. Typically paired with the systolic input inside a `VitalSignGroupInput`.

## Props

| Prop        | Type                  | Default     | Description                                                   |
| ----------- | --------------------- | ----------- | ------------------------------------------------------------- |
| `class`     | `string`              | `""`        | Additional CSS class appended to the base class name.         |
| `label`     | `string`              | —           | Required. Accessible name via `aria-label`.                   |
| `value`     | `number \| undefined` | `undefined` | Bindable diastolic reading in mmHg.                           |
| `min`       | `number`              | `0`         | Minimum value.                                                |
| `max`       | `number`              | `200`       | Maximum value.                                                |
| `step`      | `number`              | `1`         | Step size in mmHg.                                            |
| `required`  | `boolean`             | `false`     | Marks the input as required.                                  |
| `disabled`  | `boolean`             | `false`     | Disables the input.                                           |
| `...rest`   | —                     | —           | Spread onto the `<input>`.                                    |

## Usage

```svelte
<script lang="ts">
    import VitalSignBloodPressureDiastolicAsMmhgInput from "./VitalSignBloodPressureDiastolicAsMmhgInput.svelte";

    let diastolic = $state<number | undefined>(undefined);
</script>

<VitalSignBloodPressureDiastolicAsMmhgInput
    label="Diastolic blood pressure (mmHg)"
    bind:value={diastolic}
/>
```

```svelte
<script lang="ts">
    import VitalSignBloodPressureDiastolicAsMmhgInput from "./VitalSignBloodPressureDiastolicAsMmhgInput.svelte";

    let diastolic = $state<number | undefined>(80);
</script>

<VitalSignBloodPressureDiastolicAsMmhgInput
    label="Diastolic (mmHg)"
    bind:value={diastolic}
    min={30}
    max={150}
    required
/>
```

```svelte
<script lang="ts">
    import VitalSignBloodPressureSystolicAsMmhgInput from "../VitalSignBloodPressureSystolicAsMmhgInput/VitalSignBloodPressureSystolicAsMmhgInput.svelte";
    import VitalSignBloodPressureDiastolicAsMmhgInput from "./VitalSignBloodPressureDiastolicAsMmhgInput.svelte";
    import VitalSignGroupInput from "../VitalSignGroupInput/VitalSignGroupInput.svelte";

    let systolic = $state<number | undefined>(undefined);
    let diastolic = $state<number | undefined>(undefined);
</script>

<VitalSignGroupInput label="Blood pressure">
    <VitalSignBloodPressureSystolicAsMmhgInput label="Systolic (mmHg)" bind:value={systolic} />
    <VitalSignBloodPressureDiastolicAsMmhgInput label="Diastolic (mmHg)" bind:value={diastolic} />
</VitalSignGroupInput>
```

```svelte
<script lang="ts">
    import VitalSignBloodPressureDiastolicAsMmhgInput from "./VitalSignBloodPressureDiastolicAsMmhgInput.svelte";
    import Field from "../Field/Field.svelte";

    let diastolic = $state<number | undefined>(undefined);
    let error = $state("");
</script>

<Field label="Diastolic (mmHg)" required error={error}>
    <VitalSignBloodPressureDiastolicAsMmhgInput
        label="Diastolic (mmHg)"
        bind:value={diastolic}
        required
    />
</Field>
```

## Accessibility

- `aria-label` supplies the accessible name; include the unit (`mmHg`) in the label.
- Implicit `spinbutton` role; Up/Down arrow keys adjust the value by `step`.
- `min`, `max`, `step` provide browser-native validation constraints.
- Consumer CSS must provide a visible focus indicator at WCAG 2.2 AAA contrast.

## Related components

- `VitalSignBloodPressureDiastolicAsMmhgView` — the read-only View counterpart in the Input/View pattern.
- `VitalSignBloodPressureSystolicAsMmhgInput` — partner systolic input.
- `VitalSignHeartRateAsBeatsPerMinuteInput` — frequently recorded alongside BP.
- `VitalSignGroupInput` — composes multiple vital sign inputs.
- `Field` — provides label, hint, and error wrapping.
