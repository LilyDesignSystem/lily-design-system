# VitalSignHeightAsCmInput

A headless numeric input for entering a person's height in centimetres. It wraps a native `<input type="number">` with sensible defaults and a bindable numeric value.

## What it is

An unstyled, semantic `<input type="number">` for height entry in centimetres. No CSS, no visual styling — consumers provide all styles.

## What it does

- Renders `<input type="number">` with `aria-label` from the `label` prop.
- Defaults to `min=0`, `max=300`, `step=1` (integer centimetres).
- Supports `bind:value` via `$bindable(undefined)`.
- Passes through `required`/`disabled` and spreads additional HTML attributes.

## When to use it

- Health intake forms and registration flows.
- Growth-tracking apps and BMI calculators.
- Inside a `VitalSignGroupInput` alongside weight for body-composition metrics.

## When not to use it

- Displaying a previously recorded height — use `VitalSignHeightAsCmView`.
- Capturing height in feet/inches — convert in the consumer; this component is centimetre-native.
- Capturing weight — use `VitalSignWeightAsKgInput`.

## How to use it

Import, bind `value`, and supply an accessible `label`. Optionally wrap with `Field`.

## Props

| Prop        | Type                  | Default     | Description                                                     |
| ----------- | --------------------- | ----------- | --------------------------------------------------------------- |
| `class`     | `string`              | `""`        | Additional CSS class appended to the base class name.           |
| `label`     | `string`              | —           | Required. Accessible name via `aria-label`.                     |
| `value`     | `number \| undefined` | `undefined` | Bindable height in centimetres.                                 |
| `min`       | `number`              | `0`         | Minimum value.                                                  |
| `max`       | `number`              | `300`       | Maximum value.                                                  |
| `step`      | `number`              | `1`         | Step size in centimetres.                                       |
| `required`  | `boolean`             | `false`     | Marks the input as required.                                    |
| `disabled`  | `boolean`             | `false`     | Disables the input.                                             |
| `...rest`   | —                     | —           | Spread onto the `<input>`.                                      |

## Usage

```svelte
<script lang="ts">
    import VitalSignHeightAsCmInput from "./VitalSignHeightAsCmInput.svelte";

    let height = $state<number | undefined>(undefined);
</script>

<VitalSignHeightAsCmInput label="Height (cm)" bind:value={height} />
```

```svelte
<script lang="ts">
    import VitalSignHeightAsCmInput from "./VitalSignHeightAsCmInput.svelte";

    let height = $state<number | undefined>(170);
</script>

<VitalSignHeightAsCmInput
    label="Height (cm)"
    bind:value={height}
    min={50}
    max={250}
    required
/>
```

```svelte
<script lang="ts">
    import VitalSignHeightAsCmInput from "./VitalSignHeightAsCmInput.svelte";
    import VitalSignWeightAsKgInput from "../VitalSignWeightAsKgInput/VitalSignWeightAsKgInput.svelte";
    import VitalSignGroupInput from "../VitalSignGroupInput/VitalSignGroupInput.svelte";

    let height = $state<number | undefined>(undefined);
    let weight = $state<number | undefined>(undefined);
</script>

<VitalSignGroupInput label="Body measurements">
    <VitalSignHeightAsCmInput label="Height (cm)" bind:value={height} />
    <VitalSignWeightAsKgInput label="Weight (kg)" bind:value={weight} />
</VitalSignGroupInput>
```

```svelte
<script lang="ts">
    import VitalSignHeightAsCmInput from "./VitalSignHeightAsCmInput.svelte";
    import Field from "../Field/Field.svelte";

    let height = $state<number | undefined>(undefined);
    let error = $state("");
</script>

<Field label="Height (cm)" required error={error}>
    <VitalSignHeightAsCmInput label="Height (cm)" bind:value={height} required />
</Field>
```

## Accessibility

- `aria-label` provides the accessible name; include the unit (`cm`).
- Implicit `spinbutton` role; Up/Down arrow keys step by 1.
- `min`, `max`, `step` constrain input with native validation.
- Consumer CSS must provide a WCAG 2.2 AAA focus indicator.

## Related components

- `VitalSignHeightAsCmView` — the read-only View counterpart in the Input/View pattern.
- `VitalSignWeightAsKgInput` — commonly captured with height for BMI.
- `VitalSignBellyCircumferenceAsCmInput` / `VitalSignWaistCircumferenceAsCmInput` — body-measurement siblings.
- `VitalSignGroupInput` — groups body-measurement inputs.
- `Field` — provides label/hint/error wrapping.
