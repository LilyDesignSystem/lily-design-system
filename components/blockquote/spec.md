# Blockquote — Specification

Single source of truth for spec-driven development of the Blockquote component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Blockquote component: a block-level quotation with optional source citation.

## HTML Tag and CSS Class

- HTML tag: <blockquote>
- CSS class: .blockquote

## Approach

1. Use semantic <blockquote> element with class="blockquote"
2. Map cite prop to the native cite attribute on the element
3. Render <footer class="blockquote-citation"> when citationText is provided
4. Render aria-label only when label prop is provided
5. Pass children as the quoted content
6. Implement in HTML headless (plain HTML, no JavaScript needed)
7. Implement in Svelte headless (Svelte 5 + runes)
8. Implement in React headless (React 19 + TypeScript)
9. Implement in Vue headless (Vue 3 + TypeScript)
10. Implement in Nunjucks headless (macro)
11. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <blockquote> with class="blockquote"
- [ ] cite attribute mirrors cite prop when provided
- [ ] <footer> citation renders only when citationText provided
- [ ] aria-label rendered when label is provided
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base class plus consumer extras
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, ARIA, and citation behavior in index.md

### In Progress

- [ ] Cross-check implementations against the canonical spec

### Backlog

- [ ] Add canonical entry to components.tsv and AGENTS/components.md
- [ ] Implement HTML headless component
- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Nunjucks headless component
- [ ] Implement Blazor headless component
- [ ] Add CSS class .blockquote to css-style-sheet-template.css
- [ ] Add comprehensive accessibility tests
- [ ] Add integration tests with parent/child components
