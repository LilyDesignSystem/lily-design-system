# MiddleTruncation — Specification

Single source of truth for the MiddleTruncation component: a string shortened in the middle to fit its width, keeping the start and the end.

## Goal

Shorten text in the middle without losing it: the full text stays in the accessibility tree, the shortened string is a visual aid.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .middle-truncation (sub-elements `.middle-truncation-visual`, `.middle-truncation-full`)

## Requirements

1. Root is `<span>` with first attribute `class="middle-truncation {class}"`.
2. `.middle-truncation-visual` carries `aria-hidden="true"` and the (possibly shortened) text.
3. `.middle-truncation-full` carries the whole text and is never `aria-hidden`.
4. `ellipsis` is required and has no default.
5. `strategy` is `even` (default), `fixed-end` or `min-end`; `end` applies to the last two.
6. Cuts fall between grapheme clusters.
7. The text is re-measured when the root resizes; with no layout width, or before measuring, the full text is shown.
8. `data-strategy` is always set; `data-truncated` only while shortened.
9. `restProps` spread onto the root.
10. No CSS, inline styles or hardcoded strings.

## Acceptance Criteria

- [x] Svelte canonical implemented with tests per requirement, and `shared/middle-truncation.ts` with 10 tests
- [x] Ported to React, Vue, Angular, Blazor (`MaxCharacters` budget, no pixel measuring), Nunjucks (markup and data attributes; the browser shortens), HTML (inline script), Web Components, Alpine (2026-10-23)
- [x] The 57 themes carry a `.middle-truncation-full` visually-hidden rule and a `.middle-truncation` bounded block (2026-10-23)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
