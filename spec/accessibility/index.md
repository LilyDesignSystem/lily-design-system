# Accessibility

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Lily™ targets WCAG 2.2 AAA and follows WAI-ARIA Authoring Practices 1.2, with semantic HTML first and ARIA second, verified by axe-core via Playwright across all six example apps.

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
- **Reduced motion.** Headless components do not auto-animate; consumers respect `prefers-reduced-motion` in their CSS.

## Common ARIA patterns

| Pattern | When to use |
|---|---|
| `<label for="id">` | Form input labelling. Pair with `id` on the input. |
| `aria-label` | Accessible name when no visible label is appropriate (icon-only buttons, region wrappers). |
| `aria-labelledby` / `aria-describedby` | Link a control to a separate text node — heading, helptext, error message. |
| `aria-invalid` + `aria-errormessage` | Form input error state — pair with the message id. |
| `role="alert"` / `aria-live="polite"` / `aria-live="assertive"` | Announce dynamic content; pick `polite` by default, `assertive` only for `SuperBanner` and similar interruptions. |
| `role="group"` with `aria-label` | Group of related controls (`DialGroup`, `Diff`, `PhotoPack`). |
| `role="region"` with `aria-label` | Labelled landmark for a part of the page (`AnnouncementBanner`, `HorizontalScroller`). |
| `role="status"` | Polite live region for indeterminate background activity (`Loading`). |
| Roving tabindex (`tabindex="0"` / `tabindex="-1"`) | Grid / listbox / toolbar navigation — only the active item is tabbable. |
| `aria-pressed` | Toggle button on/off state. |
| `aria-expanded` | Disclosure / accordion / combobox open state. |
| `aria-current` | Current page / step / location inside a nav, list, or breadcrumb. |
| `aria-modal="true"` | Modal `<dialog>` (also use the `dialog.showModal()` API, not just `open`). |
| `aria-roledescription="..."` | Override the auto-announced role name for specialised widgets (`TileMap`, `ScrollerVideo`). |
| `aria-valuenow` / `aria-valuemin` / `aria-valuemax` | Slider / progress / dial position. |

## Testing approach

- Framework headless tests assert that the right ARIA attributes appear on the rendered DOM (label, role, expanded, pressed, valuenow, etc.).
- Manual keyboard sweeps — every demo page in the example subprojects must be completable with the keyboard alone.
- Screen-reader smoke tests — VoiceOver (macOS), NVDA (Windows), JAWS (Windows) at minimum on the major composed example pages.
- Colour-contrast spot checks on the example apps — automated via axe / Lighthouse, manual where colour interacts with state.

### axe-core baseline (Playwright, spec §11.5)

axe-core / Playwright integration ships across all six example apps. Rule set: **WCAG 2.0 A+AA, 2.1 A+AA, 2.2 AA**. Per-app baseline (axe-clean routes / total checked):

| App                            | Clean  | Status        |
| ------------------------------ | ------ | ------------- |
| svelte-sveltekit-examples      | 29/29  | ✅ full pass  |
| react-next-examples            | 29/29  | ✅ full pass  |
| vue-nuxt-examples              | 29/29  | ✅ full pass  |
| blazor-web-examples            | 29/29  | ✅ full pass  |
| html-css-js-examples           | 29/29  | ✅ full pass  |
| nunjucks-eleventy-examples     | 17/17  | ✅ full pass  |

## Acceptance criteria

- [ ] Every interactive component is reachable and operable via `Tab`, `Shift+Tab`, `Enter`, `Space`, arrow keys, `Home`, `End`, and `Escape` as appropriate, with the contract documented in `components/{slug}/AGENTS.md`.
- [ ] Every interactive element has an accessible name via visible text, `aria-label`, or `aria-labelledby`.
- [ ] No component suppresses focus rings; `:focus`, `:focus-visible`, and `tabindex` are correct.
- [ ] No status, validity, or selection is conveyed by colour alone (WCAG 1.4.1).
- [ ] Live regions (`role="alert"`, `aria-live`) are used only for dynamic content the user must hear.
- [ ] Headless components do not auto-animate; reduced-motion is the consumer's CSS concern.
- [ ] axe-core (WCAG 2.0/2.1/2.2 A+AA) passes its full route baseline on all six example apps: 29/29 for the five SPA/SSR apps and 17/17 for nunjucks-eleventy (spec §11.5).

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
