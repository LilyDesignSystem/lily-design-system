# Espana Tarjeta Sanitaria Individual Input -- Implementation Plan

## Goal

Implement the Espana Tarjeta Sanitaria Individual Input component: an input for entering a España Tarjeta Sanitaria Individual (TSI) unique national healthcare identifier.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .espana-tarjeta-sanitaria-individual-input

## Approach

1. Use semantic <input> element with class="espana-tarjeta-sanitaria-individual-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="espana-tarjeta-sanitaria-individual-input"
- [ ] `aria-label` provides accessible name from label prop
- [ ] Keyboard: Standard text input keyboard behavior
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations
