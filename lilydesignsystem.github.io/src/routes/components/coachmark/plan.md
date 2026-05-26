# Coachmark — Implementation Plan

## Goal

Implement the Coachmark component: an anchored popover that spotlights and explains a single feature.

## HTML Tag and CSS Class

- HTML tag: <div> with role="dialog"
- CSS class: .coachmark

## Approach

1. Use a <div> with role="dialog", aria-modal="false", and class="coachmark"
2. Generate stable ids for title and description via useId, crypto.randomUUID, or a Math.random helper
3. Render <h2 class="coachmark-title" id={titleId}>{title}</h2> and link via aria-labelledby
4. Render optional <p class="coachmark-description" id={descId}>{description}</p> and link via aria-describedby when present
5. Render a dismiss button with class="coachmark-dismiss" and aria-label={dismissLabel}
6. Apply the `hidden` attribute when `open` is false
7. Forward the dismiss button click as `onDismiss`
8. Implement in HTML headless (plain HTML + vanilla JS)
9. Implement in Svelte headless (Svelte 5 + runes)
10. Implement in React headless (React 19 + TypeScript)
11. Implement in Vue headless (Vue 3 + TypeScript)
12. Implement in Nunjucks headless (macro)
13. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div role="dialog" aria-modal="false"> with class="coachmark"
- [ ] aria-labelledby references the title id
- [ ] aria-describedby references the description id only when description is provided
- [ ] Title id and description id are stable
- [ ] hidden attribute reflects !open
- [ ] Dismiss button has aria-label={dismissLabel} and fires onDismiss
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base class plus consumer extras
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations
