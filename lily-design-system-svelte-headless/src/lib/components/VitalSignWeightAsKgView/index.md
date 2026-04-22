# VitalSignWeightAsKgView

A headless read-only display of a weight value in kilograms. It renders a semantic `<span>` with `role="img"`, `aria-label`, and `data-value`.

## What it is

A passive, unstyled view element for showing a weight reading. Screen readers hear the full description via `aria-label`; sighted users see the numeric value.

## What it does

- Renders `<span role="img">` with `aria-label` from the `label` prop.
- Exposes the numeric value through `data-value={value}`.
- Renders the `value` as the visible text content.
- Spreads additional HTML attributes onto the `<span>`.

## When to use it

- Profile summaries, patient records, fitness dashboards.
- Inside a `VitalSignGroupView` alongside height, belly, and waist readings.
- In a `SummaryList` key/value layout.

## When not to use it

- Capturing a new value — use `VitalSignWeightAsKgInput`.
- Displaying weight in pounds — convert in the consumer; this component is kilogram-native.
- When interactive behavior is required.

## How to use it

Pass the numeric `value` and a localized, descriptive `label`.

## Props

| Prop        | Type     | Default | Description                                                           |
| ----------- | -------- | ------- | --------------------------------------------------------------------- |
| `class`     | `string` | `""`    | Additional CSS class appended to the base class name.                 |
| `value`     | `number` | —       | Required. Weight in kilograms.                                        |
| `label`     | `string` | —       | Required. Accessible description via `aria-label`.                    |
| `...rest`   | —        | —       | Spread onto the `<span>`.                                             |

## Usage

```svelte
<script lang="ts">
    import VitalSignWeightAsKgView from "./VitalSignWeightAsKgView.svelte";
</script>

<VitalSignWeightAsKgView value={68} label="Weight: 68 kilograms" />
```

```svelte
<script lang="ts">
    import VitalSignWeightAsKgView from "./VitalSignWeightAsKgView.svelte";

    const kg = 72.5;
    const label = `Weight: ${kg} kg`;
</script>

<VitalSignWeightAsKgView value={kg} {label} />
```

```svelte
<script lang="ts">
    import VitalSignWeightAsKgView from "./VitalSignWeightAsKgView.svelte";
    import VitalSignHeightAsCmView from "../VitalSignHeightAsCmView/VitalSignHeightAsCmView.svelte";
    import VitalSignGroupView from "../VitalSignGroupView/VitalSignGroupView.svelte";
</script>

<VitalSignGroupView label="Body measurements">
    <VitalSignHeightAsCmView value={170} label="Height: 170 cm" />
    <VitalSignWeightAsKgView value={68} label="Weight: 68 kg" />
</VitalSignGroupView>
```

```svelte
<script lang="ts">
    import VitalSignWeightAsKgView from "./VitalSignWeightAsKgView.svelte";
</script>

<dl>
    <dt>Weight</dt>
    <dd>
        <VitalSignWeightAsKgView value={68} label="Weight: 68 kg" />
        <span aria-hidden="true"> kg</span>
    </dd>
</dl>
```

## Accessibility

- `role="img"` marks the element as a cohesive graphic for assistive tech.
- `aria-label` carries the full, localized description including units.
- `data-value={value}` is a styling/testing hook only.
- Consumer CSS is responsible for any visual treatments.

## Related components

- `VitalSignWeightAsKgInput` — the editable Input counterpart in the Input/View pattern.
- `VitalSignHeightAsCmView` — commonly displayed with weight for BMI.
- `VitalSignBodyFatAsPercentageView` — body composition view.
- `VitalSignGroupView` — groups body-measurement views.
- `SummaryList` / `SummaryListItem` — grouped reading displays.
