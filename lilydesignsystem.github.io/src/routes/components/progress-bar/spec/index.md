# ProgressBar — Specification

Single source of truth for spec-driven development of the ProgressBar component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the ProgressBar component: a horizontal progress indicator.

## HTML Tag and CSS Class

- HTML tag: `<div>`
- CSS class: `.progress-bar`

## Approach

1. Render `<div>` as the root element with `class="progress-bar"`
2. Accept and spread `restProps` for consumer customization
3. Implement headless variants in HTML, Svelte, React, Vue, Angular, Blazor, and Nunjucks subprojects (follow-up)

## Acceptance Criteria

- [ ] Renders `<div>` with class `progress-bar`
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class hook to css-style-sheet-template.css
- [x] Add component to components.tsv and AGENTS/components.md

### Backlog

- [x] Implement HTML headless component
- [x] Implement Svelte headless component
- [x] Implement React headless component
- [x] Implement Vue headless component
- [x] Implement Blazor headless component
- [x] Implement Nunjucks headless macro
- [x] Add to all `*-examples` subprojects
