# UrlInput

## Overview

A headless URL input using the native HTML <input type="url"> element, which
provides built-in URL validation and may trigger URL-specific keyboard layouts
on mobile devices. Commonly used in profile forms, link submission pages, and
any context where users need to enter a valid web address. The browser's
built-in validation ensures the entered value matches URL format.

## What it does

An input for entering a URL <input type="url">.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<UrlInput label="Website URL" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name via aria-label. |
| `value` | string, default "" | Bindable URL value; supports bind:value. |
| `required` | boolean, default false | Whether the field is required. |
| `disabled` | boolean, default false | Whether the field is disabled. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Required portfolio URL -->
<UrlInput label="Portfolio link" bind:value={portfolioUrl} required />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import UrlInput from "$lib/components/UrlInput/UrlInput.svelte";
</script>

<UrlInput label="Website URL" bind:value />
```

## Keyboard

- None beyond native text input behavior

## Accessibility

- aria-label={label} provides the accessible name since no visible label is associated

## Internationalization

- The label prop accepts any translated string
- No hardcoded user-facing strings

## References

- MDN input type="url": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/url
