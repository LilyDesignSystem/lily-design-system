# VitalSignVo2MaxAsMlPerKgPerMinuteInput

A headless numeric input for entering VO2 max (maximal oxygen uptake) in millilitres per kilogram per minute (mL/kg/min). It wraps a native `<input type="number">` with sensible defaults and a bindable numeric value.

## What it is

An unstyled, semantic `<input type="number">` for VO2 max entry. No CSS, no visual styling — consumers provide all styles.

## What it does

- Renders `<input type="number">` with `aria-label` from the `label` prop.
- Defaults to `min=0`, `max=100`, `step=1` (integer mL/kg/min, covering recreational through elite-athlete ranges).
- Supports `bind:value` via `$bindable(undefined)`.
- Passes through `required`/`disabled` and spreads additional HTML attributes.

## When to use it

- Fitness assessments, cardio-respiratory tests, and training logs.
- Wearable-sync or lab-result entry forms for VO2 max.
- Inside a `VitalSignGroupInput` composition alongside heart rate and HRV.

## When not to use it

- Displaying an existing VO2 max — use `VitalSignVo2MaxAsMlPerKgPerMinuteView`.
- Capturing absolute VO2 in litres/minute rather than relative — consider a generic `NumberInput` with a different unit label.
- When the unit is not mL/kg/min.

## How to use it

Import, bind `value`, and supply an accessible `label` that includes the unit.

## Props

| Prop        | Type                  | Default     | Description                                                     |
| ----------- | --------------------- | ----------- | --------------------------------------------------------------- |
| `class`     | `string`              | `""`        | Additional CSS class appended to the base class name.           |
| `label`     | `string`              | —           | Required. Accessible name via `aria-label`.                     |
| `value`     | `number \| undefined` | `undefined` | Bindable VO2 max in mL/kg/min.                                  |
| `min`       | `number`              | `0`         | Minimum value.                                                  |
| `max`       | `number`              | `100`       | Maximum value.                                                  |
| `step`      | `number`              | `1`         | Step size.                                                      |
| `required`  | `boolean`             | `false`     | Marks the input as required.                                    |
| `disabled`  | `boolean`             | `false`     | Disables the input.                                             |
| `...rest`   | —                     | —           | Spread onto the `<input>`.                                      |

## Usage

```svelte
<script lang="ts">
    import VitalSignVo2MaxAsMlPerKgPerMinuteInput from "./VitalSignVo2MaxAsMlPerKgPerMinuteInput.svelte";

    let vo2max = $state<number | undefined>(undefined);
</script>

<VitalSignVo2MaxAsMlPerKgPerMinuteInput
    label="VO2 max (mL/kg/min)"
    bind:value={vo2max}
/>
```

```svelte
<script lang="ts">
    import VitalSignVo2MaxAsMlPerKgPerMinuteInput from "./VitalSignVo2MaxAsMlPerKgPerMinuteInput.svelte";

    let vo2max = $state<number | undefined>(48);
</script>

<VitalSignVo2MaxAsMlPerKgPerMinuteInput
    label="VO2 max (mL/kg/min)"
    bind:value={vo2max}
    min={10}
    max={90}
    step={0.1}
    required
/>
```

```svelte
<script lang="ts">
    import VitalSignVo2MaxAsMlPerKgPerMinuteInput from "./VitalSignVo2MaxAsMlPerKgPerMinuteInput.svelte";
    import VitalSignHeartRateVariabilityInput from "../VitalSignHeartRateVariabilityInput/VitalSignHeartRateVariabilityInput.svelte";
    import VitalSignGroupInput from "../VitalSignGroupInput/VitalSignGroupInput.svelte";

    let vo2max = $state<number | undefined>(undefined);
    let hrv = $state<number | undefined>(undefined);
</script>

<VitalSignGroupInput label="Fitness">
    <VitalSignVo2MaxAsMlPerKgPerMinuteInput label="VO2 max (mL/kg/min)" bind:value={vo2max} />
    <VitalSignHeartRateVariabilityInput label="HRV (ms)" bind:value={hrv} />
</VitalSignGroupInput>
```

```svelte
<script lang="ts">
    import VitalSignVo2MaxAsMlPerKgPerMinuteInput from "./VitalSignVo2MaxAsMlPerKgPerMinuteInput.svelte";
    import Field from "../Field/Field.svelte";

    let vo2max = $state<number | undefined>(undefined);
    let error = $state("");
</script>

<Field label="VO2 max (mL/kg/min)" error={error}>
    <VitalSignVo2MaxAsMlPerKgPerMinuteInput label="VO2 max" bind:value={vo2max} />
</Field>
```

## Accessibility

- `aria-label` provides the accessible name; include the unit (`mL/kg/min`).
- Implicit `spinbutton` role; Up/Down arrow keys step by 1.
- `min`, `max`, `step` constrain input with native validation.
- Consumer CSS must provide a WCAG 2.2 AAA focus indicator.

## Related components

- `VitalSignVo2MaxAsMlPerKgPerMinuteView` — the read-only View counterpart in the Input/View pattern.
- `VitalSignHeartRateAsBeatsPerMinuteInput` — partner cardiovascular input.
- `VitalSignHeartRateVariabilityInput` — complementary recovery metric input.
- `VitalSignGroupInput` — groups multiple vital-sign inputs.
- `Field` — provides label/hint/error wrapping.
