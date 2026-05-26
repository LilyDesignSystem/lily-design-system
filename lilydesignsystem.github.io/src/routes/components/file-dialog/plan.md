# File Dialog — Implementation Plan

## Goal

Implement the File Dialog component: a dialog for browsing and selecting files.

## HTML Tag and CSS Class

- HTML tag: <dialog>
- CSS class: .file-dialog

## Approach

1. Use semantic <dialog> element with class="file-dialog"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <dialog> with class="file-dialog"
- [ ] `aria-label={label}` -- provides an accessible name for the dialog
- [ ] Native `<dialog>` element -- provides implicit `role="dialog"` semantics
- [ ] Keyboard: Escape: closes the dialog by setting `open` to `false`
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
