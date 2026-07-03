# AddressographBox — Specification

Single source of truth for spec-driven development of the AddressographBox component.

## Goal

Implement the AddressographBox component: a box that shows a person's identification details, such as name, tracking information, and salient notations.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .addressograph-box

## Approach

1. Use semantic <div> element with class="addressograph-box"
2. Apply optional aria-label for accessible name
3. Spread rest props onto the root element
4. Implement in HTML headless (plain HTML)
5. Implement in Svelte, React, Vue, Angular, Blazor, Nunjucks headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="addressograph-box"
- [ ] aria-label applied when provided
- [ ] Children slot rendered correctly
- [ ] Rest props pass through to the root element
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Add row to components.tsv
- [x] Add CSS class .addressograph-box to css-style-sheet-template.css
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
