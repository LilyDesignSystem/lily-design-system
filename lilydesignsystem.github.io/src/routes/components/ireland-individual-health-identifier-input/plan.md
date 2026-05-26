# Ireland Individual Health Identifier Input -- Implementation Plan

## Goal

Implement the Ireland Individual Health Identifier Input component: an input for entering an Ireland Individual Health Identifier (IHI) unique national healthcare identifier.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .ireland-individual-health-identifier-input

## Approach

1. Use semantic <input> element with class="ireland-individual-health-identifier-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="ireland-individual-health-identifier-input"
- [ ] `aria-label` provides accessible name from label prop
- [ ] Pattern: `[0-9]{10}` (10 digits)
- [ ] `inputmode="numeric"` for numeric keyboard on mobile
- [ ] `autocomplete="off"` to protect sensitive health identifiers
- [ ] Keyboard: Standard text input keyboard behavior
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations
