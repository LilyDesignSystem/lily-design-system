# VitalSignHeartRateAsBeatsPerMinuteInput

A headless numeric input for entering a heart rate in beats per minute (bpm). It wraps a native `<input type="number">` with sensible physiological defaults and a bindable numeric value.

## What it is

An unstyled, semantic `<input type="number">` for heart rate entry. No CSS, no visual styling — consumers provide all styles.

## What it does

- Renders `<input type="number">` with `aria-label` from the `label` prop.
- Defaults to `min=0`, `max=300`, `step=1` (integer bpm).
- Supports `bind:value` via `$bindable(undefined)`; value type is `number | undefined`.
- Passes through `required`/`disabled` and spreads additional HTML attributes.

## When to use it

- Patient intake or triage forms recording a heart rate.
- Fitness trackers, wearable synchronization forms, or manual heart-rate logs.
- Inside a `VitalSignGroupInput` composition alongside blood pressure and respiratory rate.

## When not to use it

- Displaying a previously recorded heart rate — use `VitalSignHeartRateAsBeatsPerMinuteView`.
- Capturing heart rate variability — use `VitalSignHeartRateVariabilityInput`.
- When the value unit is not bpm.

## How to use it

Import, bind `value`, and supply an accessible `label`. Optionally wrap in `Field` and compose within a `VitalSignGroupInput`.

## Props

| Prop        | Type                  | Default     | Description                                                     |
| ----------- | --------------------- | ----------- | --------------------------------------------------------------- |
| `class`     | `string`              | `""`        | Additional CSS class appended to the base class name.           |
| `label`     | `string`              | —           | Required. Accessible name via `aria-label`.                     |
| `value`     | `number \| undefined` | `undefined` | Bindable heart rate in bpm.                                     |
| `min`       | `number`              | `0`         | Minimum value.                                                  |
| `max`       | `number`              | `300`       | Maximum value.                                                  |
| `step`      | `number`              | `1`         | Step size in bpm.                                               |
| `required`  | `boolean`             | `false`     | Marks the input as required.                                    |
| `disabled`  | `boolean`             | `false`     | Disables the input.                                             |
| `...rest`   | —                     | —           | Spread onto the `<input>`.                                      |

## Usage

```svelte
<script lang="ts">
    import VitalSignHeartRateAsBeatsPerMinuteInput from "./VitalSignHeartRateAsBeatsPerMinuteInput.svelte";

    let heartRate = $state<number | undefined>(undefined);
</script>

<VitalSignHeartRateAsBeatsPerMinuteInput
    label="Heart rate (bpm)"
    bind:value={heartRate}
/>
```

```svelte
<script lang="ts">
    import VitalSignHeartRateAsBeatsPerMinuteInput from "./VitalSignHeartRateAsBeatsPerMinuteInput.svelte";

    let heartRate = $state<number | undefined>(72);
</script>

<VitalSignHeartRateAsBeatsPerMinuteInput
    label="Heart rate (bpm)"
    bind:value={heartRate}
    min={30}
    max={250}
    required
/>
```

```svelte
<script lang="ts">
    import VitalSignHeartRateAsBeatsPerMinuteInput from "./VitalSignHeartRateAsBeatsPerMinuteInput.svelte";
    import VitalSignRespiratoryRateAsBreathsPerMinuteInput from "../VitalSignRespiratoryRateAsBreathsPerMinuteInput/VitalSignRespiratoryRateAsBreathsPerMinuteInput.svelte";
    import VitalSignGroupInput from "../VitalSignGroupInput/VitalSignGroupInput.svelte";

    let hr = $state<number | undefined>(undefined);
    let rr = $state<number | undefined>(undefined);
</script>

<VitalSignGroupInput label="Vitals">
    <VitalSignHeartRateAsBeatsPerMinuteInput label="Heart rate (bpm)" bind:value={hr} />
    <VitalSignRespiratoryRateAsBreathsPerMinuteInput label="Respiratory rate" bind:value={rr} />
</VitalSignGroupInput>
```

```svelte
<script lang="ts">
    import VitalSignHeartRateAsBeatsPerMinuteInput from "./VitalSignHeartRateAsBeatsPerMinuteInput.svelte";
    import Field from "../Field/Field.svelte";

    let hr = $state<number | undefined>(undefined);
    let error = $state("");
</script>

<Field label="Heart rate (bpm)" required error={error}>
    <VitalSignHeartRateAsBeatsPerMinuteInput
        label="Heart rate (bpm)"
        bind:value={hr}
        required
    />
</Field>
```

## Accessibility

- `aria-label` supplies the accessible name; include the unit (`bpm`).
- Implicit `spinbutton` role; Up/Down arrow keys step by 1.
- `min`, `max`, `step` constrain input with native validation.
- Consumer CSS must provide a WCAG 2.2 AAA focus indicator.

## Related components

- `VitalSignHeartRateAsBeatsPerMinuteView` — the read-only View counterpart in the Input/View pattern.
- `VitalSignHeartRateVariabilityInput` — HRV capture.
- `VitalSignBloodPressureSystolicAsMmhgInput` / `VitalSignBloodPressureDiastolicAsMmhgInput` — BP inputs commonly captured with HR.
- `VitalSignGroupInput` — groups multiple vital-sign inputs.
- `Field` — provides label/hint/error wrapping.
