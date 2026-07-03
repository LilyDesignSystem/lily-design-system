# FloatButton — Specification

Single source of truth for spec-driven development of the FloatButton component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the FloatButton component: a floating action button anchored to a viewport corner.

## HTML Tag and CSS Class

- HTML tag: <button>
- CSS class: .float-button

## Approach

1. Use semantic <button> element with class="float-button"
2. Apply inline style position: fixed plus corner offsets per position prop
3. Emit data-position with the chosen corner
4. Require the label prop and apply it as aria-label
5. Default type to "button"; respect type and disabled props
6. Implement in HTML headless (plain HTML)
7. Implement in Svelte headless (Svelte 5 + runes)
8. Implement in React headless (React 19 + TypeScript)
9. Implement in Vue headless (Vue 3 + TypeScript)
10. Implement in Nunjucks headless (macro)
11. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <button> with class="float-button"
- [ ] Required ARIA attributes are set (aria-label)
- [ ] Inline style includes position: fixed and the right corner offsets
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
- [ ] Add CSS class .float-button to css-style-sheet-template.css
- [ ] Add comprehensive accessibility tests
- [ ] Add integration tests with parent/child components
