# Medical Banner Box For Danger -- Implementation Plan

## Goal

Implement the Medical Banner Box For Danger component: a medical record banner box for danger information e.g. reactions, warnings, alarms, etc.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .medical-banner-box-for-danger

## Approach

1. Use semantic <div> element with class="medical-banner-box-for-danger"
2. Add role="region" and aria-label for accessibility
3. Add data-type="danger" for consumer CSS targeting
4. Render children content
5. Implement in all headless and example subprojects

## Acceptance Criteria

- [ ] Renders <div> with class="medical-banner-box-for-danger"
- [ ] Has role="region" and aria-label
- [ ] Has data-type="danger"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations
