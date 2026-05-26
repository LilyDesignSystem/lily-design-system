# ClipboardCopyButton

## Metadata

- Component: clipboard-copy-button
- PascalCase: ClipboardCopyButton
- Description: a button that copies text to the clipboard
- HTML tag: <button>
- CSS class: .clipboard-copy-button
- Interactive: yes

## Key Behaviors

- Renders a `<button type="button">` with `aria-label` for the copy action
- Uses `navigator.clipboard.writeText` for async clipboard access
- reactive state tracks `copied` status, which auto-resets to `false` after 2 seconds via `setTimeout`
- The `data-copied` attribute reflects the copied state for CSS-based feedback
- Optional `children` slot allows custom button content
- Callbacks `onsuccess` and `onerror` let consumers respond to copy results

## ARIA

- `aria-label` -- describes the copy action for screen readers
- `data-copied` -- reflects `"true"` or `"false"` for CSS-based visual feedback (not an ARIA attribute, but useful for consumer styling)

## Keyboard

- Enter/Space: Activate the copy button (native button behavior)

## Props

- `text`: string (required) -- the text to copy to the clipboard
- `label`: string (required) -- accessible label for the copy button via `aria-label`
- `onsuccess`: () => void (default: undefined) -- callback invoked after a successful copy
- `onerror`: (error: unknown) => void (default: undefined) -- callback invoked if the copy fails
- `children`: slot (default: undefined) -- optional custom button content

## Acceptance Criteria

- [ ] Renders <button> element with class="clipboard-copy-button"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .clipboard-copy-button in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/clipboard-copy-button.html
- ClipboardCopyButton API: https://developer.mozilla.org/en-US/docs/Web/API/ClipboardCopyButton/writeText
