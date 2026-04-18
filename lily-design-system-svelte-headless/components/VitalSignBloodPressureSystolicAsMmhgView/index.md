# VitalSignBloodPressureSystolicAsMmhgView

A headless read-only display of the systolic blood pressure value in millimetres of mercury (mmHg). It renders a semantic `<span>` with `role="img"`, `aria-label`, and `data-value` so consumers can style and hook in without disturbing the accessible name.

## What it is

A passive, unstyled view element for showing a systolic blood pressure reading. Screen readers hear the full description via `aria-label`; sighted users see just the numeric value.

## What it does

- Renders `<span role="img">` with `aria-label` from the `label` prop.
- Exposes the numeric value through `data-value={value}`.
- Renders the `value` as the visible text content.
- Spreads any additional HTML attributes onto the `<span>`.

## When to use it

- Patient monitors, records, and health dashboards displaying recorded BP values.
- Paired with `VitalSignBloodPressureDiastolicAsMmhgView` for a full reading.
- Inside a `VitalSignGroupView` composition.

## When not to use it

- Capturing a new reading — use `VitalSignBloodPressureSystolicAsMmhgInput`.
- Displaying the diastolic component — use `VitalSignBloodPressureDiastolicAsMmhgView`.
- When interactive behavior is required.

## How to use it

Pass the numeric `value` and a localized descriptive `label`.

## Props

| Prop        | Type     | Default | Description                                                           |
| ----------- | -------- | ------- | --------------------------------------------------------------------- |
| `class`     | `string` | `""`    | Additional CSS class appended to the base class name.                 |
| `value`     | `number` | —       | Required. Systolic reading in mmHg.                                   |
| `label`     | `string` | —       | Required. Accessible description via `aria-label`.                    |
| `...rest`   | —        | —       | Spread onto the `<span>`.                                             |

## Usage

```svelte
<script lang="ts">
    import VitalSignBloodPressureSystolicAsMmhgView from "./VitalSignBloodPressureSystolicAsMmhgView.svelte";
</script>

<VitalSignBloodPressureSystolicAsMmhgView
    value={120}
    label="Systolic blood pressure: 120 millimetres of mercury"
/>
```

```svelte
<script lang="ts">
    import VitalSignBloodPressureSystolicAsMmhgView from "./VitalSignBloodPressureSystolicAsMmhgView.svelte";

    const reading = 145;
    const label = `Systolic blood pressure: ${reading} mmHg (high)`;
</script>

<VitalSignBloodPressureSystolicAsMmhgView value={reading} {label} />
```

```svelte
<script lang="ts">
    import VitalSignBloodPressureSystolicAsMmhgView from "./VitalSignBloodPressureSystolicAsMmhgView.svelte";
    import VitalSignBloodPressureDiastolicAsMmhgView from "../VitalSignBloodPressureDiastolicAsMmhgView/VitalSignBloodPressureDiastolicAsMmhgView.svelte";
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
    import VitalSignBloodPressureSystolicAsMmhgView from "./VitalSignBloodPressureSystolicAsMmhgView.svelte";
</script>

<dl>
    <dt>Systolic BP</dt>
    <dd>
        <VitalSignBloodPressureSystolicAsMmhgView
            value={120}
            label="Systolic: 120 mmHg"
        />
        <span aria-hidden="true"> mmHg</span>
    </dd>
</dl>
```

## Accessibility

- `role="img"` lets assistive tech announce the element as a cohesive graphic.
- `aria-label` carries the full, localized description including units.
- `data-value={value}` is a styling/testing hook; it is not surfaced to screen readers.
- Consumer CSS is responsible for visual range indications.

## Related components

- `VitalSignBloodPressureSystolicAsMmhgInput` — the editable Input counterpart in the Input/View pattern.
- `VitalSignBloodPressureDiastolicAsMmhgView` — diastolic counterpart, usually shown together.
- `VitalSignHeartRateAsBeatsPerMinuteView` — heart rate frequently displayed alongside BP.
- `VitalSignGroupView` — groups multiple vital sign views.
- `SummaryList` / `SummaryListItem` — grouped reading displays.
