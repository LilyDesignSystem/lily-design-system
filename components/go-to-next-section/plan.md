# GoToNextSection — Implementation Plan

## Goal

Implement the GoToNextSection component: a link that takes users to the next section of the current page.

## HTML Tag and CSS Class

- HTML tag: `<a>`
- CSS class: `.go-to-next-section`

## Approach

1. Render `<a>` as the root element with `class="go-to-next-section"`
2. Accept and spread `restProps` for consumer customization
3. Implement headless variants in HTML, Svelte, React, Vue, Blazor, and Nunjucks subprojects (follow-up)

## Acceptance Criteria

- [ ] Renders `<a>` with class `go-to-next-section`
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
