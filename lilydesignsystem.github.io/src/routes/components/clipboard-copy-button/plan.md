# Clipboard Copy Button — Implementation Plan

## Goal

Implement the Clipboard Copy Button component: a button that copies text to the clipboard.

## HTML Tag and CSS Class

- HTML tag: <button>
- CSS class: .clipboard-copy-button

## Approach

1. Use semantic <button> element with class="clipboard-copy-button"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <button> with class="clipboard-copy-button"
- [ ] `aria-label` -- describes the copy action for screen readers
- [ ] Keyboard: Enter/Space: Activate the copy button (native button behavior)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
