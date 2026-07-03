# InputWithMask — Specification

Single source of truth for spec-driven development of the InputWithMask component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the InputWithMask component: an input displaying a format mask placeholder for the user to fill in.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .input-with-mask

## Approach

1. Use a wrapping <div> with class="input-with-mask" and data-mask attribute
2. Render the mask string in a decorative <span class="input-with-mask-display" aria-hidden="true">
3. Render <input class="input-with-mask-control" type="text"> with aria-label, value, placeholder, disabled
4. Wire onInput / oninput handler to the input
5. Pass through additional HTML attributes
6. Implement in HTML headless (plain HTML + vanilla JS)
7. Implement in Svelte headless (Svelte 5 + runes)
8. Implement in React headless (React 19 + TypeScript)
9. Implement in Vue headless (Vue 3 + TypeScript)
10. Implement in Nunjucks headless (macro)
11. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="input-with-mask" and data-mask
- [ ] Decorative mask span has aria-hidden="true"
- [ ] Inner <input> has aria-label and class="input-with-mask-control"
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
- [ ] Add CSS class .input-with-mask to css-style-sheet-template.css
- [ ] Add comprehensive accessibility tests
- [ ] Add integration tests with form components and validation
