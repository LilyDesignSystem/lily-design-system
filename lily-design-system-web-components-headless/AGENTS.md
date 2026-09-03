# Lily Design System - Web Components Headless

A headless component library built on **native custom elements** (the Web Components platform APIs) rather than a JavaScript framework. **Partial catalog**: 30 of the canonical 491 components, spanning every major category, proving the pattern rather than completing the full catalog — see `spec/index.md` for the honest scope statement and the full list of what is and isn't implemented.

@AGENTS/lily.md
@AGENTS/components.md
@AGENTS/accessibility.md
@AGENTS/internationalization.md
@AGENTS/headless.md
@AGENTS/theme.md
@AGENTS/nhs-uk-design-system-references.md

## Quick Reference

- **Package**: lily-design-system-web-components-headless
- **Version**: 0.1.0
- **Created**: 2026-09-02
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## IMPORTANT Architecture

- Plain TypeScript classes extending `HTMLElement` — no framework, no JSX, no build-time template compiler.
- **Autonomous custom elements only** (`class X extends HTMLElement`, `customElements.define("lily-{slug}", X)`), never customized built-ins (`is="..."`, `{extends: "button"}"`) — WebKit/Safari has never implemented the customized-built-in-elements half of the spec and has stated it will not, so that path is permanently cross-browser-incompatible. See `spec/index.md` for the tradeoff this accepts (every component introduces one extra DOM host node around its real semantic element).
- **Light DOM only** — no shadow root. Consumer CSS must be able to select into every component the same way it does in the other six headless catalogs; light DOM also lets `document.getElementById` / `aria-labelledby` / `aria-describedby` cross component boundaries, which a closed or even open shadow root complicates.
- Each component: `{slug}.ts` + `{slug}.test.ts` + `{slug}.stories.ts`, flat in `components/`.
- Shared DOM helpers in `lib/dom-utils.ts` (`moveChildrenInto`, `rootClassName`, `applySelfClassName`, `passThroughAttributes`, `hasBooleanAttr`, `nextId`).
- `build.mjs` auto-discovers every `components/*.ts`, generates `index.ts` (a barrel that both re-exports each class and self-registers its custom element tag), then bundles with tsup.

## STRICT Prohibitions

- **No shadow DOM** — see Architecture above.
- **No customized built-in elements** (`is="..."`) — permanently unsupported in Safari.
- **No CSS/styles** — no Tailwind, no styled-components, no inline styles beyond the one documented structural exception (`FloatButton`'s `position: fixed`, matching `ThemeProvider`'s `display: contents` precedent elsewhere in the catalog).
- **No images, icons, or fonts** — consumers provide these.
- **No hardcoded user-facing strings** — all text through attributes.
- **No framework runtime dependency** (React, Vue, Svelte, lit, …) in `components/` or `lib/` — only the platform. (The Storybook *story* layer is dev-only and not part of what ships.)

## Two structural patterns

Both patterns appear across the 30 components, chosen per the canonical `components/{slug}/AGENTS.md` contract for the component's designated HTML tag:

1. **Wrap a real native element** (`Button`, `TextInput`, `Dialog`, `Figure`, most of the catalog): the custom element's `connectedCallback` creates the real semantic child (`<button>`, `<input>`, `<dialog>`, …), moves the host's original light-DOM children into it, and appends it. The host element itself carries no ARIA/role — it is inert scaffolding around the one node that matters.
2. **Self-is-the-wrapper** (`Alert`, `Banner`, `ContextualHelp`, `Coachmark`) — used only where the canonical contract's own root element is `<div>` and there is no native element with useful built-in behaviour to defer to. The custom element instance itself carries the base class (via `applySelfClassName`) and the ARIA role/state directly, avoiding an otherwise-pointless extra wrapper `<div>` inside another `<div>`.

Pattern 1 is preferred whenever the canonical root is a real semantic element; pattern 2 is the deliberate exception, not a second default.

## Deliberately excluded from this slice

- Every `*ListItem` and table sub-element family (`*TableHead/-Body/-Foot/-Row/-TH/-TD`, gantt's `-Thead/-Tbody/-Tfoot/-Tr/-Th/-Td`). These require a native tag+attribute-selector-style registration (`li[lily-x-list-item]`) to avoid introducing a wrapper element between a parent and child with a required content-model relationship (`<ol>`+`<li>`, `<table>`+`<thead>`) — exactly the defect class angular-headless fixed in its 0.3.0 wrapper-host-semantics migration (see root `spec/index.md` §11.8). Autonomous custom elements cannot use that tag+attribute selector form at all (only customized built-ins can, and those are the permanently-unsupported path above), so this whole family needs its own, different solution before it can be added honestly. Out of scope for this slice; a real gap, not an oversight.
- The 92 national personal identifier components, and the vast majority of the remaining catalog — this is a 30-of-491 representative slice, not a parity implementation. See `spec/index.md` for the full accounting.

## Testing

- `vitest` + `jsdom`. Each component's `.test.ts` renders via `document.body.innerHTML = "<lily-x ...>...</lily-x>"` (parser-driven upgrade) rather than constructing and appending programmatically, matching how a real consumer's markup activates the element.
- `index.test.ts` at the package root imports the **built** `dist/index.js` (not source) and asserts every one of the 30 tags self-registers — the same class of check that would have caught react-headless's historical missing-entry-point defect.
- Run: `pnpm test` (source-level, fast) and `pnpm build && pnpm test` (adds the dist-level smoke test).

## Component Patterns

### File Naming

```
{slug}.ts          # Implementation (class {PascalCase} extends HTMLElement)
{slug}.test.ts      # Tests
{slug}.stories.ts   # Storybook story
```

### Root Class Hook

Every component's real semantic element carries the kebab-case base class plus the consumer's `class` attribute (`rootClassName` / `applySelfClassName` in `lib/dom-utils.ts`):

```ts
button.className = rootClassName(this, "button"); // "button my-extra-class"
```

### Attribute Pass-Through

`passThroughAttributes(host, target, handled)` copies every attribute the component doesn't itself interpret onto the generated element — the rest-props-spread equivalent for a framework with no such concept built in.
