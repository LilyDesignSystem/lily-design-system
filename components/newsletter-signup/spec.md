# NewsletterSignup — Specification

Single source of truth for spec-driven development of the NewsletterSignup component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the NewsletterSignup component: an email subscription form composition with idle, submitting, success, and error states.

## HTML Tag and CSS Class

- HTML tag: <form>
- CSS class: .newsletter-signup

## Approach

1. Use semantic <form> element with class="newsletter-signup"
2. Require label, emailLabel, and submitLabel props (TS types non-optional)
3. Surface state prop as data-state on the form (default "idle")
4. Render optional <header> with <h3>heading</h3> and optional <p>description</p>
5. Render <label>{emailLabel}<input type="email" .../></label>
6. Disable email input and submit button when state="submitting"
7. Render success message <p class="newsletter-signup-success" role="status" aria-live="polite" hidden={state !== "success"}>
8. Render error message <p class="newsletter-signup-error" role="alert" hidden={state !== "error"}>
9. Wire onSubmit / onsubmit callback to form submit event
10. Implement in HTML headless (vanilla JS for any interactive demo)
11. Implement in Svelte headless (Svelte 5 + runes)
12. Implement in React headless (React 19 + TypeScript)
13. Implement in Vue headless (Vue 3 + TypeScript)
14. Implement in Nunjucks headless (macro)
15. Create tests for each implementation including state transitions

## Acceptance Criteria

- [ ] Renders <form> with class="newsletter-signup" and aria-label
- [ ] data-state reflects state prop, default "idle"
- [ ] Email input and submit button disabled when state="submitting"
- [ ] Success message uses role="status" + aria-live="polite", hidden unless state="success"
- [ ] Error message uses role="alert", hidden unless state="error"
- [ ] Submit handler fires on form submission
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the documented inner classes
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, ARIA, and state behavior in index.md

### In Progress

- [ ] Cross-check implementations against the canonical spec

### Backlog

- [ ] Add canonical entry to components.tsv and AGENTS/components.md
- [ ] Implement HTML headless component
- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Nunjucks headless component
- [ ] Implement Blazor headless component
- [ ] Add CSS class .newsletter-signup to css-style-sheet-template.css
- [ ] Add tests verifying state transitions (idle, submitting, success, error)
- [ ] Add tests verifying disabled state of input and submit button when submitting
- [ ] Add tests verifying role="status" and role="alert" on the message paragraphs
- [ ] Add comprehensive accessibility tests
- [ ] Add integration tests with parent/child components
