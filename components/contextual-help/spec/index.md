# ContextualHelp — Specification

Single source of truth for spec-driven development of the ContextualHelp component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the ContextualHelp component: a help button that opens a popover with explanatory content.

## HTML Tag and CSS Class

- HTML tag: <div> wrapper containing a <button> trigger and a <div role="dialog"> panel
- CSS class: .contextual-help

## Approach

1. Generate a stable panel id via useId, crypto.randomUUID, or a Math.random helper
2. Render the wrapper <div class="contextual-help">
3. Render <button class="contextual-help-trigger" type="button"> with aria-label={label}
4. Set aria-haspopup="dialog", aria-expanded={expanded}, and aria-controls={panelId} on the trigger
5. Render <div class="contextual-help-panel" id={panelId} role="dialog"> with the children content
6. Apply the `hidden` attribute on the panel when `expanded` is false
7. Forward the trigger click as `onClick`
8. Implement in HTML headless (plain HTML + vanilla JS)
9. Implement in Svelte headless (Svelte 5 + runes)
10. Implement in React headless (React 19 + TypeScript)
11. Implement in Vue headless (Vue 3 + TypeScript)
12. Implement in Nunjucks headless (macro)
13. Create tests for each implementation

## Acceptance Criteria

- [ ] Wrapper <div> has class="contextual-help"
- [ ] Trigger <button> has aria-label={label}, aria-haspopup="dialog", aria-expanded={expanded}, aria-controls={panelId}
- [ ] Panel <div> has role="dialog" and id={panelId}
- [ ] Panel uses the hidden attribute when expanded is false
- [ ] Panel id is stable
- [ ] onClick fires when the trigger is activated
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
- [ ] Add CSS class .contextual-help to css-style-sheet-template.css
- [ ] Add stable-id tests for hydration safety
- [ ] Add accessibility tests for aria-controls / aria-expanded wiring
