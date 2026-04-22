# VitalSignHeartRateAsBeatsPerMinuteView

A headless read-only display of a heart rate in beats per minute (bpm). It renders a semantic `<span>` with `role="img"`, `aria-label`, and `data-value`.

## What it is

A passive, unstyled view element for showing a heart rate reading. Screen readers hear the full description via `aria-label`; sighted users see the numeric value.

## What it does

- Renders `<span role="img">` with `aria-label` from the `label` prop.
- Exposes the numeric value through `data-value={value}`.
- Renders the `value` as the visible text content.
- Spreads additional HTML attributes onto the `<span>`.

## When to use it

- Patient monitors, clinical records, and health dashboards.
- Inside a `VitalSignGroupView` alongside respiratory rate, temperature, and BP.
- In a `SummaryList` key/value layout.

## When not to use it

- Capturing a new reading — use `VitalSignHeartRateAsBeatsPerMinuteInput`.
- Displaying heart rate variability — use `VitalSignHeartRateVariabilityView`.
- When interactive behavior is required.

## How to use it

Pass the numeric `value` and a localized descriptive `label`.

## Props

| Prop        | Type     | Default | Description                                                           |
| ----------- | -------- | ------- | --------------------------------------------------------------------- |
| `class`     | `string` | `""`    | Additional CSS class appended to the base class name.                 |
| `value`     | `number` | —       | Required. Heart rate in bpm.                                          |
| `label`     | `string` | —       | Required. Accessible description via `aria-label`.                    |
| `...rest`   | —        | —       | Spread onto the `<span>`.                                             |

## Usage

```svelte
<script lang="ts">
    import VitalSignHeartRateAsBeatsPerMinuteView from "./VitalSignHeartRateAsBeatsPerMinuteView.svelte";
</script>

<VitalSignHeartRateAsBeatsPerMinuteView
    value={72}
    label="Heart rate: 72 beats per minute"
/>
```

```svelte
<script lang="ts">
    import VitalSignHeartRateAsBeatsPerMinuteView from "./VitalSignHeartRateAsBeatsPerMinuteView.svelte";

    const bpm = 110;
    const label = `Heart rate: ${bpm} bpm (elevated)`;
</script>

<VitalSignHeartRateAsBeatsPerMinuteView value={bpm} {label} />
```

```svelte
<script lang="ts">
    import VitalSignHeartRateAsBeatsPerMinuteView from "./VitalSignHeartRateAsBeatsPerMinuteView.svelte";
    import VitalSignRespiratoryRateAsBreathsPerMinuteView from "../VitalSignRespiratoryRateAsBreathsPerMinuteView/VitalSignRespiratoryRateAsBreathsPerMinuteView.svelte";
    import VitalSignGroupView from "../VitalSignGroupView/VitalSignGroupView.svelte";
</script>

<VitalSignGroupView label="Vitals">
    <VitalSignHeartRateAsBeatsPerMinuteView value={72} label="Heart rate: 72 bpm" />
    <VitalSignRespiratoryRateAsBreathsPerMinuteView value={16} label="Respiratory rate: 16 breaths/min" />
</VitalSignGroupView>
```

```svelte
<script lang="ts">
    import VitalSignHeartRateAsBeatsPerMinuteView from "./VitalSignHeartRateAsBeatsPerMinuteView.svelte";
</script>

<dl>
    <dt>Heart rate</dt>
    <dd>
        <VitalSignHeartRateAsBeatsPerMinuteView value={72} label="Heart rate: 72 bpm" />
        <span aria-hidden="true"> bpm</span>
    </dd>
</dl>
```

## Accessibility

- `role="img"` marks the element as a cohesive graphic for assistive tech.
- `aria-label` carries the full, localized description including units.
- `data-value={value}` is a styling/testing hook only.
- Consumer CSS is responsible for any color/range indicators.

## Related components

- `VitalSignHeartRateAsBeatsPerMinuteInput` — the editable Input counterpart in the Input/View pattern.
- `VitalSignHeartRateVariabilityView` — HRV view.
- `VitalSignBloodPressureSystolicAsMmhgView` / `VitalSignBloodPressureDiastolicAsMmhgView` — BP views shown alongside HR.
- `VitalSignGroupView` — groups multiple vital-sign views.
- `SummaryList` / `SummaryListItem` — grouped reading displays.
