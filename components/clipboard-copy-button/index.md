# Clipboard Copy Button

A clipboard component provides a button that copies specified text to the system clipboard when activated. It uses the ClipboardCopyButton API (`navigator.clipboard.writeText`) and exposes success and error callbacks for consumer-defined feedback.

The component tracks a `copied` state that automatically resets after 2 seconds. This state is exposed via a `data-copied` attribute on the button, allowing consumers to show visual feedback (e.g., a "Copied!" indicator) through CSS selectors like `[data-copied="true"]`.

## Implementation Notes

- Renders a `<button type="button">` with `aria-label` for the copy action
- Uses `navigator.clipboard.writeText` for async clipboard access
- reactive state tracks `copied` status, which auto-resets to `false` after 2 seconds via `setTimeout`
- The `data-copied` attribute reflects the copied state for CSS-based feedback
- Optional `children` slot allows custom button content
- Callbacks `onsuccess` and `onerror` let consumers respond to copy results

## Props

- `text`: string (required) -- the text to copy to the clipboard
- `label`: string (required) -- accessible label for the copy button via `aria-label`
- `onsuccess`: () => void (default: undefined) -- callback invoked after a successful copy
- `onerror`: (error: unknown) => void (default: undefined) -- callback invoked if the copy fails
- `children`: slot (default: undefined) -- optional custom button content

## Usage

Copy a URL to the clipboard:

```html
<ClipboardCopyButton text="https://example.com" label="Copy link" />
```

Copy button with custom content and success callback:

```html
<ClipboardCopyButton text={code} label="Copy code" onsuccess={handleCopied}>
  Copy to clipboard
</ClipboardCopyButton>
```

Copy button next to a reference number:

```html
<div class="reference-row">
  <span>Booking ref: <strong>ABC-12345</strong></span>
  <ClipboardCopyButton text="ABC-12345" label="Copy booking reference" />
</div>
```

Copy button alongside an API key:

```html
<Field label="API Key">
  <div class="input-with-copy">
    <TextInput label="API Key" value={apiKey} disabled />
    <ClipboardCopyButton
      text={apiKey}
      label="Copy API key"
      onsuccess={() => toast('API key copied')}
      onerror={(err) => toast('Copy failed: ' + err)}
    />
  </div>
</Field>
```

## Keyboard Interactions

- Enter/Space: Activate the copy button (native button behavior)

## ARIA

- `aria-label` -- describes the copy action for screen readers
- `data-copied` -- reflects `"true"` or `"false"` for CSS-based visual feedback (not an ARIA attribute, but useful for consumer styling)

## When to Use

- Use next to text content that users frequently need to copy, such as URLs, code snippets, or API keys.
- Use when a one-click copy action improves user efficiency over manual text selection.
- Use alongside reference numbers, tracking codes, or identifiers that users need to paste elsewhere.
- Use in code documentation to let users quickly copy example commands or snippets.
- Use next to share links or invite URLs.

## When Not to Use

- Do not use for general-purpose buttons -- use Button instead.
- Do not use when the text is already easily selectable and rarely needs copying.
- Do not use for large blocks of text -- provide a download link instead.

## Headless

This headless ClipboardCopyButton component provides a `<button>` with `aria-label`, Clipboard API integration (`navigator.clipboard.writeText`), automatic `copied` state tracking with 2-second reset, and `data-copied` attribute for styling hooks. The consumer provides all visual styling including button appearance, copy/success icons, tooltip feedback, and animations.


## Styles

The consumer provides all CSS styling. The component renders with a `.clipboard-copy-button` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<button>` element with class `clipboard-copy-button`
- Verify aria-label` -- describes the copy action for screen readers
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Provide clear visual feedback when copying succeeds, such as a checkmark icon or "Copied!" text. Keep the button close to the content it copies.
- **Developers**: Use the `data-copied` attribute (e.g., `[data-copied="true"]`) in CSS to show success state. Handle the `onerror` callback for browsers that restrict clipboard access.

## References

- ClipboardCopyButton API: https://developer.mozilla.org/en-US/docs/Web/API/ClipboardCopyButton/writeText
