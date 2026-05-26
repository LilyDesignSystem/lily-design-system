# FeatureCard — Specification

Single source of truth for spec-driven development of the FeatureCard component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the FeatureCard component: a large content card with a prominent image positioned alongside or above the text.

## HTML Tag and CSS Class

- HTML tag: <article>
- CSS class: .feature-card

## Approach

1. Use semantic <article> element with class="feature-card"
2. Require heading prop (TS type non-optional)
3. Default imagePosition to "start" and surface as data-image-position
4. Render <img class="feature-card-image"> only when imageUrl is provided
5. Render <header class="feature-card-header"> with <h3 class="feature-card-heading">
6. Render <p class="feature-card-description"> only when description is provided
7. Render children after the description for arbitrary content (CTAs)
8. Set aria-label to label prop or fall back to heading
9. Implement in HTML headless (plain HTML, no JavaScript needed)
10. Implement in Svelte headless (Svelte 5 + runes)
11. Implement in React headless (React 19 + TypeScript)
12. Implement in Vue headless (Vue 3 + TypeScript)
13. Implement in Nunjucks headless (macro)
14. Create tests for each implementation including image position variants

## Acceptance Criteria

- [ ] Renders <article> with class="feature-card"
- [ ] data-image-position reflects imagePosition (default "start")
- [ ] Heading renders as <h3 class="feature-card-heading"> inside <header>
- [ ] Image renders only when imageUrl provided, with alt from imageAlt
- [ ] Description renders inside <p class="feature-card-description"> when provided
- [ ] aria-label defaults to heading and can be overridden
- [ ] Children render after description
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the documented inner classes
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, ARIA, and image position variants in index.md

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
- [ ] Add CSS class .feature-card to css-style-sheet-template.css
- [ ] Add tests verifying data-image-position for "start", "end", and "top"
- [ ] Add comprehensive accessibility tests
- [ ] Add integration tests with parent/child components
