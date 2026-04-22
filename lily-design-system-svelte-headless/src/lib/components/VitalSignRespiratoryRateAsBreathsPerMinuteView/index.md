# VitalSignRespiratoryRateAsBreathsPerMinuteView

A headless read-only display of a respiratory rate value in breaths per minute. It renders a semantic `<span>` with `role="img"`, `aria-label`, and `data-value`.

## What it is

A passive, unstyled view element for showing a respiratory-rate reading. Screen readers hear the full description via `aria-label`; sighted users see the numeric value.

## What it does

- Renders `<span role="img">` with `aria-label` from the `label` prop.
- Exposes the numeric value through `data-value={value}`.
- Renders the `value` as the visible text content.
- Spreads additional HTML attributes onto the `<span>`.

## When to use it

- Patient monitors, clinical records, and health dashboards.
- Inside a `VitalSignGroupView` alongside heart rate and temperature.
- In a `SummaryList` key/value layout.

## When not to use it

- Capturing a new reading — use `VitalSignRespiratoryRateAsBreathsPerMinuteInput`.
- Displaying SpO2, peak flow, or other respiratory metrics — use dedicated components.
- When interactive behavior is required.

## How to use it

Pass the numeric `value` and a localized, descriptive `label`.

## Props

| Prop        | Type     | Default | Description                                                           |
| ----------- | -------- | ------- | --------------------------------------------------------------------- |
| `class`     | `string` | `""`    | Additional CSS class appended to the base class name.                 |
| `value`     | `number` | —       | Required. Respiratory rate in breaths per minute.                     |
| `label`     | `string` | —       | Required. Accessible description via `aria-label`.                    |
| `...rest`   | —        | —       | Spread onto the `<span>`.                                             |

## Usage

```svelte
<script lang="ts">
    import VitalSignRespiratoryRateAsBreathsPerMinuteView from "./VitalSignRespiratoryRateAsBreathsPerMinuteView.svelte";
</script>

<VitalSignRespiratoryRateAsBreathsPerMinuteView
    value={16}
    label="Respiratory rate: 16 breaths per minute"
/>
```

```svelte
<script lang="ts">
    import VitalSignRespiratoryRateAsBreathsPerMinuteView from "./VitalSignRespiratoryRateAsBreathsPerMinuteView.svelte";

    const rr = 24;
    const label = `Respiratory rate: ${rr} breaths/min (elevated)`;
</script>

<VitalSignRespiratoryRateAsBreathsPerMinuteView value={rr} {label} />
```

```svelte
<script lang="ts">
    import VitalSignRespiratoryRateAsBreathsPerMinuteView from "./VitalSignRespiratoryRateAsBreathsPerMinuteView.svelte";
    import VitalSignHeartRateAsBeatsPerMinuteView from "../VitalSignHeartRateAsBeatsPerMinuteView/VitalSignHeartRateAsBeatsPerMinuteView.svelte";
    import VitalSignGroupView from "../VitalSignGroupView/VitalSignGroupView.svelte";
</script>

<VitalSignGroupView label="Vitals">
    <VitalSignHeartRateAsBeatsPerMinuteView value={72} label="Heart rate: 72 bpm" />
    <VitalSignRespiratoryRateAsBreathsPerMinuteView value={16} label="Respiratory rate: 16 breaths/min" />
</VitalSignGroupView>
```

```svelte
<script lang="ts">
    import VitalSignRespiratoryRateAsBreathsPerMinuteView from "./VitalSignRespiratoryRateAsBreathsPerMinuteView.svelte";
</script>

<dl>
    <dt>Respiratory rate</dt>
    <dd>
        <VitalSignRespiratoryRateAsBreathsPerMinuteView
            value={16}
            label="Respiratory rate: 16 breaths/min"
        />
        <span aria-hidden="true"> breaths/min</span>
    </dd>
</dl>
```

## Accessibility

- `role="img"` marks the element as a cohesive graphic for assistive tech.
- `aria-label` carries the full, localized description including units.
- `data-value={value}` is a styling/testing hook only.
- Consumer CSS is responsible for range indicators.

## Related components

- `VitalSignRespiratoryRateAsBreathsPerMinuteInput` — the editable Input counterpart in the Input/View pattern.
- `VitalSignHeartRateAsBeatsPerMinuteView` — commonly displayed alongside respiratory rate.
- `VitalSignBodyTemperatureAsCelciusView` — frequently bundled in vitals panels.
- `VitalSignGroupView` — groups vital-sign views.
- `SummaryList` / `SummaryListItem` — grouped reading displays.
