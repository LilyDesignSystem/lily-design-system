# Accordion Checkbox — Specification

Single source of truth for spec-driven development of the Accordion Checkbox component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the AccordionCheckbox component: a checkbox option that reveals an accordion panel when checked.

## HTML Tag and CSS Class

- Root HTML tag: `<div>`
- Root CSS class: `.accordion-checkbox`
- Inner classes: `.accordion-checkbox-input`, `.accordion-checkbox-label`, `.accordion-checkbox-panel`

## Approach

1. Render `<div class="accordion-checkbox">` as root
2. Inside, render `<input type="checkbox" class="accordion-checkbox-input">` with id and `aria-controls` pointing at the panel
3. Render `<label for="…" class="accordion-checkbox-label">` with the consumer-supplied label text
4. Render `<div class="accordion-checkbox-panel" role="region" aria-labelledby="…" hidden>` for the revealable content
5. Wire up `aria-expanded` on the checkbox and `hidden` on the panel to follow `checked`
6. Auto-generate a unique id when none is provided so multiple instances don't collide
7. Implement in HTML headless (vanilla JS toggle), Svelte (runes), React (controlled), Vue (defineModel), Blazor (EventCallback), Nunjucks (macro with no JS — relies on consumer behaviour)

## Acceptance Criteria

- [ ] Renders `<div class="accordion-checkbox">` containing checkbox + label + panel
- [ ] `aria-controls` on the checkbox matches the panel id
- [ ] `aria-expanded` on the checkbox follows checked state
- [ ] Panel uses `role="region"` + `aria-labelledby` and `hidden` when unchecked
- [ ] Toggling the checkbox via Space reveals/hides the panel
- [ ] Two-way binding on `checked` works
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all six headless implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class hooks to css-style-sheet-template.css
- [x] Implement HTML headless component (accordion-checkbox.html + .test.js)
- [x] Implement Svelte headless component (AccordionCheckbox.svelte + .test.ts + .stories.svelte + index.md)
- [x] Implement React headless component (AccordionCheckbox.tsx + .test.tsx + .md)
- [x] Implement Vue headless component (AccordionCheckbox.vue + .test.ts + .md)
- [x] Implement Blazor headless component (AccordionCheckbox.razor + .md)
- [x] Implement Nunjucks headless macro (macro.njk + macro.test.js + index.md)

### Backlog

- [x] Add comprehensive keyboard interaction tests (Tab order, Space toggle)
- [x] Add screen reader announcement tests (aria-expanded transitions, region role)
- [x] Add example pages in each `*-examples` subproject
- [x] Cross-check against css-style-sheet-template.css
