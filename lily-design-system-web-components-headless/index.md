# Lily Design System™ - Web Components Headless

A headless component library built on **native custom elements** — the browser's own Web Components platform APIs, with no framework runtime. This package ships its full achievable scope as of 2026-09-06: **456 of the canonical 491 Lily components** — real, tested, buildable, Storybook-documented. The other 35 are permanently excluded by a real architectural limitation (§2 of the spec), not open backlog. See [spec/index.md](spec/index.md) for the full scope statement.

**Headless** means zero CSS, zero styles, zero opinions about appearance. You provide all styling. Components provide structure, semantics, accessibility, and behavior — the same promise as every other Lily headless library, just delivered as `<lily-button>` instead of `<Button>`.

## Features

- 456 headless custom elements (see the full list below), each with a real ARIA/keyboard contract matching its canonical `components/{slug}/AGENTS.md` spec.
- Works in any framework, or none — a native custom element is valid markup anywhere HTML is valid.
- TypeScript source with full type definitions.
- WCAG 2.2 AAA target: semantic HTML first, ARIA only where needed.
- Zero runtime dependencies.
- Light DOM (no shadow root) — your CSS selectors reach every element, exactly like the other six catalogs.

## Quick Start

### Install

```bash
pnpm install lily-design-system-web-components-headless
```

### Basic usage

```html
<script type="module">
  import "lily-design-system-web-components-headless";
</script>

<lily-text-input label="Your name"></lily-text-input>
<lily-button label="Greet">Greet</lily-button>
<lily-alert type="success" heading="Greeting" hidden>
  Welcome!
</lily-alert>

<script type="module">
  const input = document.querySelector("lily-text-input");
  const button = document.querySelector("lily-button");
  const alert = document.querySelector("lily-alert");

  button.querySelector("button").addEventListener("click", () => {
    alert.hidden = false;
    alert.textContent = `Welcome, ${input.value}!`;
  });
</script>
```

Every component's real semantic element (the `<button>`, `<input>`, `<dialog>`, …) is a genuine light-DOM child, so `querySelector`, event delegation, and form participation all work exactly as they would on hand-written HTML.

## Components in this catalog

456 of the 491 canonical components, spanning every major category:
buttons and links, forms, pickers, overlays, media and data
visualisation, content, navigation (including the `*Nav`/`*List`/
`*ListItem` families via the "upgrade in place" pattern — see
`spec/index.md` §2.1), and all 92 national personal identifier
components. The full list is every `.ts` file directly under
`components/` (excluding `.test.ts`/`.stories.ts`) — list them with
`ls components/*.ts | grep -v -e .test.ts -e .stories.ts`, or read
`components.tsv` at the monorepo root and diff against this catalog's
own file list to see exactly which 35 are the permanent exclusions.

## Documentation

- [AGENTS.md](AGENTS.md) — architecture, the two structural patterns, what's deliberately excluded and why.
- [spec/index.md](spec/index.md) — the full scope statement, acceptance criteria, and verification record.
- Each component's canonical contract lives at the repository root: `components/{slug}/index.md`.

---

Lily™ and Lily Design System™ are trademarks.
