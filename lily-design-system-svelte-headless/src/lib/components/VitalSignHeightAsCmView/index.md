# VitalSignHeightAsCmView

A headless read-only display of a person's height in centimetres. It renders a semantic `<span>` with `role="img"`, `aria-label`, and `data-value`.

## What it is

A passive, unstyled view element for showing a height reading. Screen readers hear the full description via `aria-label`; sighted users see the numeric value.

## What it does

- Renders `<span role="img">` with `aria-label` from the `label` prop.
- Exposes the numeric value through `data-value={value}`.
- Renders the `value` as the visible text content.
- Spreads additional HTML attributes onto the `<span>`.

## When to use it

- Profile summaries, patient records, fitness dashboards.
- Inside a `VitalSignGroupView` alongside weight, belly, and waist readings.
- In a `SummaryList` key/value layout.

## When not to use it

- Capturing a new value — use `VitalSignHeightAsCmInput`.
- Displaying height in feet/inches — convert in the consumer; this component is centimetre-native.
- When interactive behavior is required.

## How to use it

Pass the numeric `value` and a localized, descriptive `label`.

## Props

| Prop        | Type     | Default | Description                                                           |
| ----------- | -------- | ------- | --------------------------------------------------------------------- |
| `class`     | `string` | `""`    | Additional CSS class appended to the base class name.                 |
| `value`     | `number` | —       | Required. Height in centimetres.                                      |
| `label`     | `string` | —       | Required. Accessible description via `aria-label`.                    |
| `...rest`   | —        | —       | Spread onto the `<span>`.                                             |

## Usage

```svelte
<script lang="ts">
    import VitalSignHeightAsCmView from "./VitalSignHeightAsCmView.svelte";
</script>

<VitalSignHeightAsCmView
    value={170}
    label="Height: 170 centimetres"
/>
```

```svelte
<script lang="ts">
    import VitalSignHeightAsCmView from "./VitalSignHeightAsCmView.svelte";

    const cm = 182;
    const label = `Height: ${cm} cm`;
</script>

<VitalSignHeightAsCmView value={cm} {label} />
```

```svelte
<script lang="ts">
    import VitalSignHeightAsCmView from "./VitalSignHeightAsCmView.svelte";
    import VitalSignWeightAsKgView from "../VitalSignWeightAsKgView/VitalSignWeightAsKgView.svelte";
    import VitalSignGroupView from "../VitalSignGroupView/VitalSignGroupView.svelte";
</script>

<VitalSignGroupView label="Body measurements">
    <VitalSignHeightAsCmView value={170} label="Height: 170 cm" />
    <VitalSignWeightAsKgView value={68} label="Weight: 68 kg" />
</VitalSignGroupView>
```

```svelte
<script lang="ts">
    import VitalSignHeightAsCmView from "./VitalSignHeightAsCmView.svelte";
</script>

<dl>
    <dt>Height</dt>
    <dd>
        <VitalSignHeightAsCmView value={170} label="Height: 170 cm" />
        <span aria-hidden="true"> cm</span>
    </dd>
</dl>
```

## Accessibility

- `role="img"` marks the element as a cohesive graphic for assistive tech.
- `aria-label` carries the full, localized description including units.
- `data-value={value}` is a styling/testing hook only.
- Consumer CSS is responsible for any visual treatments.

## Related components

- `VitalSignHeightAsCmInput` — the editable Input counterpart in the Input/View pattern.
- `VitalSignWeightAsKgView` — commonly displayed with height for BMI.
- `VitalSignBellyCircumferenceAsCmView` / `VitalSignWaistCircumferenceAsCmView` — body-measurement siblings.
- `VitalSignGroupView` — groups body-measurement views.
- `SummaryList` / `SummaryListItem` — grouped reading displays.
