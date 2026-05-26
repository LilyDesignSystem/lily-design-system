# Medical Banner Box -- Implementation Plan

## Goal

Implement the Medical Banner Box component: a prominent message bar across the top of a page, inside a medical banner, using flexbox horizontal, that displays medical information.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .medical-banner-box

## Approach

1. Use semantic <div> element with class="medical-banner-box"
2. Add data-context="medical" for consumer CSS targeting
3. Render children content
4. Implement in all headless and example subprojects

## Acceptance Criteria

- [ ] Renders <div> with class="medical-banner-box"
- [ ] Has data-context="medical"
- [ ] Works inside a MedicalBanner
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
