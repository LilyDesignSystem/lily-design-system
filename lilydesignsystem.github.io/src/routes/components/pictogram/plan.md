# Pictogram — Implementation Plan

## Goal

Implement the Pictogram component: an icon-based component pairing an icon with a title and description in a centered or side layout.

## HTML Tag and CSS Class

- HTML tag: <figure>
- CSS class: .pictogram

## Approach

1. Use semantic <figure> element with class="pictogram"
2. Require icon as a slot/snippet/ReactNode prop (NOT children)
3. Wrap the icon in <div class="pictogram-icon" aria-hidden="true">
4. Default layout to "centered" and surface as data-layout
5. Render <figcaption class="pictogram-caption"> containing optional heading and description
6. Use <h3 class="pictogram-heading"> for the heading when provided
7. Use <p class="pictogram-description"> for the description, replaced by children when provided
8. Render aria-label only when label prop is provided
9. Implement in HTML headless (plain HTML, no JavaScript needed)
10. Implement in Svelte headless (Svelte 5 + runes; icon as Snippet)
11. Implement in React headless (React 19 + TypeScript; icon as ReactNode)
12. Implement in Vue headless (Vue 3 + TypeScript; icon as named slot)
13. Implement in Nunjucks headless (macro with caller block for icon)
14. Create tests for each implementation including layout variants and aria-hidden icon

## Acceptance Criteria

- [ ] Renders <figure> with class="pictogram"
- [ ] data-layout reflects layout prop (default "centered")
- [ ] Icon wrapped in aria-hidden="true" container with class="pictogram-icon"
- [ ] Heading renders as <h3 class="pictogram-heading"> when provided
- [ ] Description renders as <p class="pictogram-description"> when provided
- [ ] Children replace description when provided
- [ ] icon prop is required in TS types
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the documented inner classes
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations
