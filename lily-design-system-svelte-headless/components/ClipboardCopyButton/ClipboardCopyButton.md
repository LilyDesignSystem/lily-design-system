# ClipboardCopyButton

A clipboard copy button that copies specified text to the system clipboard when activated. It uses the Clipboard API (`navigator.clipboard.writeText`) and exposes success and error callbacks for consumer-defined feedback.

The component tracks a `copied` state that automatically resets after 2 seconds. This state is exposed via a `data-copied` attribute on the button, allowing consumers to show visual feedback (e.g., a "Copied!" indicator) through CSS selectors like `[data-copied="true"]`.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | string | required | The text to copy to the clipboard |
| label | string | required | Accessible label for the copy button via aria-label |
| onsuccess | () => void | undefined | Callback invoked after a successful copy |
| onerror | (error: unknown) => void | undefined | Callback invoked if the copy fails |
| children | Snippet | undefined | Optional custom button content |
| ...restProps | HTML attributes | — | Spread onto the `<button>` |

## Usage

```svelte
<ClipboardCopyButton text="https://example.com" label="Copy link" />
```

```svelte
<ClipboardCopyButton text={code} label="Copy code" onsuccess={handleCopied}>
  Copy to clipboard
</ClipboardCopyButton>
```

## Keyboard

- Enter/Space: Activate the copy button (native button behavior)

## Accessibility

- `aria-label` describes the copy action for screen readers
- `data-copied` reflects `"true"` or `"false"` for CSS-based visual feedback

## References

- [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText)
