# Accessibility

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Lily™ targets WCAG 2.2 AAA and follows WAI-ARIA Authoring Practices 1.2, with semantic HTML first and ARIA second, verified by axe-core via Playwright across all seven example apps.

## Scope

This topic covers the accessibility contract: standards (WCAG 2.2 AAA target, WAI-ARIA APG 1.2), the required commitments (keyboard reachability, visible focus, accessible name, no colour-only meaning, deliberate live regions, reduced motion), the common ARIA patterns reference table, and the testing approach with its axe-core baseline.

It does **not** cover: the headless markup and behaviour-boundary rules (see [headless](../headless/index.md)), example-app styling and routes (see [examples](../examples/index.md)), the full test tooling and runner setup (see [testing](../testing/index.md)), or per-component keyboard contracts (those live in each `components/{slug}/AGENTS.md`).

## Principles and rules

- **WCAG 2.2 AAA** is the target across every component, every demo page, every framework.
- **WAI-ARIA Authoring Practices 1.2** patterns are the reference for keyboard interaction, roles, states, and properties. When the APG documents a pattern (Combobox, Tabs, Menu, Tree, Slider, Dialog, Listbox), Lily follows it.
- **Semantic HTML first, ARIA second.** Every component picks the most specific HTML element; ARIA augments where native semantics are insufficient.
- **Keyboard reachability.** Every interactive component is reachable and operable with `Tab`, `Shift+Tab`, `Enter`, `Space`, `Arrow keys`, `Home`, `End`, and `Escape` as appropriate. The keyboard contract is documented in each component's `AGENTS.md`.
- **Visible focus.** Components do not suppress focus rings. Consumer CSS provides the visual style, but the headless component keeps `:focus`, `:focus-visible`, and explicit `tabindex` correct.
- **Accessible name.** Every interactive element has a name visible to assistive technology — via visible text content, `aria-label`, or `aria-labelledby`. Required `label` props enforce this where text alone is insufficient (e.g. `IconButton`, `ChatNav`, `Hero`, `TileMap`).
- **No colour-only meaning.** Status, validity, and selection are conveyed through text, icons, ARIA state, or position — never colour alone (WCAG 1.4.1).
- **Live regions are deliberate.** `role="alert"` and `aria-live` are reserved for dynamic content the user must hear; static labels stay static.
- **Focus not obscured (WCAG 2.2 SC 2.4.11).** A focused control is never entirely hidden by author-created content such as a fixed or sticky bar. Whatever fixes a bar to the viewport (`sticky-promo-banner`, a theme's or app's own fixed header, a bottom navigation) sets `--lily-fixed-bar-block-start` / `--lily-fixed-bar-block-end` on the root to the bar's height. The shared "Focus not obscured" section, appended to all 63 themes and pinned by `bin/check-theme`, turns them into `:where(html) { scroll-padding-block: … }` (zero specificity, `0px` defaults), so the browser scrolls a focused control clear of the bar (the page also needs end padding equal to a bottom bar, since scroll-padding cannot scroll past the document end). Each example app's `e2e/focus-obscured.spec.ts` injects a fixed bottom bar, sets the property, tabs to the last focusable element and asserts its bounding box ends above the bar.
- **Reduced motion.** Headless components do not auto-animate; consumers respect `prefers-reduced-motion` in their CSS.

## Common ARIA patterns

| Pattern                                                         | When to use                                                                                                       |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `<label for="id">`                                              | Form input labelling. Pair with `id` on the input.                                                                |
| `aria-label`                                                    | Accessible name when no visible label is appropriate (icon-only buttons, region wrappers).                        |
| `aria-labelledby` / `aria-describedby`                          | Link a control to a separate text node — heading, helptext, error message.                                        |
| `aria-invalid` + `aria-errormessage`                            | Form input error state — pair with the message id.                                                                |
| `role="alert"` / `aria-live="polite"` / `aria-live="assertive"` | Announce dynamic content; pick `polite` by default, `assertive` only for `SuperBanner` and similar interruptions. |
| `role="group"` with `aria-label`                                | Group of related controls (`DialGroup`, `Diff`, `PhotoPack`).                                                     |
| `role="region"` with `aria-label`                               | Labelled landmark for a part of the page (`AnnouncementBanner`, `HorizontalScroller`).                            |
| `role="status"`                                                 | Polite live region for indeterminate background activity (`Loading`).                                             |
| Roving tabindex (`tabindex="0"` / `tabindex="-1"`)              | Grid / listbox / toolbar navigation — only the active item is tabbable.                                           |
| `aria-pressed`                                                  | Toggle button on/off state.                                                                                       |
| `aria-expanded`                                                 | Disclosure / accordion / combobox open state.                                                                     |
| `aria-current`                                                  | Current page / step / location inside a nav, list, or breadcrumb.                                                 |
| `aria-modal="true"`                                             | Modal `<dialog>` (also use the `dialog.showModal()` API, not just `open`).                                        |
| `aria-roledescription="..."`                                    | Override the auto-announced role name for specialised widgets (`TileMap`, `ScrollerVideo`).                       |
| `aria-valuenow` / `aria-valuemin` / `aria-valuemax`             | Slider / progress / dial position.                                                                                |

## Testing approach

- Framework headless tests assert that the right ARIA attributes appear on the rendered DOM (label, role, expanded, pressed, valuenow, etc.).
- Manual keyboard sweeps — every demo page in the example subprojects must be completable with the keyboard alone.
- Screen-reader smoke tests — VoiceOver (macOS), NVDA (Windows), JAWS (Windows) at minimum on the major composed example pages.
- Colour-contrast spot checks on the example apps — automated via axe / Lighthouse, manual where colour interacts with state.

### Docs-site sweep (2026-10-06)

A full axe sweep of the docs site — home, catalog, tutorials, accessibility and all 571 component pages, 575 pages,
WCAG 2.0–2.2 A/AA tags, run against the built site with the default theme loaded — reports 0 violations. The sweep
found two real defects, both fixed: error text in 26 of the 45 themes failed contrast (see [theme](../theme/index.md)),
and overflowing hand-written `<pre>` blocks were not keyboard-focusable (`scrollable-region-focusable`). When running
axe against a page whose theme stylesheet loads at runtime, wait for the managed `<link data-lily-theme-picker>` and
let button transitions settle, or axe samples mid-transition colours.

### axe-core baseline (Playwright, spec §11.5)

axe-core / Playwright integration ships across all seven example apps. Rule set: **WCAG 2.0 A+AA, 2.1 A+AA, 2.2 AA**. Per-app baseline (axe-clean routes / total checked), re-verified 2026-09-02 (plan P1-T6), and since 2026-10-29 run in Chromium, Firefox and WebKit (P18-T1) — see [testing](../testing/index.md) for the authoritative, live-maintained table:

| App                        | Clean | Status                                                                                      |
| -------------------------- | ----- | ------------------------------------------------------------------------------------------- |
| svelte-sveltekit-examples  | 31/31 | ✅ full pass (plus a separate full-catalog sweep, 582 pages in three engines on 2026-10-29) |
| react-next-examples        | 31/31 | ✅ full pass                                                                                |
| vue-nuxt-examples          | 31/31 | ✅ full pass                                                                                |
| blazor-web-examples        | 31/31 | ✅ full pass                                                                                |
| html-css-js-examples       | 29/29 | ✅ full pass                                                                                |
| nunjucks-eleventy-examples | 31/31 | ✅ full pass                                                                                |
| angular-examples           | 31/31 | ✅ full pass                                                                                |

## Acceptance criteria

- [x] Every interactive component's keyboard contract is documented in `components/{slug}/AGENTS.md`.
- [ ] Every documented keyboard contract is proved by a test in every library: of the 65 components whose Keyboard section names an APG key, 260 library-component pairs have no key test (`bin/check-coverage` keys column; P12-T5a).
- [ ] The screen-reader matrix (`docs/screen-reader-matrix.md`) has results: 0 of 120 cells filled on 2026-10-30, so Lily Core has no members (`bin/generate-core`; P16-T9).
- [x] Every interactive element has an accessible name via visible text, `aria-label`, or `aria-labelledby`.
- [x] No component suppresses focus rings; `:focus`, `:focus-visible`, and `tabindex` are correct.
- [x] No status, validity, or selection is conveyed by colour alone (WCAG 1.4.1).
- [x] Live regions (`role="alert"`, `aria-live`) are used only for dynamic content the user must hear.
- [x] A fixed or sticky bar never covers the focused control (WCAG 2.4.11): the pinned "Focus not obscured" theme section plus a per-app Playwright case.
- [x] Headless components do not auto-animate; reduced-motion is the consumer's CSS concern.
- [x] axe-core (WCAG 2.0/2.1/2.2 A+AA) passes its full route baseline on all seven example apps: 31/31 for six of them, 29/29 for html-css-js-examples (spec §11.5, re-verified 2026-09-02 plan P1-T6 — see [testing](../testing/index.md) for the live table). This item was stale, not false: it named "six" apps and cited 2026-08-26-era counts (29/29 × 5, 17/17 × 1) from before angular-examples landed and nunjucks-eleventy-examples grew from 17 to 31 routes.

## Related topics

- [headless](../headless/index.md) — semantic-HTML-first markup the accessibility contract builds on
- [components](../components/index.md) — per-component ARIA, roles, and keyboard contracts
- [examples](../examples/index.md) — skip-link, landmarks, and keyboard-completable demo flows
- [testing](../testing/index.md) — Playwright, axe-core, and per-framework test suites
- [internationalization](../internationalization/index.md) — consumer-supplied labels that double as accessible names

## Sources

- [AGENTS/accessibility.md](../../AGENTS/accessibility.md)
- [AGENTS/headless.md](../../AGENTS/headless.md)
- [spec/index.md](../index.md) §4.2 (Accessibility), §11.5 (axe-core audit)

---

Lily™ and Lily Design System™ are trademarks.
