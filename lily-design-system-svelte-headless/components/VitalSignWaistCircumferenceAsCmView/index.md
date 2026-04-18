# VitalSignWaistCircumferenceAsCmView

A headless read-only display of a waist circumference value in centimetres. It renders a semantic `<span>` with `role="img"`, `aria-label`, and `data-value`.

## What it is

A passive, unstyled view element for showing a waist measurement reading. Screen readers hear the full description via `aria-label`; sighted users see the numeric value.

## What it does

- Renders `<span role="img">` with `aria-label` from the `label` prop.
- Exposes the numeric value through `data-value={value}`.
- Renders the `value` as the visible text content.
- Spreads additional HTML attributes onto the `<span>`.

## When to use it

- Patient summaries, metabolic-risk assessments, and fitness dashboards.
- Inside a `VitalSignGroupView` alongside belly, height, and weight.
- In a `SummaryList` key/value layout.

## When not to use it

- Capturing a new value — use `VitalSignWaistCircumferenceAsCmInput`.
- Displaying belly circumference — use `VitalSignBellyCircumferenceAsCmView`.
- When interactive behavior is required.

## How to use it

Pass the numeric `value` and a localized, descriptive `label`.

## Props

| Prop        | Type     | Default | Description                                                           |
| ----------- | -------- | ------- | --------------------------------------------------------------------- |
| `class`     | `string` | `""`    | Additional CSS class appended to the base class name.                 |
| `value`     | `number` | —       | Required. Waist circumference in centimetres.                         |
| `label`     | `string` | —       | Required. Accessible description via `aria-label`.                    |
| `...rest`   | —        | —       | Spread onto the `<span>`.                                             |

## Usage

```svelte
<script lang="ts">
    import VitalSignWaistCircumferenceAsCmView from "./VitalSignWaistCircumferenceAsCmView.svelte";
</script>

<VitalSignWaistCircumferenceAsCmView
    value={85}
    label="Waist circumference: 85 centimetres"
/>
```

```svelte
<script lang="ts">
    import VitalSignWaistCircumferenceAsCmView from "./VitalSignWaistCircumferenceAsCmView.svelte";

    const cm = 92;
    const label = `Waist: ${cm} cm`;
</script>

<VitalSignWaistCircumferenceAsCmView value={cm} {label} />
```

```svelte
<script lang="ts">
    import VitalSignWaistCircumferenceAsCmView from "./VitalSignWaistCircumferenceAsCmView.svelte";
    import VitalSignBellyCircumferenceAsCmView from "../VitalSignBellyCircumferenceAsCmView/VitalSignBellyCircumferenceAsCmView.svelte";
    import VitalSignGroupView from "../VitalSignGroupView/VitalSignGroupView.svelte";
</script>

<VitalSignGroupView label="Body measurements">
    <VitalSignWaistCircumferenceAsCmView value={85} label="Waist: 85 cm" />
    <VitalSignBellyCircumferenceAsCmView value={92} label="Belly: 92 cm" />
</VitalSignGroupView>
```

```svelte
<script lang="ts">
    import VitalSignWaistCircumferenceAsCmView from "./VitalSignWaistCircumferenceAsCmView.svelte";
</script>

<dl>
    <dt>Waist</dt>
    <dd>
        <VitalSignWaistCircumferenceAsCmView value={85} label="Waist: 85 cm" />
        <span aria-hidden="true"> cm</span>
    </dd>
</dl>
```

## Accessibility

- `role="img"` marks the element as a cohesive graphic for assistive tech.
- `aria-label` carries the full, localized description including units.
- `data-value={value}` is a styling/testing hook only.
- Consumer CSS is responsible for any range indicators.

## Related components

- `VitalSignWaistCircumferenceAsCmInput` — the editable Input counterpart in the Input/View pattern.
- `VitalSignBellyCircumferenceAsCmView` — sibling abdominal measurement view.
- `VitalSignHeightAsCmView` / `VitalSignWeightAsKgView` — core anthropometric views.
- `VitalSignGroupView` — groups body-measurement views.
- `SummaryList` / `SummaryListItem` — grouped reading displays.
