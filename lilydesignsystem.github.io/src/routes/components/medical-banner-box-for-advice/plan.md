# Medical Banner Box For Advice -- Implementation Plan

## Goal

Implement the Medical Banner Box For Advice component: a medical record banner box for advice information e.g. contacts, contexts, plans, etc.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .medical-banner-box-for-advice

## Approach

1. Use semantic <div> element with class="medical-banner-box-for-advice"
2. Add role="region" and aria-label for accessibility
3. Add data-type="advice" for consumer CSS targeting
4. Render children content
5. Implement in all headless and example subprojects

## Acceptance Criteria

- [ ] Renders <div> with class="medical-banner-box-for-advice"
- [ ] Has role="region" and aria-label
- [ ] Has data-type="advice"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations
