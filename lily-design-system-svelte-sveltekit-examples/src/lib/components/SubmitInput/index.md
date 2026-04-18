# SubmitInput

## Overview

A headless form submission button using the native HTML <input type="submit">
element. When clicked within a form, it triggers the form's submit event and
built-in browser validation. The component supports custom button text through
the value prop and can be disabled to prevent premature submission.

## What it does

A button input that submits a form <input type="submit">.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<SubmitInput />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `value` | string, default "Submit" | The visible button text. |
| `disabled` | boolean, default false | Whether the button is disabled. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Custom button text -->
<SubmitInput value="Send" />

<!-- Conditionally disabled submit -->
<SubmitInput value="Save changes" disabled={!formValid} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import SubmitInput from "$lib/components/SubmitInput/SubmitInput.svelte";
</script>

<SubmitInput />
```

## Keyboard

- Enter: activates the submit button (native behavior)
- Space: activates the submit button (native behavior)

## Accessibility

- Native <input type="submit"> has an implicit button role
- The value attribute serves as the accessible name
- No additional ARIA attributes needed beyond native semantics

## Internationalization

- The value prop externalizes user-facing button text for translation
- Default value "Submit" should be overridden with translated text

## References

- MDN input type="submit": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/submit
