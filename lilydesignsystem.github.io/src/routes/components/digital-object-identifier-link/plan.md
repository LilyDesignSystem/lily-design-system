# Digital Object Identifier Link -- Implementation Plan

## Goal

Implement the DigitalObjectIdentifierLink component: a permanent hyperlink for a Digital Object Identifier (DOI) to an electronic source.

## HTML Tag and CSS Class

- HTML tag: <a>
- CSS class: .digital-object-identifier-link

## Approach

1. Use semantic <a> element with class="digital-object-identifier-link"
2. Construct href from DOI using https://doi.org/ resolver prefix
3. Add ARIA attributes for accessibility
4. Implement keyboard navigation
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <a> with class="digital-object-identifier-link"
- [ ] `href` correctly constructed as `https://doi.org/{doi}`
- [ ] `rel="noopener noreferrer"` for external link security
- [ ] Keyboard: Tab: Focus the link
- [ ] Keyboard: Enter: Activate the link
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations
