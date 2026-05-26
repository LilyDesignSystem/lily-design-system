# StickyPromoBanner — Implementation Plan

## Goal

Implement the StickyPromoBanner component: a fixed-position promotional banner with a dismiss button.

## HTML Tag and CSS Class

- HTML tag: <aside>
- CSS class: .sticky-promo-banner

## Approach

1. Use semantic <aside> element with class="sticky-promo-banner" and role="complementary"
2. Require label and dismissLabel props (TS types non-optional)
3. Default open to true and apply native hidden attribute when open is false
4. Default position to "bottom"; surface as data-position
5. Apply inline style="position: fixed; left: 0; right: 0;" plus top: 0 or bottom: 0 based on position
6. Render <div class="sticky-promo-banner-content">{children}</div>
7. Render <button type="button" class="sticky-promo-banner-dismiss" aria-label={dismissLabel}> only when onDismiss / ondismiss is provided
8. Wire dismiss button click to onDismiss / ondismiss callback
9. Implement in HTML headless (vanilla JS for dismiss demo)
10. Implement in Svelte headless (Svelte 5 + runes)
11. Implement in React headless (React 19 + TypeScript)
12. Implement in Vue headless (Vue 3 + TypeScript)
13. Implement in Nunjucks headless (macro)
14. Create tests for each implementation including position variants and dismiss behavior

## Acceptance Criteria

- [ ] Renders <aside> with class="sticky-promo-banner" and role="complementary"
- [ ] aria-label equals label prop; data-position reflects position prop
- [ ] Inline style includes position: fixed; left: 0; right: 0; plus top: 0 or bottom: 0
- [ ] hidden attribute applied when open is false
- [ ] Dismiss <button type="button"> renders only when onDismiss / ondismiss is provided
- [ ] Dismiss button has aria-label equal to dismissLabel prop
- [ ] Dismiss handler fires on click and Enter/Space
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: only documented inline positioning styles, no <style> blocks
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations
