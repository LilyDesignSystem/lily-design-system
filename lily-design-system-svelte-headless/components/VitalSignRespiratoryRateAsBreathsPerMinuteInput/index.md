# VitalSignRespiratoryRateAsBreathsPerMinuteInput

A headless numeric input for entering respiratory rate in breaths per minute. It wraps a native `<input type="number">` with physiologically sensible defaults and a bindable numeric value.

## What it is

An unstyled, semantic `<input type="number">` for respiratory rate entry. No CSS, no visual styling — consumers provide all styles.

## What it does

- Renders `<input type="number">` with `aria-label` from the `label` prop.
- Defaults to `min=0`, `max=100`, `step=1` (integer breaths per minute).
- Supports `bind:value` via `$bindable(undefined)`.
- Passes through `required`/`disabled` and spreads additional HTML attributes.

## When to use it

- Clinical vitals-capture forms (intake, triage, follow-up).
- Pulmonary assessments and respiratory-therapy tools.
- Inside a `VitalSignGroupInput` composition alongside heart rate and temperature.

## When not to use it

- Displaying a previously recorded rate — use `VitalSignRespiratoryRateAsBreathsPerMinuteView`.
- Capturing peak flow, SpO2, or other respiratory metrics — use a dedicated input.
- When the unit is not breaths per minute.

## How to use it

Import, bind `value`, and supply an accessible `label`. Optionally wrap with `Field`.

## Props

| Prop        | Type                  | Default     | Description                                                     |
| ----------- | --------------------- | ----------- | --------------------------------------------------------------- |
| `class`     | `string`              | `""`        | Additional CSS class appended to the base class name.           |
| `label`     | `string`              | —           | Required. Accessible name via `aria-label`.                     |
| `value`     | `number \| undefined` | `undefined` | Bindable respiratory rate in breaths per minute.                |
| `min`       | `number`              | `0`         | Minimum value.                                                  |
| `max`       | `number`              | `100`       | Maximum value.                                                  |
| `step`      | `number`              | `1`         | Step size.                                                      |
| `required`  | `boolean`             | `false`     | Marks the input as required.                                    |
| `disabled`  | `boolean`             | `false`     | Disables the input.                                             |
| `...rest`   | —                     | —           | Spread onto the `<input>`.                                      |

## Usage

```svelte
<script lang="ts">
    import VitalSignRespiratoryRateAsBreathsPerMinuteInput from "./VitalSignRespiratoryRateAsBreathsPerMinuteInput.svelte";

    let rr = $state<number | undefined>(undefined);
</script>

<VitalSignRespiratoryRateAsBreathsPerMinuteInput
    label="Respiratory rate (breaths/min)"
    bind:value={rr}
/>
```

```svelte
<script lang="ts">
    import VitalSignRespiratoryRateAsBreathsPerMinuteInput from "./VitalSignRespiratoryRateAsBreathsPerMinuteInput.svelte";

    let rr = $state<number | undefined>(16);
</script>

<VitalSignRespiratoryRateAsBreathsPerMinuteInput
    label="Respiratory rate (breaths/min)"
    bind:value={rr}
    min={4}
    max={60}
    required
/>
```

```svelte
<script lang="ts">
    import VitalSignRespiratoryRateAsBreathsPerMinuteInput from "./VitalSignRespiratoryRateAsBreathsPerMinuteInput.svelte";
    import VitalSignHeartRateAsBeatsPerMinuteInput from "../VitalSignHeartRateAsBeatsPerMinuteInput/VitalSignHeartRateAsBeatsPerMinuteInput.svelte";
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
    import VitalSignRespiratoryRateAsBreathsPerMinuteInput from "./VitalSignRespiratoryRateAsBreathsPerMinuteInput.svelte";
    import Field from "../Field/Field.svelte";

    let rr = $state<number | undefined>(undefined);
    let error = $state("");
</script>

<Field label="Respiratory rate" required error={error}>
    <VitalSignRespiratoryRateAsBreathsPerMinuteInput
        label="Respiratory rate"
        bind:value={rr}
        required
    />
</Field>
```

## Accessibility

- `aria-label` provides the accessible name; include the unit (`breaths/min`).
- Implicit `spinbutton` role; Up/Down arrow keys step by 1.
- `min`, `max`, `step` constrain input with native validation.
- Consumer CSS must provide a WCAG 2.2 AAA focus indicator.

## Related components

- `VitalSignRespiratoryRateAsBreathsPerMinuteView` — the read-only View counterpart in the Input/View pattern.
- `VitalSignHeartRateAsBeatsPerMinuteInput` — commonly captured alongside respiratory rate.
- `VitalSignBodyTemperatureAsCelciusInput` — frequently bundled in vitals panels.
- `VitalSignGroupInput` — groups vital-sign inputs.
- `Field` — provides label/hint/error wrapping.
