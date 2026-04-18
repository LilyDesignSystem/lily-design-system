# ClipboardCopyButton

## Overview

A headless button that copies specified text to the system clipboard
using the Clipboard API. It tracks a `copied` state that automatically
resets after 2 seconds and exposes it via a `data-copied` attribute for
CSS-based feedback. Commonly used for copy-to-clipboard buttons on code
snippets, URLs, or shareable content.

## What it does

A button that copies text to the clipboard.

## When to use

- Use for an in-page action (not navigation).

## When not to use

- Do not use for navigation to another URL — use a link instead.

## Usage

```svelte
<ClipboardCopyButton text="https://example.com" label="Copy link" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `text` | string, required | The text to copy to the clipboard. |
| `label` | string, required | Accessible label for the copy button via aria-label. |
| `onsuccess` | () => void, default undefined | Callback invoked after a successful copy. |
| `onerror` | (error: unknown) => void, default undefined | Callback invoked if the copy fails. |
| `children` | Snippet, default undefined | Optional custom button content. |
| `...restProps` | additional HTML attributes spread onto the <button> |  |

## Examples

```svelte
<!-- Copy button with custom content and success callback -->
<ClipboardCopyButton text={code} label="Copy code" onsuccess={handleCopied}>
  Copy to clipboard
</ClipboardCopyButton>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ClipboardCopyButton from "$lib/components/ClipboardCopyButton/ClipboardCopyButton.svelte";
</script>

<ClipboardCopyButton text="https://example.com" label="Copy link" />
```

## Keyboard

- Enter: Activate the copy button (native button behavior)
- Space: Activate the copy button (native button behavior)

## Accessibility

- Implicit button role from the <button> element
- aria-label describes the copy action for screen readers
- data-copied attribute reflects "true" or "false" for CSS-based visual feedback

## Internationalization

- The label prop provides the accessible name; no hardcoded strings
- Button content is provided through the children snippet

## References

- Clipboard API: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
