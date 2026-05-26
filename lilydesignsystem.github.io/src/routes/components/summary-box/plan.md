# SummaryBox — Implementation Plan

## Goal

Implement the SummaryBox component: a boxed callout highlighting key takeaways or next steps from a longer page.

## HTML Tag and CSS Class

- HTML tag: <aside>
- CSS class: .summary-box

## Approach

1. Use semantic <aside> element with class="summary-box" and aria-label
2. Default aria-label to the heading text; override with the optional label prop
3. Render <h3 class="summary-box-heading"> with the required heading
4. Render <div class="summary-box-body"> with the children
5. Pass through additional HTML attributes to the aside
6. Implement in HTML headless (plain HTML)
7. Implement in Svelte headless (Svelte 5 + runes)
8. Implement in React headless (React 19 + TypeScript)
9. Implement in Vue headless (Vue 3 + TypeScript)
10. Implement in Nunjucks headless (macro)
11. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <aside> with class="summary-box" and aria-label
- [ ] Heading rendered as <h3 class="summary-box-heading">
- [ ] Body rendered inside <div class="summary-box-body">
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base class plus consumer extras
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations
