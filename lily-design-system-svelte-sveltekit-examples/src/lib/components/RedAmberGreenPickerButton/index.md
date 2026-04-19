# RedAmberGreenPickerButton

## Overview

A headless button representing one Red/Amber/Green status choice within a
RAG status picker. Renders a <button> with aria-pressed to indicate the
selected state and data-value for consumer CSS targeting. Commonly used in
project dashboards, risk registers, and reporting tools where clicking a
status button selects that status level.

## What it does

A picker button for selecting a red/amber/green status.

## When to use

- Use as a single selectable option within the matching Picker.
- Use for an in-page action (not navigation).

## When not to use

- Do not use for navigation to another URL — use a link instead.

## Usage

```svelte
<RedAmberGreenPickerButton value="green" label="Green" onclick={handleSelect} />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `value` | string, required | The status value (e.g. "red", "amber", "green"). |
| `label` | string, required | Accessible name for the button via aria-label. |
| `selected` | boolean, default false | Whether this status is currently selected. |
| `disabled` | boolean, default false | Whether the button is disabled. |
| `onclick` | (event: MouseEvent) => void, optional | Click handler. |
| `...restProps` | additional HTML attributes spread onto the <button> |  |

## Examples

```svelte
<!-- Selected status button -->
<RedAmberGreenPickerButton value="red" label="Red" selected={true} onclick={handleSelect} />
<!-- Disabled status button -->
<RedAmberGreenPickerButton value="amber" label="Amber" disabled={true} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import RedAmberGreenPickerButton from "$lib/components/RedAmberGreenPickerButton/RedAmberGreenPickerButton.svelte";
</script>

<RedAmberGreenPickerButton value="green" label="Green" onclick={handleSelect} />
```

## Keyboard

- Tab: Move focus to the button
- Enter: Activate the button (native button behavior)
- Space: Activate the button (native button behavior)

## Accessibility

- aria-label provides an accessible name for the button
- aria-pressed indicates whether the status is currently selected
- data-value exposes the status value for consumer CSS selectors

## Internationalization

- The label prop provides the accessible name; no hardcoded strings

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- Traffic Light Rating System: https://en.wikipedia.org/wiki/Traffic_light_rating_system
