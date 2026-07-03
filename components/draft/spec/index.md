# Draft — Specification

Single source of truth for spec-driven development of the Draft component.

## Goal

Implement the Draft component: an early preliminary version of content such as an article, email, report, etc.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .draft

## Approach

1. Use semantic <div> element with class="draft"
2. Apply optional aria-label for accessible name
3. Apply optional data-status attribute from status prop
4. Spread rest props onto the root element
5. Implement in HTML headless (plain HTML)
6. Implement in Svelte, React, Vue, Angular, Blazor, Nunjucks headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="draft"
- [ ] aria-label applied when provided
- [ ] data-status applied when status prop is provided
- [ ] Children slot rendered correctly
- [ ] Rest props pass through to the root element
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Add row to components.tsv
- [x] Add CSS class .draft to css-style-sheet-template.css
- [x] Create component directory with index.md, README.md symlink, AGENTS.md, CLAUDE.md, spec/index.md

### Backlog

- [ ] Implement HTML headless component
- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Angular headless component
- [ ] Implement Blazor headless component
- [ ] Implement Nunjucks headless component
- [ ] Add demos in all 7 example apps
