# Watermark — Specification

Single source of truth for spec-driven development of the Watermark component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Watermark component: a decorative repeating overlay text or image marking a page.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .watermark

## Approach

1. Use semantic <div> container with class="watermark"
2. Apply data-rotate and data-gap attributes from props
3. Render an inner <div class="watermark-overlay" aria-hidden="true"> with data-text and data-image-url
4. Render children after the overlay so consumer content stays accessible
5. Default rotate to -22 and gap to "100px"
6. Implement in HTML headless (plain HTML)
7. Implement in Svelte headless (Svelte 5 + runes)
8. Implement in React headless (React 19 + TypeScript)
9. Implement in Vue headless (Vue 3 + TypeScript)
10. Implement in Nunjucks headless (macro)
11. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div class="watermark"> container with data-rotate and data-gap
- [ ] Overlay renders with class="watermark-overlay" and aria-hidden="true"
- [ ] data-text and data-image-url applied when provided
- [ ] Children render after the overlay
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS classes beyond the base classes plus consumer extras
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
- [ ] Add CSS class .watermark to css-style-sheet-template.css
- [ ] Add comprehensive accessibility tests
- [ ] Add integration tests for repeating background pattern
