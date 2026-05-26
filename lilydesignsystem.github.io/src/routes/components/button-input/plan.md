# Button Input — Implementation Plan

## Goal

Implement the Button Input component: an input element of type button for form actions <input type="button">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .button-input

## Approach

1. Use semantic <input> element with class="button-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="button-input"
- [ ] `aria-label={label}` -- optional screen reader label override; when provided, screen readers announce this instead of the `value` text
- [ ] `aria-disabled` -- implicitly managed by the native `disabled` attribute
- [ ] Keyboard: Tab: Focus the button input
- [ ] Keyboard: Enter: Activate the button (native behavior)
- [ ] Keyboard: Space: Activate the button (native behavior)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
