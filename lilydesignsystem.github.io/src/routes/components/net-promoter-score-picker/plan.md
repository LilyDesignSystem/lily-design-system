# Net Promoter Score Picker — Implementation Plan

## Goal

Implement the Net Promoter Score Picker component: a picker for selecting a 0-10 Net Promoter Score.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .net-promoter-score-picker

## Dependencies

- Requires children: net-promoter-score-picker-button

## Companion Component

- net-promoter-score-view (Input/View or Input/Link pair)

## Approach

1. Use semantic <div> element with class="net-promoter-score-picker"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="net-promoter-score-picker"
- [ ] `role="radiogroup"` on the fieldset
- [ ] `aria-label` on the fieldset from the label prop
- [ ] Each radio has `aria-label` with its numeric value
- [ ] Keyboard: Arrow keys navigate between radio buttons (native radio group behavior)
- [ ] Keyboard: Space selects the focused radio button
- [ ] Keyboard: Tab moves focus into/out of the radio group
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
