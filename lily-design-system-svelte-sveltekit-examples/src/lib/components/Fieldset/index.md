# Fieldset

## Overview

Groups related form elements using the native <fieldset> and <legend> HTML
elements. Provides both visual grouping and semantic association that screen
readers announce when users navigate into the group. The disabled prop
disables all child form controls at once, useful for conditionally editable
form sections.

## What it does

A group of related form fields with a legend.

## When to use

- Use when you need a group of related form fields with a legend.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Fieldset legend="Contact info">
  <label>Email <input type="email" /></label>
</Fieldset>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `legend` | string, required | Text for the <legend> element describing the group. |
| `disabled` | boolean, default false | Whether all controls in the fieldset are disabled. |
| `children` | Snippet, required | Grouped form controls. |
| `...restProps` | additional HTML attributes spread onto the <fieldset> element |  |

## Examples

```svelte
<!-- Basic grouped controls -->
<Fieldset legend="Contact info">
  <label>Email <input type="email" /></label>
  <label>Phone <input type="tel" /></label>
</Fieldset>

<!-- Conditionally disabled group -->
<Fieldset legend="Shipping address" disabled={usesBillingAddress}>
  <label>Street <input type="text" /></label>
  <label>City <input type="text" /></label>
</Fieldset>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Fieldset from "$lib/components/Fieldset/Fieldset.svelte";
</script>

<Fieldset legend="Contact info">
  <label>Email <input type="email" /></label>
</Fieldset>
```

## Keyboard

- None — passive container; keyboard interactions from consumer-provided child controls

## Accessibility

- Native <fieldset> and <legend> provide built-in group semantics and labeling
- No custom ARIA attributes required
- disabled attribute natively disables all descendant form controls

## Internationalization

- The legend prop accepts any string; consumers provide localized text

## References

- HTML Specification fieldset: https://html.spec.whatwg.org/multipage/form-elements.html#the-fieldset-element
