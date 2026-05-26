# scroller-video — Implementation Plan

## Goal

Implement the scroller-video component: scroller-video.

## HTML Tag and CSS Class

- HTML tag: `<div>`
- CSS class: `.scroller-video`

## Approach

1. Render `<div>` as the root element with `class="scroller-video"`
2. Wire ARIA attributes per the AGENTS.md ARIA section
3. Wire keyboard behaviour per the AGENTS.md Keyboard section
4. Spread `restProps` for consumer customization
5. Implement headless variants in HTML, Svelte, React, Vue, Blazor, and Nunjucks subprojects
6. Author tests for each implementation

## Acceptance Criteria

- [ ] Renders `<div>` with class `scroller-video`
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] All ARIA attributes documented in AGENTS.md are applied
- [ ] All keyboard interactions documented in AGENTS.md work as described
- [ ] Tests pass in all six headless implementations
