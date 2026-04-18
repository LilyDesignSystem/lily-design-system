# ResetInput

## Overview

A headless form reset button using the native HTML <input type="reset">
element. When clicked within a form, it resets all sibling form fields to
their initial default values. Useful in forms where users may want to clear
all entered data and start over.

## What it does

A button input that resets a form to default values <input type="reset">.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<ResetInput />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `value` | string, default "Reset" | The visible button text. |
| `disabled` | boolean, default false | Whether the button is disabled. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Custom label -->
<ResetInput value="Clear form" />

<!-- Conditionally disabled -->
<ResetInput value="Start over" disabled={!formDirty} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ResetInput from "$lib/components/ResetInput/ResetInput.svelte";
</script>

<ResetInput />
```

## Keyboard

- Enter: activates the reset button (native behavior)
- Space: activates the reset button (native behavior)

## Accessibility

- Native <input type="reset"> has implicit button role
- The value attribute serves as the accessible name
- No additional ARIA attributes needed

## Internationalization

- The value prop externalizes the button text for localization
- Default "Reset" should be overridden in non-English contexts

## References

- MDN input type="reset": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/reset
