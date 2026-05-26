# Medical Banner Box For Danger — Specification

Single source of truth for spec-driven development of the Medical Banner Box For Danger component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Medical Banner Box For Danger component: a medical record banner box for danger information e.g. reactions, warnings, alarms, etc.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .medical-banner-box-for-danger

## Approach

1. Use semantic <div> element with class="medical-banner-box-for-danger"
2. Add role="region" and aria-label for accessibility
3. Add data-type="danger" for consumer CSS targeting
4. Render children content
5. Implement in all headless and example subprojects

## Acceptance Criteria

- [ ] Renders <div> with class="medical-banner-box-for-danger"
- [ ] Has role="region" and aria-label
- [ ] Has data-type="danger"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .medical-banner-box-for-danger to css-style-sheet-template.css
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
- [ ] Cross-check against css-style-sheet-template.css
