# VitalSignBloodPressureDiastolicAsMmhgView

A headless read-only display of the diastolic blood pressure value in millimetres of mercury (mmHg). It renders a semantic `<span>` with `role="img"`, `aria-label`, and `data-value` so consumers can style and hook in without disturbing the accessible name.

## What it is

A passive, unstyled view element for showing a diastolic blood pressure reading. Screen readers hear the full description via `aria-label`; sighted users see just the numeric value.

## What it does

- Renders `<span role="img">` with `aria-label` from the `label` prop.
- Exposes the numeric value through `data-value={value}`.
- Renders the `value` as the visible text content.
- Spreads any additional HTML attributes onto the `<span>`.

## When to use it

- Patient monitors, medical records, and health dashboards showing recorded BP values.
- Paired with `VitalSignBloodPressureSystolicAsMmhgView` to show a full BP reading.
- Inside a `VitalSignGroupView`.

## When not to use it

- Collecting a new reading — use `VitalSignBloodPressureDiastolicAsMmhgInput`.
- Displaying the systolic component — use `VitalSignBloodPressureSystolicAsMmhgView`.
- When interactive behavior (editing, sliders) is required.

## How to use it

Pass the numeric `value` and a localized, descriptive `label` that includes the units and context.

## Props

| Prop        | Type     | Default | Description                                                           |
| ----------- | -------- | ------- | --------------------------------------------------------------------- |
| `class`     | `string` | `""`    | Additional CSS class appended to the base class name.                 |
| `value`     | `number` | —       | Required. Diastolic reading in mmHg.                                  |
| `label`     | `string` | —       | Required. Accessible description via `aria-label`.                    |
| `...rest`   | —        | —       | Spread onto the `<span>`.                                             |

## Usage

```svelte
<script lang="ts">
    import VitalSignBloodPressureDiastolicAsMmhgView from "./VitalSignBloodPressureDiastolicAsMmhgView.svelte";
</script>

<VitalSignBloodPressureDiastolicAsMmhgView
    value={80}
    label="Diastolic blood pressure: 80 millimetres of mercury"
/>
```

```svelte
<script lang="ts">
    import VitalSignBloodPressureDiastolicAsMmhgView from "./VitalSignBloodPressureDiastolicAsMmhgView.svelte";

    const reading = 95;
    const label = `Diastolic blood pressure: ${reading} mmHg (elevated)`;
</script>

<VitalSignBloodPressureDiastolicAsMmhgView value={reading} {label} />
```

```svelte
<script lang="ts">
    import VitalSignBloodPressureSystolicAsMmhgView from "../VitalSignBloodPressureSystolicAsMmhgView/VitalSignBloodPressureSystolicAsMmhgView.svelte";
    import VitalSignBloodPressureDiastolicAsMmhgView from "./VitalSignBloodPressureDiastolicAsMmhgView.svelte";
    import VitalSignGroupView from "../VitalSignGroupView/VitalSignGroupView.svelte";
</script>

<VitalSignGroupView label="Blood pressure">
    <VitalSignBloodPressureSystolicAsMmhgView value={120} label="Systolic: 120 mmHg" />
    <span aria-hidden="true">/</span>
    <VitalSignBloodPressureDiastolicAsMmhgView value={80} label="Diastolic: 80 mmHg" />
</VitalSignGroupView>
```

```svelte
<script lang="ts">
    import VitalSignBloodPressureDiastolicAsMmhgView from "./VitalSignBloodPressureDiastolicAsMmhgView.svelte";
</script>

<VitalSignBloodPressureDiastolicAsMmhgView
    class="bp-diastolic"
    value={72}
    label="Diastolic: 72 mmHg"
    data-testid="bp-diastolic"
/>
```

## Accessibility

- `role="img"` ensures the span is announced as a cohesive graphic rather than a bare number.
- `aria-label` carries the full, localized accessible description including units.
- `data-value={value}` is a styling/testing hook only; it is not read by assistive tech.
- Consumer CSS is responsible for visual range indications (normal/elevated/high).

## Related components

- `VitalSignBloodPressureDiastolicAsMmhgInput` — the editable Input counterpart in the Input/View pattern.
- `VitalSignBloodPressureSystolicAsMmhgView` — systolic counterpart, usually shown together.
- `VitalSignHeartRateAsBeatsPerMinuteView` — heart rate frequently displayed alongside BP.
- `VitalSignGroupView` — groups multiple vital sign views.
- `SummaryList` / `SummaryListItem` — a common container for grouped readings.
