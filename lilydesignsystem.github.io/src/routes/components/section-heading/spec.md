# SectionHeading — Specification

Single source of truth for spec-driven development of the SectionHeading component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the SectionHeading component: a styled heading introducing a major content section, with optional eyebrow and subtitle.

## HTML Tag and CSS Class

- HTML tag: <header>
- CSS class: .section-heading

## Approach

1. Use semantic <header> element with class="section-heading"
2. Require heading prop (TS type non-optional)
3. Validate level prop against 2 | 3 | 4 | 5 | 6 (default 2)
4. Render <p class="section-heading-eyebrow"> above heading when eyebrow provided
5. Render heading element <h{level} class="section-heading-heading"> using dynamic level
6. Render <p class="section-heading-subtitle"> below heading when subtitle provided
7. Implement in HTML headless (plain HTML, no JavaScript needed)
8. Implement in Svelte headless (Svelte 5 + runes; dynamic heading element via {@const} or :element)
9. Implement in React headless (React 19 + TypeScript; createElement for dynamic heading level)
10. Implement in Vue headless (Vue 3 + TypeScript; :is="`h${level}`" via component)
11. Implement in Nunjucks headless (macro)
12. Create tests for each implementation including all heading levels

## Acceptance Criteria

- [ ] Renders <header> with class="section-heading"
- [ ] Heading renders as <h{level} class="section-heading-heading">, default <h2>
- [ ] Eyebrow renders as <p class="section-heading-eyebrow"> only when provided
- [ ] Subtitle renders as <p class="section-heading-subtitle"> only when provided
- [ ] level validation accepts 2-6 only
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the documented inner classes
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, ARIA, and dynamic heading level behavior in index.md

### In Progress

- [ ] Cross-check implementations against the canonical spec

### Backlog

- [ ] Add canonical entry to components.tsv and AGENTS/components.md
- [ ] Implement HTML headless component
- [ ] Implement Svelte headless component
- [ ] Implement React headless component (createElement for dynamic heading level)
- [ ] Implement Vue headless component (dynamic component for heading level)
- [ ] Implement Nunjucks headless component
- [ ] Implement Blazor headless component
- [ ] Add CSS class .section-heading to css-style-sheet-template.css
- [ ] Add tests verifying each level (2-6) renders the correct heading element
- [ ] Add comprehensive accessibility tests
- [ ] Add integration tests with parent/child components
