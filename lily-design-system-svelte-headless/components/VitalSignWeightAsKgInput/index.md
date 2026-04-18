# VitalSignWeightAsKgInput

A headless numeric input for entering a person's weight in kilograms. It wraps a native `<input type="number">` with sensible defaults and a bindable numeric value.

## What it is

An unstyled, semantic `<input type="number">` for weight entry in kilograms. No CSS, no visual styling — consumers provide all styles.

## What it does

- Renders `<input type="number">` with `aria-label` from the `label` prop.
- Defaults to `min=0`, `max=500`, `step=1` (integer kilograms). Override `step` (e.g., `0.1`) for fractional entry.
- Supports `bind:value` via `$bindable(undefined)`.
- Passes through `required`/`disabled` and spreads additional HTML attributes.

## When to use it

- Health intake forms, BMI calculators, fitness logs.
- Connected-scale sync or manual weight-log apps.
- Inside a `VitalSignGroupInput` composition alongside height.

## When not to use it

- Displaying a previously recorded weight — use `VitalSignWeightAsKgView`.
- Capturing weight in pounds — convert in the consumer; this component is kilogram-native.
- Capturing body fat or composition percentages — use `VitalSignBodyFatAsPercentageInput`.

## How to use it

Import, bind `value`, and supply an accessible `label`. Override `step` for fractional precision if needed.

## Props

| Prop        | Type                  | Default     | Description                                                     |
| ----------- | --------------------- | ----------- | --------------------------------------------------------------- |
| `class`     | `string`              | `""`        | Additional CSS class appended to the base class name.           |
| `label`     | `string`              | —           | Required. Accessible name via `aria-label`.                     |
| `value`     | `number \| undefined` | `undefined` | Bindable weight in kilograms.                                   |
| `min`       | `number`              | `0`         | Minimum value.                                                  |
| `max`       | `number`              | `500`       | Maximum value.                                                  |
| `step`      | `number`              | `1`         | Step size in kilograms.                                         |
| `required`  | `boolean`             | `false`     | Marks the input as required.                                    |
| `disabled`  | `boolean`             | `false`     | Disables the input.                                             |
| `...rest`   | —                     | —           | Spread onto the `<input>`.                                      |

## Usage

```svelte
<script lang="ts">
    import VitalSignWeightAsKgInput from "./VitalSignWeightAsKgInput.svelte";

    let weight = $state<number | undefined>(undefined);
</script>

<VitalSignWeightAsKgInput label="Weight (kg)" bind:value={weight} />
```

```svelte
<script lang="ts">
    import VitalSignWeightAsKgInput from "./VitalSignWeightAsKgInput.svelte";

    let weight = $state<number | undefined>(68.5);
</script>

<VitalSignWeightAsKgInput
    label="Weight (kg)"
    bind:value={weight}
    min={1}
    max={300}
    step={0.1}
    required
/>
```

```svelte
<script lang="ts">
    import VitalSignWeightAsKgInput from "./VitalSignWeightAsKgInput.svelte";
    import VitalSignHeightAsCmInput from "../VitalSignHeightAsCmInput/VitalSignHeightAsCmInput.svelte";
    import VitalSignGroupInput from "../VitalSignGroupInput/VitalSignGroupInput.svelte";

    let weight = $state<number | undefined>(undefined);
    let height = $state<number | undefined>(undefined);
</script>

<VitalSignGroupInput label="Body measurements">
    <VitalSignHeightAsCmInput label="Height (cm)" bind:value={height} />
    <VitalSignWeightAsKgInput label="Weight (kg)" bind:value={weight} />
</VitalSignGroupInput>
```

```svelte
<script lang="ts">
    import VitalSignWeightAsKgInput from "./VitalSignWeightAsKgInput.svelte";
    import Field from "../Field/Field.svelte";

    let weight = $state<number | undefined>(undefined);
    let error = $state("");
</script>

<Field label="Weight (kg)" required error={error}>
    <VitalSignWeightAsKgInput label="Weight (kg)" bind:value={weight} required />
</Field>
```

## Accessibility

- `aria-label` provides the accessible name; include the unit (`kg`).
- Implicit `spinbutton` role; Up/Down arrow keys step by `step`.
- `min`, `max`, `step` constrain input with native validation.
- Consumer CSS must provide a WCAG 2.2 AAA focus indicator.

## Related components

- `VitalSignWeightAsKgView` — the read-only View counterpart in the Input/View pattern.
- `VitalSignHeightAsCmInput` — commonly captured with weight for BMI.
- `VitalSignBodyFatAsPercentageInput` — body composition input.
- `VitalSignGroupInput` — groups body-measurement inputs.
- `Field` — provides label/hint/error wrapping.
