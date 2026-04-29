# ProgressBar — Implementation Plan

## Goal

Implement the ProgressBar component: a horizontal progress indicator.

## HTML Tag and CSS Class

- HTML tag: `<div>`
- CSS class: `.progress-bar`

## Approach

1. Render `<div>` as the root element with `class="progress-bar"`
2. Accept and spread `restProps` for consumer customization
3. Implement headless variants in HTML, Svelte, React, Vue, Blazor, and Nunjucks subprojects (follow-up)

## Acceptance Criteria

- [ ] Renders `<div>` with class `progress-bar`
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
