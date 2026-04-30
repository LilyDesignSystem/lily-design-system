# RelatedContent — Implementation Plan

## Goal

Implement the RelatedContent component: a section providing links to related or supporting information.

## HTML Tag and CSS Class

- HTML tag: `<aside>`
- CSS class: `.related-content`

## Approach

1. Render `<aside>` as the root element with `class="related-content"`
2. Wire ARIA attributes per the AGENTS.md ARIA section
3. Wire keyboard behaviour per the AGENTS.md Keyboard section
4. Spread `restProps` for consumer customization
5. Implement headless variants in HTML, Svelte, React, Vue, Blazor, and Nunjucks subprojects
6. Author tests for each implementation

## Acceptance Criteria

- [ ] Renders `<aside>` with class `related-content`
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] All ARIA attributes documented in AGENTS.md are applied
- [ ] All keyboard interactions documented in AGENTS.md work as described
- [ ] Tests pass in all six headless implementations
