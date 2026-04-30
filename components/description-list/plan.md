# DescriptionList — Implementation Plan

## Goal

Implement the DescriptionList component: a definition list displaying information in key-value format <dl>.

## HTML Tag and CSS Class

- HTML tag: `<dl>`
- CSS class: `.description-list`

## Approach

1. Render `<dl>` as the root element with `class="description-list"`
2. Wire ARIA attributes per the AGENTS.md ARIA section
3. Wire keyboard behaviour per the AGENTS.md Keyboard section
4. Spread `restProps` for consumer customization
5. Implement headless variants in HTML, Svelte, React, Vue, Blazor, and Nunjucks subprojects
6. Author tests for each implementation

## Acceptance Criteria

- [ ] Renders `<dl>` with class `description-list`
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] All ARIA attributes documented in AGENTS.md are applied
- [ ] All keyboard interactions documented in AGENTS.md work as described
- [ ] Tests pass in all six headless implementations
