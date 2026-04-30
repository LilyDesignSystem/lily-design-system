# StepListItem — Implementation Plan

## Goal

Implement the StepListItem component: one step in a step list with status of waiting, in progress, finished, or error.

## HTML Tag and CSS Class

- HTML tag: <li>
- CSS class: .step-list-item

## Approach

1. Use semantic <li> element with class="step-list-item"
2. Apply data-status from the status prop (default "waiting")
3. Apply aria-current="step" when current is true; omit otherwise
4. Apply aria-label when the optional label prop is provided
5. Render children inside the list item
6. Implement in HTML headless (plain HTML)
7. Implement in Svelte headless (Svelte 5 + runes)
8. Implement in React headless (React 19 + TypeScript)
9. Implement in Vue headless (Vue 3 + TypeScript)
10. Implement in Nunjucks headless (macro)
11. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <li> with class="step-list-item"
- [ ] data-status reflects status prop
- [ ] aria-current="step" present only when current is true
- [ ] aria-label applied when label prop is provided
- [ ] Children render correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS classes beyond the base class plus consumer extras
- [ ] Tests pass in all implementations
