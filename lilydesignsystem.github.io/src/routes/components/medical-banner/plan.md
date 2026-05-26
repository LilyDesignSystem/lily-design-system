# Medical Banner -- Implementation Plan

## Goal

Implement the Medical Banner component: a prominent message bar across the top of a page that displays medical information.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .medical-banner

## Approach

1. Use semantic <div> element with class="medical-banner"
2. Add role="region", aria-live="polite", aria-label for accessibility
3. Add data-type and data-context="medical" attributes
4. Support dismissible with close button
5. Implement in all headless and example subprojects

## Acceptance Criteria

- [ ] Renders <div> with class="medical-banner"
- [ ] Has role="region", aria-live="polite", aria-label
- [ ] Has data-context="medical"
- [ ] Dismissible with close button
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
