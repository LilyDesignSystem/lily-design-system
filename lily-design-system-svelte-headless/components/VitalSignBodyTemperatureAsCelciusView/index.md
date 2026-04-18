# VitalSignBodyTemperatureAsCelciusView

A headless read-only display of a body temperature reading in degrees Celsius. It renders a semantic `<span>` with `role="img"`, `aria-label`, and `data-value` so consumers can style and hook in without disturbing the accessible name.

## What it is

A passive, unstyled view element for showing a body temperature reading. Screen readers hear the full description via `aria-label`; sighted users see the numeric value (with one decimal place as supplied).

## What it does

- Renders `<span role="img">` with `aria-label` from the `label` prop.
- Exposes the numeric value through `data-value={value}`.
- Renders the `value` as the visible text content.
- Spreads additional HTML attributes onto the `<span>`.

## When to use it

- Patient monitors, clinical records, and health dashboards.
- Inside a `VitalSignGroupView` alongside heart rate, respiratory rate, and BP.
- In a `SummaryList` key/value layout.

## When not to use it

- Capturing a new reading — use `VitalSignBodyTemperatureAsCelciusInput`.
- Displaying temperature in Fahrenheit — convert in the consumer and format as appropriate.
- When interactive behavior is required.

## How to use it

Pass the numeric `value` and a localized descriptive `label`.

## Props

| Prop        | Type     | Default | Description                                                           |
| ----------- | -------- | ------- | --------------------------------------------------------------------- |
| `class`     | `string` | `""`    | Additional CSS class appended to the base class name.                 |
| `value`     | `number` | —       | Required. Body temperature in degrees Celsius.                        |
| `label`     | `string` | —       | Required. Accessible description via `aria-label`.                    |
| `...rest`   | —        | —       | Spread onto the `<span>`.                                             |

## Usage

```svelte
<script lang="ts">
    import VitalSignBodyTemperatureAsCelciusView from "./VitalSignBodyTemperatureAsCelciusView.svelte";
</script>

<VitalSignBodyTemperatureAsCelciusView
    value={37.0}
    label="Body temperature: 37.0 degrees Celsius"
/>
```

```svelte
<script lang="ts">
    import VitalSignBodyTemperatureAsCelciusView from "./VitalSignBodyTemperatureAsCelciusView.svelte";

    const temp = 38.5;
    const label = `Body temperature: ${temp}°C (elevated)`;
</script>

<VitalSignBodyTemperatureAsCelciusView value={temp} {label} />
```

```svelte
<script lang="ts">
    import VitalSignBodyTemperatureAsCelciusView from "./VitalSignBodyTemperatureAsCelciusView.svelte";
    import VitalSignGroupView from "../VitalSignGroupView/VitalSignGroupView.svelte";
</script>

<VitalSignGroupView label="Vitals">
    <VitalSignBodyTemperatureAsCelciusView
        value={37.0}
        label="Body temperature: 37.0°C"
    />
</VitalSignGroupView>
```

```svelte
<script lang="ts">
    import VitalSignBodyTemperatureAsCelciusView from "./VitalSignBodyTemperatureAsCelciusView.svelte";
</script>

<dl>
    <dt>Temperature</dt>
    <dd>
        <VitalSignBodyTemperatureAsCelciusView
            value={37.0}
            label="Body temperature: 37.0°C"
        />
        <span aria-hidden="true"> °C</span>
    </dd>
</dl>
```

## Accessibility

- `role="img"` marks the element as a cohesive graphic.
- `aria-label` carries the full, localized description including units.
- `data-value={value}` is a styling/testing hook only.
- Consumer CSS is responsible for any color/range indicators (e.g., fever).

## Related components

- `VitalSignBodyTemperatureAsCelciusInput` — the editable Input counterpart in the Input/View pattern.
- `VitalSignHeartRateAsBeatsPerMinuteView` — commonly displayed alongside temperature.
- `VitalSignRespiratoryRateAsBreathsPerMinuteView` — frequently bundled in vitals panels.
- `VitalSignGroupView` — groups multiple vital-sign views.
- `SummaryList` / `SummaryListItem` — common container for grouped readings.
