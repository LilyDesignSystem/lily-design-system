# GovernmentIdentifier — Specification

Single source of truth for spec-driven development of the GovernmentIdentifier component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the GovernmentIdentifier component: an identifier section with a parent agency logo, agency name, and required government links.

## HTML Tag and CSS Class

- HTML tag: <section>
- CSS class: .government-identifier

## Approach

1. Use semantic <section> element with class="government-identifier" and aria-label
2. Render masthead <div class="government-identifier-masthead"> containing optional logo, agency name (linked when agencyHref is set), and optional description
3. Render <nav class="government-identifier-links"> with aria-label and the children
4. Pass through additional HTML attributes to the section
5. Implement in HTML headless (plain HTML)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React headless (React 19 + TypeScript)
8. Implement in Vue headless (Vue 3 + TypeScript)
9. Implement in Nunjucks headless (macro)
10. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <section> with class="government-identifier" and aria-label
- [ ] Masthead renders agency name (linked when href provided), logo (when provided), description (when provided)
- [ ] Inner <nav class="government-identifier-links"> wraps the children
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base class plus consumer extras
- [ ] WCAG 2.2 AAA compliant
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
- [ ] Add CSS class .government-identifier to css-style-sheet-template.css
- [ ] Add comprehensive accessibility tests for landmarks
- [ ] Add integration tests with parent/child components
