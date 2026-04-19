# ButtonInput

## Overview

A headless component wrapping the native HTML <input type="button"> element.
Unlike the Button component which uses <button> and can contain rich content
via children snippets, this component displays its label as the value attribute
(plain text only). Useful in form contexts where native input semantics are preferred.

## What it does

An input element of type button for form actions <input type="button">.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<ButtonInput value="Click me" onclick={handleClick} />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `value` | string, required | The button label text displayed on the input. |
| `disabled` | boolean, default false | Whether the input is disabled. |
| `name` | string, optional | Form field name for form submission. |
| `label` | string, optional | Accessible label override via aria-label for screen readers. |
| `onclick` | (event: MouseEvent) => void, optional | Click event handler. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Disabled button input -->
<ButtonInput value="Submit" disabled />

<!-- Named button with accessible label override -->
<ButtonInput value="Save" name="action" label="Save changes" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ButtonInput from "$lib/components/ButtonInput/ButtonInput.svelte";
</script>

<ButtonInput value="Click me" onclick={handleClick} />
```

## Keyboard

- Tab: Focus the button input
- Enter: Activate the button (native behavior)
- Space: Activate the button (native behavior)

## Accessibility

- Implicit button role from <input type="button">
- aria-label provides optional screen reader text override
- Native disabled attribute prevents clicks and signals aria-disabled

## Internationalization

- Button label comes through the value prop; no hardcoded strings
- Label override comes through label prop

## References

- MDN input type="button": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button
- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
