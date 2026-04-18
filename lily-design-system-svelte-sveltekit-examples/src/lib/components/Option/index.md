# Option

## Overview

A headless <option> element wrapper for use inside <select> elements. It
accepts a value prop for the form submission value and renders children as
the visible option label text. Supports selected and disabled states using
native HTML attributes. Used in dropdown menus, form selects, and list pickers.

## What it does

An option element within a select dropdown.

## When to use

- Use when you need an option element within a select dropdown.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Option value="us">United States</Option>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `value` | string, required | The option value submitted with the form. |
| `selected` | boolean, default false | Whether this option is pre-selected. |
| `disabled` | boolean, default false | Whether this option is disabled. |
| `children` | Snippet, required | The option label text content. |
| `...restProps` | additional HTML attributes spread onto the <option> |  |

## Examples

```svelte
<!-- Options inside a select -->
<select>
  <Option value="us">United States</Option>
  <Option value="uk">United Kingdom</Option>
  <Option value="ca" disabled>Canada</Option>
</select>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Option from "$lib/components/Option/Option.svelte";
</script>

<Option value="us">United States</Option>
```

## Keyboard

- None directly — keyboard behavior is managed by the parent <select> element
- (Up/Down arrows, Home/End, type-ahead search).

## Accessibility

- Native <option> element provides built-in accessibility via the parent <select>
- Screen readers announce the option text and selected state automatically

## Internationalization

- Option label text comes through the children snippet
- No hardcoded user-facing strings

## References

- HTML option element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option
