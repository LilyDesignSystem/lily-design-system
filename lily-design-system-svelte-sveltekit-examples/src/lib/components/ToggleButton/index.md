# ToggleButton

## Overview

A headless binary on/off toggle button using role="switch". Renders a
<button> with aria-checked to communicate state. Supports click and
keyboard (Space key) interaction. The pressed state is bindable for
two-way data flow. Commonly used for settings like dark mode,
notifications, or feature flags.

## What it does

A button that toggles between pressed and unpressed states.

## When to use

- Use for an in-page action (not navigation).

## When not to use

- Do not use for navigation to another URL — use a link instead.

## Usage

```svelte
<ToggleButton label="Dark mode" bind:pressed />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name via aria-label. |
| `pressed` | boolean, default false | Whether the toggle is on. Bindable. |
| `disabled` | boolean, default false | Whether the toggle is disabled. |
| `children` | Snippet, optional | Button content. |
| `...restProps` | additional HTML attributes spread onto the <button> |  |

## Examples

```svelte
<!-- Dark mode toggle -->
<ToggleButton label="Dark mode" bind:pressed />

<!-- Mute toggle with disabled state -->
<ToggleButton label="Mute audio" bind:pressed={muted} disabled={locked} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ToggleButton from "$lib/components/ToggleButton/ToggleButton.svelte";
</script>

<ToggleButton label="Dark mode" bind:pressed />
```

## Keyboard

- Space: toggles between on and off states
- Enter: activates the button (native button behavior)

## Accessibility

- role="switch" identifies the element as a two-state toggle
- aria-checked={pressed} communicates the current state
- aria-label={label} provides the accessible name

## Internationalization

- The label prop accepts any translated string
- No hardcoded strings

## References

- WAI-ARIA Switch Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/switch/
- WAI-ARIA Switch Role: https://www.w3.org/TR/wai-aria-1.2/#switch
