# VitalSignBodyTemperatureAsCelciusInput

A headless numeric input for entering a body temperature value in degrees Celsius. It wraps a native `<input type="number">` with physiologically sensible bounds and decimal precision, plus a bindable numeric value.

## What it is

An unstyled, semantic `<input type="number">` for body temperature entry. No CSS, no visual styling — consumers provide all styles.

## What it does

- Renders `<input type="number">` with `aria-label` from the `label` prop.
- Defaults to `min=30`, `max=45`, `step=0.1` (one-decimal Celsius precision, covering extreme hypothermia through extreme hyperthermia).
- Supports `bind:value` via `$bindable(undefined)`.
- Passes through `required`/`disabled` and spreads additional HTML attributes.

## When to use it

- Clinical forms recording a body temperature measurement.
- Patient self-reporting apps and fever-tracker tools.
- Inside a `VitalSignGroupInput` composition.

## When not to use it

- Displaying a previously recorded reading — use `VitalSignBodyTemperatureAsCelciusView`.
- Capturing temperature in Fahrenheit — the component is Celsius-native. Convert in the consumer and format as appropriate.
- Capturing environmental or room temperature unrelated to a body reading.

## How to use it

Import, bind `value`, supply `label`. Optionally wrap with `Field`. The narrow default range (30–45) is intentional for adult body temperature; override when monitoring neonates or unusual clinical contexts.

## Props

| Prop        | Type                  | Default     | Description                                                     |
| ----------- | --------------------- | ----------- | --------------------------------------------------------------- |
| `class`     | `string`              | `""`        | Additional CSS class appended to the base class name.           |
| `label`     | `string`              | —           | Required. Accessible name via `aria-label`.                     |
| `value`     | `number \| undefined` | `undefined` | Bindable body temperature in degrees Celsius.                   |
| `min`       | `number`              | `30`        | Minimum value (°C).                                             |
| `max`       | `number`              | `45`        | Maximum value (°C).                                             |
| `step`      | `number`              | `0.1`       | Step size (°C).                                                 |
| `required`  | `boolean`             | `false`     | Marks the input as required.                                    |
| `disabled`  | `boolean`             | `false`     | Disables the input.                                             |
| `...rest`   | —                     | —           | Spread onto the `<input>`.                                      |

## Usage

```svelte
<script lang="ts">
    import VitalSignBodyTemperatureAsCelciusInput from "./VitalSignBodyTemperatureAsCelciusInput.svelte";

    let temperature = $state<number | undefined>(undefined);
</script>

<VitalSignBodyTemperatureAsCelciusInput
    label="Body temperature (°C)"
    bind:value={temperature}
/>
```

```svelte
<script lang="ts">
    import VitalSignBodyTemperatureAsCelciusInput from "./VitalSignBodyTemperatureAsCelciusInput.svelte";

    let temperature = $state<number | undefined>(37.0);
</script>

<VitalSignBodyTemperatureAsCelciusInput
    label="Body temperature (°C)"
    bind:value={temperature}
    min={34}
    max={42}
    step={0.1}
    required
/>
```

```svelte
<script lang="ts">
    import VitalSignBodyTemperatureAsCelciusInput from "./VitalSignBodyTemperatureAsCelciusInput.svelte";
    import VitalSignGroupInput from "../VitalSignGroupInput/VitalSignGroupInput.svelte";

    let temperature = $state<number | undefined>(undefined);
</script>

<VitalSignGroupInput label="Vitals">
    <VitalSignBodyTemperatureAsCelciusInput
        label="Body temperature (°C)"
        bind:value={temperature}
    />
</VitalSignGroupInput>
```

```svelte
<script lang="ts">
    import VitalSignBodyTemperatureAsCelciusInput from "./VitalSignBodyTemperatureAsCelciusInput.svelte";
    import Field from "../Field/Field.svelte";

    let temperature = $state<number | undefined>(undefined);
    let error = $state("");
</script>

<Field label="Body temperature (°C)" required error={error}>
    <VitalSignBodyTemperatureAsCelciusInput
        label="Body temperature (°C)"
        bind:value={temperature}
        required
    />
</Field>
```

## Accessibility

- `aria-label` provides the accessible name; include the unit (`°C`).
- Implicit `spinbutton` role; Up/Down arrow keys step by `0.1` by default.
- `min`, `max`, `step` constrain input with native validation.
- Consumer CSS must provide a WCAG 2.2 AAA focus indicator.

## Related components

- `VitalSignBodyTemperatureAsCelciusView` — the read-only View counterpart in the Input/View pattern.
- `VitalSignHeartRateAsBeatsPerMinuteInput` — commonly captured together in vitals.
- `VitalSignRespiratoryRateAsBreathsPerMinuteInput` — frequently bundled in vitals panels.
- `VitalSignGroupInput` — groups multiple vital sign inputs.
- `Field` — provides label/hint/error wrapping.
