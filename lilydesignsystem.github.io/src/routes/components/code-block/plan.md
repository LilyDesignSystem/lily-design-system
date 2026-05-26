# CodeBlock -- Implementation Plan

## Goal

Implement the CodeBlock component: a block of formatted code with optional line numbers and line highlighting.

## HTML Tag and CSS Class

- HTML tag: <pre>
- CSS class: .code-block

## Approach

1. Use semantic <pre> element with class="code-block"
2. Add nested <code> element for semantic code marking
3. Add ARIA attributes for accessibility
4. Implement line numbers and line highlighting via data attributes
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <pre> with class="code-block"
- [ ] `aria-label` -- optional description of the code block content
- [ ] Supports `data-line-numbers` attribute
- [ ] Supports `data-highlight-lines` attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations
