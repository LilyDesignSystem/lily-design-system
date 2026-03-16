# Text Area With Character Counter -- Implementation Plan

## Goal

Implement the Text Area With Character Counter component: a multi-line text area with a caption below that is a character counter "[number] of [maximum] characters".

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .text-area-with-character-counter

## Approach

1. Use semantic <div> wrapper with class="text-area-with-character-counter"
2. Add <textarea> with aria-label, aria-describedby, and maxlength
3. Add character counter <span> with aria-live="polite"
4. Counter text uses configurable template with {count} and {max} placeholders
5. Implement in all headless and example subprojects

## Acceptance Criteria

- [ ] Renders <div> with class="text-area-with-character-counter"
- [ ] Contains <textarea> with aria-label and aria-describedby
- [ ] Contains counter with aria-live="polite"
- [ ] Counter updates reactively
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
