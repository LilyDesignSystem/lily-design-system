# VitalSignHeartRateVariabilityView

A headless read-only display of a heart rate variability (HRV) value. It renders a semantic `<span>` with `role="img"`, `aria-label`, and `data-value`.

## What it is

A passive, unstyled view element for showing an HRV reading. Screen readers hear the full description via `aria-label`; sighted users see the numeric value.

## What it does

- Renders `<span role="img">` with `aria-label` from the `label` prop.
- Exposes the numeric value through `data-value={value}`.
- Renders the `value` as the visible text content.
- Spreads additional HTML attributes onto the `<span>`.

## When to use it

- Training or recovery dashboards showing an HRV trend or last reading.
- Inside a `VitalSignGroupView` alongside heart rate.
- In a `SummaryList` key/value layout.

## When not to use it

- Capturing a new reading — use `VitalSignHeartRateVariabilityInput`.
- Displaying resting heart rate — use `VitalSignHeartRateAsBeatsPerMinuteView`.
- When interactive behavior is required.

## How to use it

Pass the numeric `value` and a localized descriptive `label` that names the metric and unit.

## Props

| Prop        | Type     | Default | Description                                                           |
| ----------- | -------- | ------- | --------------------------------------------------------------------- |
| `class`     | `string` | `""`    | Additional CSS class appended to the base class name.                 |
| `value`     | `number` | —       | Required. HRV value.                                                  |
| `label`     | `string` | —       | Required. Accessible description via `aria-label`.                    |
| `...rest`   | —        | —       | Spread onto the `<span>`.                                             |

## Usage

```svelte
<script lang="ts">
    import VitalSignHeartRateVariabilityView from "./VitalSignHeartRateVariabilityView.svelte";
</script>

<VitalSignHeartRateVariabilityView
    value={45}
    label="Heart rate variability (RMSSD): 45 milliseconds"
/>
```

```svelte
<script lang="ts">
    import VitalSignHeartRateVariabilityView from "./VitalSignHeartRateVariabilityView.svelte";

    const hrv = 62;
    const label = `HRV: ${hrv} ms`;
</script>

<VitalSignHeartRateVariabilityView value={hrv} {label} />
```

```svelte
<script lang="ts">
    import VitalSignHeartRateVariabilityView from "./VitalSignHeartRateVariabilityView.svelte";
    import VitalSignHeartRateAsBeatsPerMinuteView from "../VitalSignHeartRateAsBeatsPerMinuteView/VitalSignHeartRateAsBeatsPerMinuteView.svelte";
    import VitalSignGroupView from "../VitalSignGroupView/VitalSignGroupView.svelte";
</script>

<VitalSignGroupView label="Cardiac readiness">
    <VitalSignHeartRateAsBeatsPerMinuteView value={52} label="Resting HR: 52 bpm" />
    <VitalSignHeartRateVariabilityView value={62} label="HRV: 62 ms" />
</VitalSignGroupView>
```

```svelte
<script lang="ts">
    import VitalSignHeartRateVariabilityView from "./VitalSignHeartRateVariabilityView.svelte";
</script>

<dl>
    <dt>HRV</dt>
    <dd>
        <VitalSignHeartRateVariabilityView value={45} label="HRV: 45 ms" />
        <span aria-hidden="true"> ms</span>
    </dd>
</dl>
```

## Accessibility

- `role="img"` marks the element as a cohesive graphic for assistive tech.
- `aria-label` carries the full, localized description (metric + unit).
- `data-value={value}` is a styling/testing hook only.
- Consumer CSS is responsible for range indicators.

## Related components

- `VitalSignHeartRateVariabilityInput` — the editable Input counterpart in the Input/View pattern.
- `VitalSignHeartRateAsBeatsPerMinuteView` — companion heart-rate view.
- `VitalSignVo2MaxAsMlPerKgPerMinuteView` — cardiovascular fitness view.
- `VitalSignGroupView` — groups multiple vital-sign views.
- `SummaryList` / `SummaryListItem` — grouped reading displays.
