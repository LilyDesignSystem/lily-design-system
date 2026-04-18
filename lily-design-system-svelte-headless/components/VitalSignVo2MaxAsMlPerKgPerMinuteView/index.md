# VitalSignVo2MaxAsMlPerKgPerMinuteView

A headless read-only display of a VO2 max (maximal oxygen uptake) value in millilitres per kilogram per minute (mL/kg/min). It renders a semantic `<span>` with `role="img"`, `aria-label`, and `data-value`.

## What it is

A passive, unstyled view element for showing a VO2 max reading. Screen readers hear the full description via `aria-label`; sighted users see the numeric value.

## What it does

- Renders `<span role="img">` with `aria-label` from the `label` prop.
- Exposes the numeric value through `data-value={value}`.
- Renders the `value` as the visible text content.
- Spreads additional HTML attributes onto the `<span>`.

## When to use it

- Fitness dashboards, wearable-device summaries, cardiorespiratory-test reports.
- Inside a `VitalSignGroupView` alongside heart rate and HRV.
- In a `SummaryList` key/value layout.

## When not to use it

- Capturing a new value — use `VitalSignVo2MaxAsMlPerKgPerMinuteInput`.
- Displaying absolute VO2 in L/min rather than relative — use a generic view with custom formatting.
- When interactive behavior is required.

## How to use it

Pass the numeric `value` and a localized, descriptive `label`.

## Props

| Prop        | Type     | Default | Description                                                           |
| ----------- | -------- | ------- | --------------------------------------------------------------------- |
| `class`     | `string` | `""`    | Additional CSS class appended to the base class name.                 |
| `value`     | `number` | —       | Required. VO2 max in mL/kg/min.                                       |
| `label`     | `string` | —       | Required. Accessible description via `aria-label`.                    |
| `...rest`   | —        | —       | Spread onto the `<span>`.                                             |

## Usage

```svelte
<script lang="ts">
    import VitalSignVo2MaxAsMlPerKgPerMinuteView from "./VitalSignVo2MaxAsMlPerKgPerMinuteView.svelte";
</script>

<VitalSignVo2MaxAsMlPerKgPerMinuteView
    value={48}
    label="VO2 max: 48 millilitres per kilogram per minute"
/>
```

```svelte
<script lang="ts">
    import VitalSignVo2MaxAsMlPerKgPerMinuteView from "./VitalSignVo2MaxAsMlPerKgPerMinuteView.svelte";

    const v = 55;
    const label = `VO2 max: ${v} mL/kg/min (excellent)`;
</script>

<VitalSignVo2MaxAsMlPerKgPerMinuteView value={v} {label} />
```

```svelte
<script lang="ts">
    import VitalSignVo2MaxAsMlPerKgPerMinuteView from "./VitalSignVo2MaxAsMlPerKgPerMinuteView.svelte";
    import VitalSignHeartRateAsBeatsPerMinuteView from "../VitalSignHeartRateAsBeatsPerMinuteView/VitalSignHeartRateAsBeatsPerMinuteView.svelte";
    import VitalSignGroupView from "../VitalSignGroupView/VitalSignGroupView.svelte";
</script>

<VitalSignGroupView label="Fitness">
    <VitalSignVo2MaxAsMlPerKgPerMinuteView value={48} label="VO2 max: 48 mL/kg/min" />
    <VitalSignHeartRateAsBeatsPerMinuteView value={52} label="Resting HR: 52 bpm" />
</VitalSignGroupView>
```

```svelte
<script lang="ts">
    import VitalSignVo2MaxAsMlPerKgPerMinuteView from "./VitalSignVo2MaxAsMlPerKgPerMinuteView.svelte";
</script>

<dl>
    <dt>VO2 max</dt>
    <dd>
        <VitalSignVo2MaxAsMlPerKgPerMinuteView value={48} label="VO2 max: 48 mL/kg/min" />
        <span aria-hidden="true"> mL/kg/min</span>
    </dd>
</dl>
```

## Accessibility

- `role="img"` marks the element as a cohesive graphic for assistive tech.
- `aria-label` carries the full, localized description including units.
- `data-value={value}` is a styling/testing hook only.
- Consumer CSS is responsible for any range indicators.

## Related components

- `VitalSignVo2MaxAsMlPerKgPerMinuteInput` — the editable Input counterpart in the Input/View pattern.
- `VitalSignHeartRateAsBeatsPerMinuteView` — partner cardiovascular view.
- `VitalSignHeartRateVariabilityView` — complementary recovery view.
- `VitalSignGroupView` — groups vital-sign views.
- `SummaryList` / `SummaryListItem` — grouped reading displays.
