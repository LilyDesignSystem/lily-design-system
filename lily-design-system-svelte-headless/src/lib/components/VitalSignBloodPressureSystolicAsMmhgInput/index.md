# VitalSignBloodPressureSystolicAsMmhgInput

A headless numeric input for the systolic blood pressure reading (the upper number) in millimetres of mercury (mmHg). It wraps a native `<input type="number">` with sensible defaults and a bindable numeric value.

## What it is

An unstyled, semantic `<input type="number">` for systolic blood pressure entry. No CSS, no visual styling, no layout opinions — consumers provide all styles.

## What it does

- Renders `<input type="number">` with `aria-label` from the `label` prop.
- Defaults to `min=0`, `max=300`, `step=1` (integer mmHg).
- Supports `bind:value` via `$bindable(undefined)`.
- Passes through `required`/`disabled` and spreads additional HTML attributes.

## When to use it

- Capturing a manual blood pressure reading on intake, triage, or follow-up forms.
- Paired with `VitalSignBloodPressureDiastolicAsMmhgInput` for a full reading.
- Inside a `VitalSignGroupInput` composition.

## When not to use it

- Displaying a previously captured value — use `VitalSignBloodPressureSystolicAsMmhgView`.
- Recording the diastolic component — use `VitalSignBloodPressureDiastolicAsMmhgInput`.
- When units other than mmHg are required.

## How to use it

Import the component, bind `value`, and pass an accessible `label`. Pair with the diastolic input and optionally wrap with `Field`.

## Props

| Prop        | Type                  | Default     | Description                                                     |
| ----------- | --------------------- | ----------- | --------------------------------------------------------------- |
| `class`     | `string`              | `""`        | Additional CSS class appended to the base class name.           |
| `label`     | `string`              | —           | Required. Accessible name via `aria-label`.                     |
| `value`     | `number \| undefined` | `undefined` | Bindable systolic reading in mmHg.                              |
| `min`       | `number`              | `0`         | Minimum value.                                                  |
| `max`       | `number`              | `300`       | Maximum value.                                                  |
| `step`      | `number`              | `1`         | Step size in mmHg.                                              |
| `required`  | `boolean`             | `false`     | Marks the input as required.                                    |
| `disabled`  | `boolean`             | `false`     | Disables the input.                                             |
| `...rest`   | —                     | —           | Spread onto the `<input>`.                                      |

## Usage

```svelte
<script lang="ts">
    import VitalSignBloodPressureSystolicAsMmhgInput from "./VitalSignBloodPressureSystolicAsMmhgInput.svelte";

    let systolic = $state<number | undefined>(undefined);
</script>

<VitalSignBloodPressureSystolicAsMmhgInput
    label="Systolic blood pressure (mmHg)"
    bind:value={systolic}
/>
```

```svelte
<script lang="ts">
    import VitalSignBloodPressureSystolicAsMmhgInput from "./VitalSignBloodPressureSystolicAsMmhgInput.svelte";

    let systolic = $state<number | undefined>(120);
</script>

<VitalSignBloodPressureSystolicAsMmhgInput
    label="Systolic (mmHg)"
    bind:value={systolic}
    min={50}
    max={250}
    required
/>
```

```svelte
<script lang="ts">
    import VitalSignBloodPressureSystolicAsMmhgInput from "./VitalSignBloodPressureSystolicAsMmhgInput.svelte";
    import VitalSignBloodPressureDiastolicAsMmhgInput from "../VitalSignBloodPressureDiastolicAsMmhgInput/VitalSignBloodPressureDiastolicAsMmhgInput.svelte";
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
    import VitalSignBloodPressureSystolicAsMmhgInput from "./VitalSignBloodPressureSystolicAsMmhgInput.svelte";
    import Field from "../Field/Field.svelte";

    let systolic = $state<number | undefined>(undefined);
    let error = $state("");
</script>

<Field label="Systolic (mmHg)" required error={error}>
    <VitalSignBloodPressureSystolicAsMmhgInput
        label="Systolic (mmHg)"
        bind:value={systolic}
        required
    />
</Field>
```

## Accessibility

- `aria-label` supplies the accessible name; include the unit (`mmHg`).
- Implicit `spinbutton` role; Up/Down arrow keys step the value.
- `min`, `max`, `step` constrain input with native validation.
- Consumer CSS must provide a WCAG 2.2 AAA focus indicator.

## Related components

- `VitalSignBloodPressureSystolicAsMmhgView` — the read-only View counterpart in the Input/View pattern.
- `VitalSignBloodPressureDiastolicAsMmhgInput` — partner diastolic input.
- `VitalSignHeartRateAsBeatsPerMinuteInput` — frequently captured alongside BP.
- `VitalSignGroupInput` — composes multiple vital sign inputs.
- `Field` — provides label, hint, and error wrapping.
