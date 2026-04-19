# SwitchButton

## Overview

A headless toggle switch that provides a binary on/off control using
role="switch" with aria-checked. It renders as a <button> element and
supports both click and keyboard (Space key) activation. Commonly used
for settings, preferences, and feature toggles where users need to
enable or disable a single option without submitting a form.

## What it does

A toggle switch for turning a setting on or off.

## When to use

- Use for an in-page action (not navigation).

## When not to use

- Do not use for navigation to another URL — use a link instead.

## Usage

```svelte
<SwitchButton label="Enable notifications" bind:checked />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name via aria-label. |
| `checked` | boolean, default false | Whether the switch is on; bindable with bind:checked. |
| `disabled` | boolean, default false | Whether the switch is disabled. |
| `...restProps` | additional HTML attributes spread onto the <button> |  |

## Examples

```svelte
<!-- Dark mode switch with conditional disabled -->
<SwitchButton label="Dark mode" bind:checked={darkMode} disabled={locked} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import SwitchButton from "$lib/components/SwitchButton/SwitchButton.svelte";
</script>

<SwitchButton label="Enable notifications" bind:checked />
```

## Keyboard

- Space: toggles the switch between on and off states (custom handler with preventDefault)
- Enter: activates the button (native button behavior)

## Accessibility

- role="switch" identifies the element as a two-state toggle switch
- aria-checked={checked} communicates whether the switch is on or off
- aria-label={label} provides the accessible name for the switch control

## Internationalization

- The label prop accepts any translated string
- No hardcoded user-facing strings

## References

- WAI-ARIA Switch Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/switch/
- WAI-ARIA Switch Role: https://www.w3.org/TR/wai-aria-1.2/#switch
