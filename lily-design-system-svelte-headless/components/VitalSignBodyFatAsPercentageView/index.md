# VitalSignBodyFatAsPercentageView

A headless read-only display of a body fat percentage reading. It renders a semantic `<span>` with `role="img"`, `aria-label`, and `data-value` so consumers can style and hook in without disturbing the accessible name.

## What it is

A passive, unstyled view element for showing a body fat percentage. Screen readers hear the full description via `aria-label`; sighted users see just the numeric value (with one decimal place as supplied).

## What it does

- Renders `<span role="img">` with `aria-label` from the `label` prop.
- Exposes the numeric value through `data-value={value}`.
- Renders the `value` as the visible text content.
- Spreads additional HTML attributes onto the `<span>`.

## When to use it

- Dashboards and summaries showing a user's body composition data.
- Inside a `VitalSignGroupView` alongside weight and other composition values.
- In a `SummaryList` key/value layout.

## When not to use it

- Capturing a new reading — use `VitalSignBodyFatAsPercentageInput`.
- Displaying overall body mass — use `VitalSignWeightAsKgView`.
- When interactive behavior is required.

## How to use it

Pass the numeric `value` and a localized descriptive `label`.

## Props

| Prop        | Type     | Default | Description                                                           |
| ----------- | -------- | ------- | --------------------------------------------------------------------- |
| `class`     | `string` | `""`    | Additional CSS class appended to the base class name.                 |
| `value`     | `number` | —       | Required. Body fat percentage.                                        |
| `label`     | `string` | —       | Required. Accessible description via `aria-label`.                    |
| `...rest`   | —        | —       | Spread onto the `<span>`.                                             |

## Usage

```svelte
<script lang="ts">
    import VitalSignBodyFatAsPercentageView from "./VitalSignBodyFatAsPercentageView.svelte";
</script>

<VitalSignBodyFatAsPercentageView
    value={22.5}
    label="Body fat: 22.5 percent"
/>
```

```svelte
<script lang="ts">
    import VitalSignBodyFatAsPercentageView from "./VitalSignBodyFatAsPercentageView.svelte";

    const pct = 18.3;
    const label = `Body fat: ${pct}%`;
</script>

<VitalSignBodyFatAsPercentageView value={pct} {label} />
```

```svelte
<script lang="ts">
    import VitalSignBodyFatAsPercentageView from "./VitalSignBodyFatAsPercentageView.svelte";
    import VitalSignGroupView from "../VitalSignGroupView/VitalSignGroupView.svelte";
</script>

<VitalSignGroupView label="Body composition">
    <VitalSignBodyFatAsPercentageView
        value={22.5}
        label="Body fat: 22.5 percent"
    />
</VitalSignGroupView>
```

```svelte
<script lang="ts">
    import VitalSignBodyFatAsPercentageView from "./VitalSignBodyFatAsPercentageView.svelte";
</script>

<dl>
    <dt>Body fat</dt>
    <dd>
        <VitalSignBodyFatAsPercentageView value={22.5} label="Body fat: 22.5%" />
        <span aria-hidden="true"> %</span>
    </dd>
</dl>
```

## Accessibility

- `role="img"` marks the element as a cohesive graphic for assistive tech.
- `aria-label` carries the full, localized description including units.
- `data-value={value}` is a styling/testing hook only.
- Consumer CSS is responsible for any range color indications.

## Related components

- `VitalSignBodyFatAsPercentageInput` — the editable Input counterpart in the Input/View pattern.
- `VitalSignWeightAsKgView` — commonly displayed alongside body fat.
- `VitalSignWaistCircumferenceAsCmView` — complementary composition view.
- `VitalSignGroupView` — groups composition views.
- `SummaryList` / `SummaryListItem` — common container for grouped displays.
