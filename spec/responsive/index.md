# Responsive

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Responsive behaviour is a CSS concern that lives in the themes and the consumer's stylesheet, never in the headless components. The rules are mobile first, intrinsic sizing before breakpoints, `rem` breakpoints, logical properties and reflow at 320 CSS pixels and 400% zoom.

## Scope

This topic covers the rules for writing responsive CSS in Lily's reference themes and example apps, and how those rules are checked. The binding short form is [AGENTS/responsive.md](../../AGENTS/responsive.md).

It does **not** cover: the headless markup rules (see [headless](../headless/index.md)), token shape and `data-theme` switching (see [theme](../theme/index.md)), the test runners (see [testing](../testing/index.md)), or text direction (see [internationalization](../internationalization/index.md)).

## Principles and rules

- **Mobile first** for new CSS. Base rules are the narrow layout; queries use `min-width`.
- **Intrinsic sizing before breakpoints.** `minmax()`, `min()`, `clamp()`, `flex-wrap` and `repeat(auto-fit, …)` first; a breakpoint only where the layout changes in kind.
- **`rem` breakpoints.** The 57 themes use `48rem` (Tailwind's `md`), so they follow the viewer's font size. `px` breakpoints are not used.
- **Container queries for components, viewport queries for page shells.** Done in the themes (P15-T2): the three grail-layout regions are containers; `card` is not, because inline-size containment collapses it in a shrink-to-fit parent. A component outside a grail region has no container and keeps its wide layout.
- **Logical properties** so right-to-left needs no second stylesheet.
- **No `100vw` widths** on `body` or full-width blocks.
- **Reflow (WCAG 1.4.10) and resize (1.4.4).** No horizontal page scroll at 320 CSS pixels; usable at 400% zoom. Wide content scrolls inside its own labelled, focusable region.
- **Text stays at or above `1rem`;** fluid values are for spacing only.
- **`(hover: none)` and `(pointer: coarse)`** decide touch affordances, not viewport width.
- **Headless stays clean.** No media or container queries, `vw`/`vh` units or breakpoint literals in a component ([theme](../theme/index.md)).

## Breakpoint table

`@media` cannot read a custom property, so a `--lily-breakpoint-md` token would not work. The numbers are written
down here instead, in `rem` (Tailwind's scale, so adopters moving between systems see no surprises), and
`bin/check-theme` rejects any viewport `@media` width in a theme that is not in the table.

| Name  | Width   | Used today                                                                |
| ----- | ------- | ------------------------------------------------------------------------- |
| `sm`  | `40rem` | NHS Wales for patients: a primary button in a form goes full width (DHCW) |
| `md`  | `48rem` | All 57 themes: `grail-layout` collapses to one column                     |
| `lg`  | `64rem` | unused                                                                    |
| `xl`  | `80rem` | unused                                                                    |
| `2xl` | `96rem` | unused                                                                    |

A new breakpoint is a change to this table and to `BREAKPOINTS_REM` in `bin/check-theme`, in the same commit.
Container queries ( `@container` ) size a component, not the page, and are not in this table.

## Current state of the themes

Measured 2026-10-28 over `themes/*.css`: every theme has one `@media (max-width: 48rem)` query, so they are
desktop-first today, not mobile first; NHS Wales for patients adds a `40rem` one. All 57 use
`max-width: calc(100vw - 1rem)` to cap a popup, which is allowed (the `100vw` rule is about widths of `body` and
full-width blocks). Moving the themes to `min-width` queries is not planned: the rule binds new CSS, and a rewrite of
57 themes needs its own task.

## Where each rule is verified

| Rule                    | Check today                                                                          | Planned                              |
| ----------------------- | ------------------------------------------------------------------------------------ | ------------------------------------ |
| No horizontal overflow  | Four-viewport sweep in every example app                                             | 320px and 400% zoom (P15-T8)         |
| Breakpoints in `rem`    | `bin/check-theme` rule 9, against the table above                                    | none                                 |
| `container-type` set    | `bin/check-theme` rule 8; the section is pinned across all 57 themes                 | none                                 |
| No `100vw` on `body`    | none                                                                                 | `bin/check-theme` (P15-T1 follow-up) |
| Headless has no queries | Forbidden-literal list in [AGENTS/theme.md](../../AGENTS/theme.md), reviewed by hand | none                                 |

## Acceptance criteria

- [x] `AGENTS/responsive.md` states the rules and is loaded by `AGENTS.md`.
- [x] This topic is listed in the spec index.
- [x] `bin/check-theme` rejects `px` and off-table viewport breakpoints in `themes/*.css`.
- [ ] `bin/check-theme` rejects `100vw` widths on `body` and full-width blocks.
- [ ] The rules are reflected in the Lily skills ([agent-skills](../agent-skills/index.md)).

## Related topics

- [stephcraft-lessons](../stephcraft-lessons/index.md) — the review these rules and the planned work come from
- [theme](../theme/index.md) — where responsive CSS lives
- [headless](../headless/index.md) — the zero-CSS boundary
- [accessibility](../accessibility/index.md) — WCAG 1.4.4 and 1.4.10
- [testing](../testing/index.md) — the responsive sweep

## Sources

- [AGENTS/responsive.md](../../AGENTS/responsive.md)
- [WCAG 2.2: Reflow (1.4.10)](https://www.w3.org/TR/WCAG22/#reflow)
- [WCAG 2.2: Resize Text (1.4.4)](https://www.w3.org/TR/WCAG22/#resize-text)

---

Lily™ and Lily Design System™ are trademarks.
