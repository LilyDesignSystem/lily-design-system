# Form

## Overview

A form wrapper that wraps a native HTML <form> element with accessible labeling,
automatic submit default prevention, and reset support. It simplifies form handling
by intercepting the submit event and calling preventDefault() before passing it to
the consumer's callback, which is the most common pattern in single-page applications.

## What it does

A form element for collecting and submitting user data.

## When to use

- Use when you need a form element for collecting and submitting user data.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Form label="Login" onsubmit={handleLogin}>{children}</Form>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the form via aria-label. |
| `onsubmit` | function, default undefined | Callback receiving SubmitEvent (default already prevented). |
| `onreset` | function, default undefined | Callback receiving Event on form reset. |
| `children` | Snippet, required | Form content (inputs, buttons, etc.). |
| `...restProps` | additional HTML attributes spread onto the form element |  |

## Examples

```svelte
<!-- Login form with submit handler -->
<Form label="Login" onsubmit={handleLogin}>
  <input name="email" />
  <button type="submit">Sign in</button>
</Form>

<!-- Form with reset handler -->
<Form label="Search filters" onsubmit={applyFilters} onreset={clearFilters}>
  <input name="query" />
  <button type="submit">Apply</button>
  <button type="reset">Clear</button>
</Form>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Form from "$lib/components/Form/Form.svelte";
</script>

<Form label="Login" onsubmit={handleLogin}>{children}</Form>
```

## Keyboard

- Enter: Submits the form when a text input is focused (native browser behavior)

## Accessibility

- aria-label provides an accessible name for the form, helping screen readers identify its purpose

## Internationalization

- The label prop allows localized accessible names; no hardcoded user-facing strings
- All content comes through the children snippet

## References

- MDN form element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
- WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/
