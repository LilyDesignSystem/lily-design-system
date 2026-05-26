# Five Star Rating Picker — Implementation Plan

## Goal

Implement the Five Star Rating Picker component: a picker for selecting a 1-5 star rating using radio buttons.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .five-star-rating-picker

## Dependencies

- Requires children: five-star-rating-picker-button

## Companion Component

- five-star-rating-view (Input/View or Input/Link pair)

## Approach

1. Use semantic <div> element with class="five-star-rating-picker"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="five-star-rating-picker"
- [ ] `role="radiogroup"` -- on the `<fieldset>`, identifies the group as a set of radio buttons
- [ ] `aria-label="..."` -- provides an accessible name for the entire rating group
- [ ] Keyboard: Tab: focus the selected radio (or first if none selected)
- [ ] Keyboard: ArrowDown / ArrowRight: move to next radio button
- [ ] Keyboard: ArrowUp / ArrowLeft: move to previous radio button
- [ ] Keyboard: Space: select the focused radio button
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
