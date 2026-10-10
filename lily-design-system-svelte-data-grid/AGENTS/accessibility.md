# Accessibility design principles rules

## Standards

- **WCAG 2.2 AAA** is the target across every component, every demo page, every framework.
- **WAI-ARIA Authoring Practices 1.2** patterns are the reference for keyboard interaction, roles, states, and properties. When the APG documents a pattern (Combobox, Tabs, Menu, Tree, Slider, Dialog, Listbox), Lily follows it.
- **Semantic HTML first**, ARIA second. Every component picks the most specific HTML element; ARIA augments where native semantics are insufficient.

## Required commitments

- **Keyboard reachability**. Every interactive component is reachable and operable with `Tab`, `Shift+Tab`, `Enter`, `Space`, `Arrow keys`, `Home`, `End`, and `Escape` as appropriate. The keyboard contract is documented in each component's `AGENTS.md`.
- **Visible focus**. Components do not suppress focus rings. Consumer CSS provides the visual style, but the headless component must keep `:focus`, `:focus-visible`, and explicit `tabindex` correct.
- **Accessible name**. Every interactive element has a name visible to assistive technology — either via visible text content, `aria-label`, or `aria-labelledby`. Required `label` props enforce this where text content alone is insufficient (e.g. `IconButton`, `ChatNav`, `Hero`, `TileMap`).
- **No colour-only meaning**. Status, validity, and selection are conveyed through text, icons, ARIA state, or position — never colour alone (WCAG 1.4.1).
- **Live regions are deliberate**. `role="alert"` and `aria-live` are reserved for dynamic content the user must hear. Static labels stay static.
- **Reduced motion**. Animations are an example-layer choice; headless components do not auto-animate. Consumers respect `prefers-reduced-motion` in their CSS.

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

## Testing accessibility

- The framework headless tests assert that the right ARIA attributes appear on the rendered DOM (label, role, expanded, pressed, valuenow, etc.).
- Manual keyboard sweeps — every demo page in the example subprojects must be completable with the keyboard alone.
- Screen-reader smoke tests — VoiceOver (macOS), NVDA (Windows), JAWS (Windows) at minimum on the major composed example pages.
- Colour-contrast spot checks on the example apps — automated via axe / Lighthouse, manual where colour interacts with state.
