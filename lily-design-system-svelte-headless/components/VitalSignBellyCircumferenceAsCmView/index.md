# VitalSignBellyCircumferenceAsCmView

A headless read-only display of a belly (abdominal) circumference value in centimetres. It renders a semantic `<span>` with `role="img"`, an `aria-label`, and a `data-value` attribute so consumers can style and query the element without interfering with the accessible name.

## What it is

A passive, unstyled view element for displaying a belly circumference reading. Screen readers hear the full description through `aria-label`; sighted users see the bare numeric value.

## What it does

- Renders `<span role="img">` with `aria-label` from the `label` prop.
- Exposes the numeric measurement via `data-value={value}` for CSS selectors and JS hooks.
- Renders the numeric `value` as the visible text content.
- Spreads any additional HTML attributes onto the `<span>`.

## When to use it

- Patient summaries, medical record views, dashboards.
- Inside a `SummaryList`/`SummaryListItem` showing current body measurements.
- As part of a `VitalSignGroupView` composition.

## When not to use it

- Capturing a new value — use `VitalSignBellyCircumferenceAsCmInput`.
- Displaying a waist circumference — use `VitalSignWaistCircumferenceAsCmView`.
- When you need interactive elements (edit button, slider) — prefer the Input pattern.

## How to use it

Import the component and pass the numeric `value` and a localized `label` that describes the reading in human-readable form.

## Props

| Prop        | Type     | Default | Description                                                           |
| ----------- | -------- | ------- | --------------------------------------------------------------------- |
| `class`     | `string` | `""`    | Additional CSS class appended to the base class name.                 |
| `value`     | `number` | —       | Required. Belly circumference in centimetres.                         |
| `label`     | `string` | —       | Required. Accessible description via `aria-label`.                    |
| `...rest`   | —        | —       | Additional HTML attributes spread onto the `<span>`.                  |

## Usage

```svelte
<script lang="ts">
    import VitalSignBellyCircumferenceAsCmView from "./VitalSignBellyCircumferenceAsCmView.svelte";
</script>

<VitalSignBellyCircumferenceAsCmView
    value={92}
    label="Belly circumference: 92 centimetres"
/>
```

```svelte
<script lang="ts">
    import VitalSignBellyCircumferenceAsCmView from "./VitalSignBellyCircumferenceAsCmView.svelte";

    const reading = 101;
    const label = `Belly circumference: ${reading} centimetres`;
</script>

<VitalSignBellyCircumferenceAsCmView value={reading} {label} />
```

```svelte
<script lang="ts">
    import VitalSignBellyCircumferenceAsCmView from "./VitalSignBellyCircumferenceAsCmView.svelte";
    import VitalSignGroupView from "../VitalSignGroupView/VitalSignGroupView.svelte";
</script>

<VitalSignGroupView label="Body measurements">
    <VitalSignBellyCircumferenceAsCmView
        value={92}
        label="Belly circumference: 92 centimetres"
    />
</VitalSignGroupView>
```

```svelte
<script lang="ts">
    import VitalSignBellyCircumferenceAsCmView from "./VitalSignBellyCircumferenceAsCmView.svelte";
</script>

<dl>
    <dt>Belly</dt>
    <dd>
        <VitalSignBellyCircumferenceAsCmView
            value={92}
            label="Belly circumference: 92 centimetres"
        />
        <span aria-hidden="true"> cm</span>
    </dd>
</dl>
```

## Accessibility

- `role="img"` marks the element as a graphic; assistive tech announces the `aria-label` rather than reading the bare number out of context.
- `aria-label` is the canonical accessible description — include the unit ("centimetres") and what the value represents.
- `data-value={value}` provides a CSS/JS hook (e.g., `[data-value]` selectors) without affecting the accessible name.
- No interactive behavior — the element is not focusable.

## Related components

- `VitalSignBellyCircumferenceAsCmInput` — the editable Input counterpart in the Input/View pattern.
- `VitalSignWaistCircumferenceAsCmView` — waist circumference view.
- `VitalSignHeightAsCmView` / `VitalSignWeightAsKgView` — other body-measurement views.
- `VitalSignGroupView` — groups multiple vital-sign views.
- `SummaryList` / `SummaryListItem` — a common container for grouped reading displays.
