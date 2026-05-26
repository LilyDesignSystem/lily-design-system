# Affix — Specification

Single source of truth for spec-driven development of the Affix component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Affix component: a wrapper that pins its content to a viewport position while the page scrolls.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .affix

## Approach

1. Use semantic <div> element with class="affix"
2. Apply inline `position: sticky` style as documented headless behavior
3. Apply `top: {offsetTop}px` or `bottom: {offsetBottom}px` from props
4. Default to `top: 0` when neither offset is provided
5. Emit data-offset-top and data-offset-bottom data attributes
6. Implement in HTML headless (plain HTML)
7. Implement in Svelte headless (Svelte 5 + runes)
8. Implement in React headless (React 19 + TypeScript)
9. Implement in Vue headless (Vue 3 + TypeScript)
10. Implement in Nunjucks headless (macro)
11. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="affix"
- [ ] Inline style includes position: sticky and the correct top/bottom offset
- [ ] Children render inside the affix container
- [ ] Pass-through attributes are forwarded to the root element
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS classes beyond the base class plus consumer extras
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add canonical entry to components.tsv and AGENTS/components.md

### In Progress

- [ ] Cross-check implementations against the canonical spec

### Backlog

- [ ] Implement HTML headless component
- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Nunjucks headless component
- [ ] Implement Blazor headless component
- [ ] Add CSS class .affix to css-style-sheet-template.css
- [ ] Add comprehensive accessibility tests
- [ ] Add integration tests with parent/child components
