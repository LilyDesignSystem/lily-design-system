# RadioInput

## Overview

A headless bare <input type="radio"> element without a wrapping label, designed
for custom radio group layouts where labels are provided separately or by a
parent component. It uses aria-label for accessible naming. Useful in custom
card selection interfaces, segmented controls, and layouts where the radio
button and its label need independent positioning or styling.

## What it does

A single radio button input <input type="radio">.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<RadioInput label="Option A" name="choice" value="a" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name via aria-label. |
| `name` | string, optional | Radio group name for mutual exclusion. |
| `value` | string, optional | The value representing this radio option. |
| `checked` | boolean, default false | Whether this radio button is selected. |
| `disabled` | boolean, default false | Whether the radio button is disabled. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Single radio input -->
<RadioInput label="Option A" name="choice" value="a" />

<!-- Radio group with pre-selected option -->
<RadioInput label="Small" name="size" value="small" checked />
<RadioInput label="Medium" name="size" value="medium" />
<RadioInput label="Large" name="size" value="large" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import RadioInput from "$lib/components/RadioInput/RadioInput.svelte";
</script>

<RadioInput label="Option A" name="choice" value="a" />
```

## Keyboard

- Tab: moves focus to the selected radio in the group (or first if none selected)
- Arrow Up / Arrow Left: moves selection to the previous radio in the group
- Arrow Down / Arrow Right: moves selection to the next radio in the group
- Space: selects the focused radio button if not already selected

## Accessibility

- aria-label provides an accessible name since no visible <label> is included
- Native radio input provides built-in role="radio" semantics

## Internationalization

- The label prop is the only user-facing text; no hardcoded strings

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton/
- MDN input type="radio": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio
