# GovernmentIdentifier — Implementation Plan

## Goal

Implement the GovernmentIdentifier component: an identifier section with a parent agency logo, agency name, and required government links.

## HTML Tag and CSS Class

- HTML tag: <section>
- CSS class: .government-identifier

## Approach

1. Use semantic <section> element with class="government-identifier" and aria-label
2. Render masthead <div class="government-identifier-masthead"> containing optional logo, agency name (linked when agencyHref is set), and optional description
3. Render <nav class="government-identifier-links"> with aria-label and the children
4. Pass through additional HTML attributes to the section
5. Implement in HTML headless (plain HTML)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React headless (React 19 + TypeScript)
8. Implement in Vue headless (Vue 3 + TypeScript)
9. Implement in Nunjucks headless (macro)
10. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <section> with class="government-identifier" and aria-label
- [ ] Masthead renders agency name (linked when href provided), logo (when provided), description (when provided)
- [ ] Inner <nav class="government-identifier-links"> wraps the children
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base class plus consumer extras
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations
