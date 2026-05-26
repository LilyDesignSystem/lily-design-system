# Text Input With Search — Specification

Single source of truth for spec-driven development of the Text Input With Search component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Text Input With Search component: a single-line text input field <input type="text"> with search capability.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .text-input-with-search

## Approach

1. Use semantic <div> wrapper with role="search" and class="text-input-with-search"
2. Add <input type="text"> with aria-label
3. Add <button type="button"> that triggers search callback
4. Add Enter key handler on input to trigger search
5. Implement in all headless and example subprojects

## Acceptance Criteria

- [ ] Renders <div> with class="text-input-with-search" and role="search"
- [ ] Contains <input type="text"> with aria-label
- [ ] Contains <button type="button"> with aria-label
- [ ] Enter in input triggers search
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .text-input-with-search to css-style-sheet-template.css
- [x] Implement HTML headless component
- [x] Implement Svelte headless component
- [x] Implement React headless component
- [x] Implement Vue headless component
- [x] Add to Svelte SvelteKit examples
- [x] Add to React Next.js examples
- [x] Add to Vue Nuxt.js examples

### Backlog

- [ ] Implement tests for all implementations
- [ ] Implement Blazor headless component
