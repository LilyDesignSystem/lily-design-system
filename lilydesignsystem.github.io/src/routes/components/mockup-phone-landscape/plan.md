# MockupPhoneLandscape — Implementation Plan

## Goal

Implement the MockupPhoneLandscape component: a box area that looks like a mobile phone in landscape orientation.

## HTML Tag and CSS Class

- HTML tag: `<div>`
- CSS class: `.mockup-phone-landscape`

## Approach

1. Render `<div>` as the root element with `class="mockup-phone-landscape"`
2. Accept and spread `restProps` for consumer customization
3. Implement headless variants in HTML, Svelte, React, Vue, Blazor, and Nunjucks subprojects (follow-up)

## Acceptance Criteria

- [ ] Renders `<div>` with class `mockup-phone-landscape`
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
