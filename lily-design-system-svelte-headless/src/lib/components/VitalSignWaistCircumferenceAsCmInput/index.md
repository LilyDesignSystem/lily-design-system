# VitalSignWaistCircumferenceAsCmInput

A headless numeric input for entering a person's waist circumference in centimetres. It wraps a native `<input type="number">` with sensible defaults and a bindable numeric value.

## What it is

An unstyled, semantic `<input type="number">` for waist circumference entry. No CSS, no visual styling — consumers provide all styles.

## What it does

- Renders `<input type="number">` with `aria-label` from the `label` prop.
- Defaults to `min=0`, `max=300`, `step=1` (integer centimetres).
- Supports `bind:value` via `$bindable(undefined)`.
- Passes through `required`/`disabled` and spreads additional HTML attributes.

## When to use it

- Health intake and metabolic/cardiovascular-risk assessment forms.
- Fitness apps tracking body measurement trends.
- Inside a `VitalSignGroupInput` composition with belly, height, and weight.

## When not to use it

- Displaying a previously recorded value — use `VitalSignWaistCircumferenceAsCmView`.
- Capturing belly (abdominal) circumference specifically — use `VitalSignBellyCircumferenceAsCmInput`.
- When units other than centimetres are required.

## How to use it

Import, bind `value`, and supply an accessible `label`. Optionally wrap with `Field`.

## Props

| Prop        | Type                  | Default     | Description                                                     |
| ----------- | --------------------- | ----------- | --------------------------------------------------------------- |
| `class`     | `string`              | `""`        | Additional CSS class appended to the base class name.           |
| `label`     | `string`              | —           | Required. Accessible name via `aria-label`.                     |
| `value`     | `number \| undefined` | `undefined` | Bindable waist circumference in centimetres.                    |
| `min`       | `number`              | `0`         | Minimum value.                                                  |
| `max`       | `number`              | `300`       | Maximum value.                                                  |
| `step`      | `number`              | `1`         | Step size in centimetres.                                       |
| `required`  | `boolean`             | `false`     | Marks the input as required.                                    |
| `disabled`  | `boolean`             | `false`     | Disables the input.                                             |
| `...rest`   | —                     | —           | Spread onto the `<input>`.                                      |

## Usage

```svelte
<script lang="ts">
    import VitalSignWaistCircumferenceAsCmInput from "./VitalSignWaistCircumferenceAsCmInput.svelte";

    let waist = $state<number | undefined>(undefined);
</script>

<VitalSignWaistCircumferenceAsCmInput
    label="Waist circumference (cm)"
    bind:value={waist}
/>
```

```svelte
<script lang="ts">
    import VitalSignWaistCircumferenceAsCmInput from "./VitalSignWaistCircumferenceAsCmInput.svelte";

    let waist = $state<number | undefined>(85);
</script>

<VitalSignWaistCircumferenceAsCmInput
    label="Waist (cm)"
    bind:value={waist}
    min={40}
    max={200}
    required
/>
```

```svelte
<script lang="ts">
    import VitalSignWaistCircumferenceAsCmInput from "./VitalSignWaistCircumferenceAsCmInput.svelte";
    import VitalSignBellyCircumferenceAsCmInput from "../VitalSignBellyCircumferenceAsCmInput/VitalSignBellyCircumferenceAsCmInput.svelte";
    import VitalSignGroupInput from "../VitalSignGroupInput/VitalSignGroupInput.svelte";

    let waist = $state<number | undefined>(undefined);
    let belly = $state<number | undefined>(undefined);
</script>

<VitalSignGroupInput label="Body measurements">
    <VitalSignWaistCircumferenceAsCmInput label="Waist (cm)" bind:value={waist} />
    <VitalSignBellyCircumferenceAsCmInput label="Belly (cm)" bind:value={belly} />
</VitalSignGroupInput>
```

```svelte
<script lang="ts">
    import VitalSignWaistCircumferenceAsCmInput from "./VitalSignWaistCircumferenceAsCmInput.svelte";
    import Field from "../Field/Field.svelte";

    let waist = $state<number | undefined>(undefined);
    let error = $state("");
</script>

<Field label="Waist (cm)" required error={error}>
    <VitalSignWaistCircumferenceAsCmInput label="Waist (cm)" bind:value={waist} required />
</Field>
```

## Accessibility

- `aria-label` provides the accessible name; include the unit (`cm`).
- Implicit `spinbutton` role; Up/Down arrow keys step by 1.
- `min`, `max`, `step` constrain input with native validation.
- Consumer CSS must provide a WCAG 2.2 AAA focus indicator.

## Related components

- `VitalSignWaistCircumferenceAsCmView` — the read-only View counterpart in the Input/View pattern.
- `VitalSignBellyCircumferenceAsCmInput` — sibling abdominal measurement input.
- `VitalSignHeightAsCmInput` / `VitalSignWeightAsKgInput` — core anthropometric inputs.
- `VitalSignGroupInput` — groups body-measurement inputs.
- `Field` — provides label/hint/error wrapping.
