# SectionHeading — Implementation Plan

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
