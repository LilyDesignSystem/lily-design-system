# File Input — Implementation Plan

## Goal

Implement the File Input component: an input for selecting files from the file system <input type="file">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .file-input

## Approach

1. Use semantic <input> element with class="file-input"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="file-input"
- [ ] `aria-label={label}` -- provides an accessible name for the file input since no visible `<label>` element is included
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
