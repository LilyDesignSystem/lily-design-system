# VitalSignHeartRateVariabilityInput

A headless numeric input for entering a heart rate variability (HRV) value. It wraps a native `<input type="number">` with sensible default bounds and a bindable numeric value. HRV is typically reported in milliseconds (for example, RMSSD or SDNN).

## What it is

An unstyled, semantic `<input type="number">` for HRV entry. No CSS, no visual styling — consumers provide all styles and choose the specific HRV metric (RMSSD, SDNN, etc.) via the `label`.

## What it does

- Renders `<input type="number">` with `aria-label` from the `label` prop.
- Defaults to `min=0`, `max=500`, `step=1` (integer value, typically milliseconds).
- Supports `bind:value` via `$bindable(undefined)`.
- Passes through `required`/`disabled` and spreads additional HTML attributes.

## When to use it

- Wearable-sync or manual-logging forms for HRV.
- Training-load tracking and recovery-score apps.
- Inside a `VitalSignGroupInput` composition alongside heart rate.

## When not to use it

- Recording a resting heart rate — use `VitalSignHeartRateAsBeatsPerMinuteInput`.
- Displaying a previously recorded HRV reading — use `VitalSignHeartRateVariabilityView`.
- Capturing very precise sub-millisecond values unless you override `step`.

## How to use it

Import, bind `value`, and supply a descriptive `label` that identifies the HRV metric and unit (e.g., `"HRV (RMSSD, ms)"`).

## Props

| Prop        | Type                  | Default     | Description                                                     |
| ----------- | --------------------- | ----------- | --------------------------------------------------------------- |
| `class`     | `string`              | `""`        | Additional CSS class appended to the base class name.           |
| `label`     | `string`              | —           | Required. Accessible name via `aria-label`.                     |
| `value`     | `number \| undefined` | `undefined` | Bindable HRV value.                                             |
| `min`       | `number`              | `0`         | Minimum value.                                                  |
| `max`       | `number`              | `500`       | Maximum value.                                                  |
| `step`      | `number`              | `1`         | Step size.                                                      |
| `required`  | `boolean`             | `false`     | Marks the input as required.                                    |
| `disabled`  | `boolean`             | `false`     | Disables the input.                                             |
| `...rest`   | —                     | —           | Spread onto the `<input>`.                                      |

## Usage

```svelte
<script lang="ts">
    import VitalSignHeartRateVariabilityInput from "./VitalSignHeartRateVariabilityInput.svelte";

    let hrv = $state<number | undefined>(undefined);
</script>

<VitalSignHeartRateVariabilityInput
    label="Heart rate variability (ms)"
    bind:value={hrv}
/>
```

```svelte
<script lang="ts">
    import VitalSignHeartRateVariabilityInput from "./VitalSignHeartRateVariabilityInput.svelte";

    let rmssd = $state<number | undefined>(45);
</script>

<VitalSignHeartRateVariabilityInput
    label="HRV (RMSSD, ms)"
    bind:value={rmssd}
    min={1}
    max={200}
    required
/>
```

```svelte
<script lang="ts">
    import VitalSignHeartRateVariabilityInput from "./VitalSignHeartRateVariabilityInput.svelte";
    import VitalSignHeartRateAsBeatsPerMinuteInput from "../VitalSignHeartRateAsBeatsPerMinuteInput/VitalSignHeartRateAsBeatsPerMinuteInput.svelte";
    import VitalSignGroupInput from "../VitalSignGroupInput/VitalSignGroupInput.svelte";

    let hr = $state<number | undefined>(undefined);
    let hrv = $state<number | undefined>(undefined);
</script>

<VitalSignGroupInput label="Cardiac readiness">
    <VitalSignHeartRateAsBeatsPerMinuteInput label="Heart rate (bpm)" bind:value={hr} />
    <VitalSignHeartRateVariabilityInput label="HRV (ms)" bind:value={hrv} />
</VitalSignGroupInput>
```

```svelte
<script lang="ts">
    import VitalSignHeartRateVariabilityInput from "./VitalSignHeartRateVariabilityInput.svelte";
    import Field from "../Field/Field.svelte";

    let hrv = $state<number | undefined>(undefined);
    let error = $state("");
</script>

<Field label="HRV (ms)" error={error}>
    <VitalSignHeartRateVariabilityInput label="HRV (ms)" bind:value={hrv} />
</Field>
```

## Accessibility

- `aria-label` provides the accessible name; identify the metric (RMSSD, SDNN) and unit (`ms`).
- Implicit `spinbutton` role; Up/Down arrow keys step by 1.
- `min`, `max`, `step` constrain input with native validation.
- Consumer CSS must provide a WCAG 2.2 AAA focus indicator.

## Related components

- `VitalSignHeartRateVariabilityView` — the read-only View counterpart in the Input/View pattern.
- `VitalSignHeartRateAsBeatsPerMinuteInput` — companion heart-rate input.
- `VitalSignVo2MaxAsMlPerKgPerMinuteInput` — other cardiovascular fitness input.
- `VitalSignGroupInput` — groups multiple vital-sign inputs.
- `Field` — provides label/hint/error wrapping.
