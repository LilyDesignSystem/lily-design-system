# MentionsInput — Implementation Plan

## Goal

Implement the MentionsInput component: a text input with at-mention autocomplete suggestions.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .mentions-input

## Approach

1. Use semantic <div> container with class="mentions-input" and data-trigger-char
2. Render an inner <input class="mentions-input-control" type="text" role="combobox">
3. Wire aria-haspopup="listbox", aria-expanded, aria-autocomplete="list", aria-label
4. Render a <div class="mentions-input-suggestions"> for the suggestions panel
5. Toggle suggestions panel via the hidden attribute based on expanded
6. Implement in HTML headless (plain HTML + minimal vanilla JS)
7. Implement in Svelte headless (Svelte 5 + runes)
8. Implement in React headless (React 19 + TypeScript)
9. Implement in Vue headless (Vue 3 + TypeScript)
10. Implement in Nunjucks headless (macro)
11. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div class="mentions-input"> with data-trigger-char attribute
- [ ] Inner <input> uses correct class, type, role, and ARIA attributes
- [ ] Suggestions panel toggles with the hidden attribute
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base classes plus consumer extras
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations
