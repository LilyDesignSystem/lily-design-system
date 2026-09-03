# Lily Design System™ - Web Components Headless

A headless component library built on **native custom elements** — the browser's own Web Components platform APIs, with no framework runtime. This package ships a **partial catalog**: 30 of the canonical 491 Lily components, chosen to span every major category, proving that the pattern works end to end (real, tested, buildable, Storybook-documented) — not a claim of parity with the other six headless catalogs. See [spec/index.md](spec/index.md) for the full scope statement.

**Headless** means zero CSS, zero styles, zero opinions about appearance. You provide all styling. Components provide structure, semantics, accessibility, and behavior — the same promise as every other Lily headless library, just delivered as `<lily-button>` instead of `<Button>`.

## Features

- 30 headless custom elements (see the full list below), each with a real ARIA/keyboard contract matching its canonical `components/{slug}/AGENTS.md` spec.
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

## Components in this slice

**Buttons and links**: Button, ToggleButton, SwitchButton, IconButton, FloatButton, ClipboardCopyButton, BackLink, ActionLink

**Forms**: TextInput, EmailInput, TelInput, CheckboxGroup, Fieldset

**Overlays**: Dialog, AlertDialog, ContextualHelp, Coachmark

**Media and data**: AvatarImage, Figure, FeaturePhoto, Progress, Meter, BarChart

**Content**: Alert, Banner, Card, Badge, Blockquote, InformationCallout, WarningCallout

## Documentation

- [AGENTS.md](AGENTS.md) — architecture, the two structural patterns, what's deliberately excluded and why.
- [spec/index.md](spec/index.md) — the full scope statement, acceptance criteria, and verification record.
- Each component's canonical contract lives at the repository root: `components/{slug}/index.md`.

---

Lily™ and Lily Design System™ are trademarks.
