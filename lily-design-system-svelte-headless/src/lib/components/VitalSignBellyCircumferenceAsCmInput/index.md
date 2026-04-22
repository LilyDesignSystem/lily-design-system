# VitalSignBellyCircumferenceAsCmInput

A headless numeric input for capturing a person's belly (abdominal) circumference in centimetres. It wraps a native `<input type="number">` with sensible defaults for adult measurements and a bindable numeric value.

## What it is

An unstyled, semantic `<input type="number">` tailored to belly circumference entry. The component owns no CSS and no visual styling; consumers bring their own styles and layout.

## What it does

- Renders `<input type="number">` with `aria-label` from the `label` prop.
- Clamps input with `min=0`, `max=300`, `step=1` (integer centimetres) by default.
- Supports `bind:value` via `$bindable(undefined)`; the value is `number | undefined`.
- Passes through `required` and `disabled` and spreads any additional HTML attributes.

## When to use it

- Health intake forms capturing waist/belly anthropometric data.
- Fitness apps tracking body measurement changes over time.
- Clinical tools recording abdominal girth as part of metabolic or cardiovascular risk assessments.
- Inside a `VitalSignGroupInput` composition alongside other vital sign inputs.

## When not to use it

- Displaying a previously recorded value — use `VitalSignBellyCircumferenceAsCmView`.
- Capturing waist circumference specifically — use `VitalSignWaistCircumferenceAsCmInput`.
- Capturing a height or weight — use the corresponding vital-sign components.
- When a different unit (inches) must be entered directly; the component is centimetre-native.

## How to use it

Import the component, bind `value`, and supply an accessible `label`. For richer forms, wrap with a `Field` and compose within a `VitalSignGroupInput`.

## Props

| Prop        | Type                  | Default     | Description                                                    |
| ----------- | --------------------- | ----------- | -------------------------------------------------------------- |
| `class`     | `string`              | `""`        | Additional CSS class appended to the base class name.          |
| `label`     | `string`              | —           | Required. Accessible name via `aria-label`.                    |
| `value`     | `number \| undefined` | `undefined` | Bindable current value in centimetres.                         |
| `min`       | `number`              | `0`         | Minimum value.                                                 |
| `max`       | `number`              | `300`       | Maximum value.                                                 |
| `step`      | `number`              | `1`         | Step size in centimetres.                                      |
| `required`  | `boolean`             | `false`     | Marks the input as required.                                   |
| `disabled`  | `boolean`             | `false`     | Disables the input.                                            |
| `...rest`   | —                     | —           | Spread onto the `<input>` (e.g., `name`, `id`, `placeholder`). |

## Usage

```svelte
<script lang="ts">
    import VitalSignBellyCircumferenceAsCmInput from "./VitalSignBellyCircumferenceAsCmInput.svelte";

    let bellyCm = $state<number | undefined>(undefined);
</script>

<VitalSignBellyCircumferenceAsCmInput
    label="Belly circumference (cm)"
    bind:value={bellyCm}
/>
```

```svelte
<script lang="ts">
    import VitalSignBellyCircumferenceAsCmInput from "./VitalSignBellyCircumferenceAsCmInput.svelte";

    let bellyCm = $state<number | undefined>(92);
</script>

<VitalSignBellyCircumferenceAsCmInput
    label="Belly circumference (cm)"
    bind:value={bellyCm}
    min={40}
    max={200}
    required
/>
```

```svelte
<script lang="ts">
    import VitalSignBellyCircumferenceAsCmInput from "./VitalSignBellyCircumferenceAsCmInput.svelte";
    import VitalSignGroupInput from "../VitalSignGroupInput/VitalSignGroupInput.svelte";

    let belly = $state<number | undefined>(undefined);
    let waist = $state<number | undefined>(undefined);
</script>

<VitalSignGroupInput label="Body measurements">
    <VitalSignBellyCircumferenceAsCmInput label="Belly (cm)" bind:value={belly} />
</VitalSignGroupInput>
```

```svelte
<script lang="ts">
    import VitalSignBellyCircumferenceAsCmInput from "./VitalSignBellyCircumferenceAsCmInput.svelte";
    import Field from "../Field/Field.svelte";

    let bellyCm = $state<number | undefined>(undefined);
    let error = $state("");
</script>

<Field label="Belly circumference (cm)" required error={error}>
    <VitalSignBellyCircumferenceAsCmInput
        label="Belly circumference (cm)"
        bind:value={bellyCm}
        required
    />
</Field>
```

## Accessibility

- `aria-label` provides the accessible name for screen readers.
- Implicit `spinbutton` role from `<input type="number">`; Up/Down arrow keys adjust the value by `step`.
- `min`, `max`, and `step` provide native validation boundaries.
- Consumer CSS must supply a visible focus indicator meeting WCAG 2.2 AAA contrast.
- Provide localized units in the `label` (e.g., `"Belly circumference (cm)"`).

## Related components

- `VitalSignBellyCircumferenceAsCmView` — the read-only View counterpart in the Input/View pattern.
- `VitalSignWaistCircumferenceAsCmInput` — waist circumference input.
- `VitalSignHeightAsCmInput` / `VitalSignWeightAsKgInput` — other anthropometric measurements.
- `VitalSignGroupInput` — groups multiple vital sign inputs.
- `Field` — wraps the input with a visible label, hint, and error.
- `NumberInput` — the general-purpose number input.
