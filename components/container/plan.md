# Container — Implementation Plan

## Goal

Implement the Container component: a generic block-level content container.

## HTML Tag and CSS Class

- HTML tag: `<div>`
- CSS class: `.container`

## Approach

1. Render `<div>` as the root element with `class="container"`
2. Accept and spread `restProps` for consumer customization
3. Implement headless variants in HTML, Svelte, React, Vue, Blazor, and Nunjucks subprojects (follow-up)

## Acceptance Criteria

- [ ] Renders `<div>` with class `container`
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
