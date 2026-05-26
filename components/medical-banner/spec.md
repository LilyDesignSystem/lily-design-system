# Medical Banner — Specification

Single source of truth for spec-driven development of the Medical Banner component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Medical Banner component: a prominent message bar across the top of a page that displays medical information.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .medical-banner

## Approach

1. Use semantic <div> element with class="medical-banner"
2. Add role="region", aria-live="polite", aria-label for accessibility
3. Add data-type and data-context="medical" attributes
4. Support dismissible with close button
5. Implement in all headless and example subprojects

## Acceptance Criteria

- [ ] Renders <div> with class="medical-banner"
- [ ] Has role="region", aria-live="polite", aria-label
- [ ] Has data-context="medical"
- [ ] Dismissible with close button
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .medical-banner to css-style-sheet-template.css
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
