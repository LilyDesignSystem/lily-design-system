# MeasurementInstanceInput

MeasurementInstanceInput is a headless Svelte 5 text input for entering a specific measurement instance value such as "72 kg", "98.6 F", or "120/80 mmHg". A measurement instance is a concrete recorded measurement combining a numeric value with its unit.

## What it is

A thin wrapper around `<input type="text">` that accepts free-form measurement strings. It has no numeric parsing or unit validation — consumers are responsible for validating the entered value. Part of the Input/View pattern; pairs with `MeasurementInstanceView`.

## What it does

- Renders an `<input type="text">` with `class="measurement-instance-input"` plus any consumer-provided CSS class.
- Applies `aria-label` from the required `label` prop.
- Provides a bindable `value` via `$bindable("")` for two-way data binding.
- Supports `required` and `disabled` HTML states.
- Spreads `...restProps` onto the `<input>` for consumer customization.

## When to use it

- Capturing a single measurement as a free-form string (e.g., "72 kg", "120/80 mmHg").
- Any context where the value and unit should be entered together.
- Rapid data-entry UIs where structured decomposition into value + unit + system would slow the user.

## When not to use it

- Do not use when you need structured numeric input with a separate unit picker — combine `NumberInput` + `MeasurementUnitInput` / `Select`.
- Do not use for dedicated vital signs with known units — use the specific `VitalSign*Input` components.
- Do not use for display — use `MeasurementInstanceView`.

## How to use it

Import the component, pass a `label`, and bind the `value`. Validate the format and unit server-side or via `restProps` `pattern` attribute.

## Props

- `class` (string, optional) — consumer CSS class appended to the base class.
- `label` (string, required) — accessible name applied via `aria-label`.
- `value` (string, optional, default `""`) — bindable measurement instance string via `bind:value`.
- `required` (boolean, optional, default `false`) — whether the input is required.
- `disabled` (boolean, optional, default `false`) — whether the input is disabled.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<input>`.

## Usage

### Basic measurement instance input

```svelte
<script lang="ts">
    import MeasurementInstanceInput from "./MeasurementInstanceInput.svelte";
    let weight = $state("");
</script>

<MeasurementInstanceInput label="Weight" bind:value={weight} />
```

### Required temperature

```svelte
<script lang="ts">
    import MeasurementInstanceInput from "./MeasurementInstanceInput.svelte";
    let temp = $state("");
</script>

<MeasurementInstanceInput label="Temperature" bind:value={temp} required />
```

### Blood pressure with placeholder

```svelte
<script lang="ts">
    import MeasurementInstanceInput from "./MeasurementInstanceInput.svelte";
    let bp = $state("");
</script>

<MeasurementInstanceInput
    label="Blood pressure"
    bind:value={bp}
    placeholder="120/80 mmHg"
/>
```

### Disabled with a prefilled value

```svelte
<script lang="ts">
    import MeasurementInstanceInput from "./MeasurementInstanceInput.svelte";
    let distance = $state("10 km");
</script>

<MeasurementInstanceInput label="Distance" bind:value={distance} disabled />
```

### With a pattern and maxlength via restProps

```svelte
<script lang="ts">
    import MeasurementInstanceInput from "./MeasurementInstanceInput.svelte";
    let height = $state("");
</script>

<MeasurementInstanceInput
    label="Height"
    bind:value={height}
    pattern="[0-9]+(\.[0-9]+)?\s*(cm|m|in|ft)"
    maxlength={20}
/>
```

## Accessibility

- `aria-label` supplies an accessible name when no visible `<label>` is present.
- Native `required` and `disabled` attributes are conveyed to assistive technology.
- Standard browser keyboard behaviour for text editing.
- Compliant with WCAG 2.2 AAA with consumer-provided focus indicators.

## Related components

- `MeasurementInstanceView` — paired read-only display of the same measurement instance.
- `MeasurementSystemInput` / `MeasurementSystemView` — measurement system name input/display.
- `MeasurementUnitInput` / `MeasurementUnitView` — measurement unit input/display.
- `VitalSignHeartRateAsBeatsPerMinuteInput`, `VitalSignBodyTemperatureAsCelciusInput`, etc. — dedicated vital-sign inputs.
- `NumberInput` — numeric-only input without a unit.
- `CurrencyInput` — locale-aware currency input.
