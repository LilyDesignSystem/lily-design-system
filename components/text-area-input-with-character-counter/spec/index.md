# Text Area With Character Counter — Specification

Single source of truth for spec-driven development of the Text Area With Character Counter component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Text Area With Character Counter component: a multi-line text area with a caption below that is a character counter "[number] of [maximum] characters".

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .text-area-input-with-character-counter

## Approach

1. Use semantic <div> wrapper with class="text-area-input-with-character-counter"
2. Add <textarea> with aria-label, aria-describedby, and maxlength
3. Add character counter <span> with aria-live="polite"
4. Counter text uses configurable template with {count} and {max} placeholders
5. Implement in all headless and example subprojects

## Acceptance Criteria

- [ ] Renders <div> with class="text-area-input-with-character-counter"
- [ ] Contains <textarea> with aria-label and aria-describedby
- [ ] Contains counter with aria-live="polite"
- [ ] Counter updates reactively
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .text-area-input-with-character-counter to css-style-sheet-template.css
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
