# VitalSignBodyFatAsPercentageInput

A headless numeric input for entering a body fat percentage. It wraps a native `<input type="number">` with fractional precision suitable for modern body composition scales and a bindable numeric value.

## What it is

An unstyled, semantic `<input type="number">` for body fat percentage entry. No CSS, no visual styling — consumers provide all styles.

## What it does

- Renders `<input type="number">` with `aria-label` from the `label` prop.
- Defaults to `min=0`, `max=100`, `step=0.1` (one decimal place precision).
- Supports `bind:value` via `$bindable(undefined)`; value type is `number | undefined`.
- Passes through `required`/`disabled` and spreads additional HTML attributes.

## When to use it

- Health and fitness apps that track body composition from a scale or DEXA.
- Clinical forms that record body fat alongside other anthropometric readings.
- Inside a `VitalSignGroupInput` composition with weight and height.

## When not to use it

- Displaying a previously recorded value — use `VitalSignBodyFatAsPercentageView`.
- Capturing body mass, not body-fat percent — use `VitalSignWeightAsKgInput`.
- When skinfold-measurement inputs are required in millimetres; this component is percent-native.

## How to use it

Import the component, bind `value`, and supply an accessible `label`. Optionally wrap with `Field`.

## Props

| Prop        | Type                  | Default     | Description                                                     |
| ----------- | --------------------- | ----------- | --------------------------------------------------------------- |
| `class`     | `string`              | `""`        | Additional CSS class appended to the base class name.           |
| `label`     | `string`              | —           | Required. Accessible name via `aria-label`.                     |
| `value`     | `number \| undefined` | `undefined` | Bindable body fat percentage.                                   |
| `min`       | `number`              | `0`         | Minimum value.                                                  |
| `max`       | `number`              | `100`       | Maximum value.                                                  |
| `step`      | `number`              | `0.1`       | Step size (one decimal place).                                  |
| `required`  | `boolean`             | `false`     | Marks the input as required.                                    |
| `disabled`  | `boolean`             | `false`     | Disables the input.                                             |
| `...rest`   | —                     | —           | Spread onto the `<input>`.                                      |

## Usage

```svelte
<script lang="ts">
    import VitalSignBodyFatAsPercentageInput from "./VitalSignBodyFatAsPercentageInput.svelte";

    let bodyFat = $state<number | undefined>(undefined);
</script>

<VitalSignBodyFatAsPercentageInput
    label="Body fat (%)"
    bind:value={bodyFat}
/>
```

```svelte
<script lang="ts">
    import VitalSignBodyFatAsPercentageInput from "./VitalSignBodyFatAsPercentageInput.svelte";

    let bodyFat = $state<number | undefined>(22.5);
</script>

<VitalSignBodyFatAsPercentageInput
    label="Body fat percentage"
    bind:value={bodyFat}
    min={2}
    max={60}
    step={0.1}
    required
/>
```

```svelte
<script lang="ts">
    import VitalSignBodyFatAsPercentageInput from "./VitalSignBodyFatAsPercentageInput.svelte";
    import VitalSignGroupInput from "../VitalSignGroupInput/VitalSignGroupInput.svelte";

    let bodyFat = $state<number | undefined>(undefined);
</script>

<VitalSignGroupInput label="Body composition">
    <VitalSignBodyFatAsPercentageInput label="Body fat (%)" bind:value={bodyFat} />
</VitalSignGroupInput>
```

```svelte
<script lang="ts">
    import VitalSignBodyFatAsPercentageInput from "./VitalSignBodyFatAsPercentageInput.svelte";
    import Field from "../Field/Field.svelte";

    let bodyFat = $state<number | undefined>(undefined);
    let error = $state("");
</script>

<Field label="Body fat (%)" error={error}>
    <VitalSignBodyFatAsPercentageInput
        label="Body fat (%)"
        bind:value={bodyFat}
    />
</Field>
```

## Accessibility

- `aria-label` provides the accessible name; include the unit (`%`).
- Implicit `spinbutton` role; Up/Down arrow keys step by `0.1` by default.
- `min`, `max`, `step` provide native validation constraints.
- Consumer CSS must provide a WCAG 2.2 AAA focus indicator.

## Related components

- `VitalSignBodyFatAsPercentageView` — the read-only View counterpart in the Input/View pattern.
- `VitalSignWeightAsKgInput` — commonly recorded alongside body fat.
- `VitalSignWaistCircumferenceAsCmInput` — complementary composition metric.
- `VitalSignGroupInput` — groups body composition inputs.
- `Field` — provides label/hint/error wrapping.
