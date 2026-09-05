---
name: lily-design-system-react-helpers-skill
description: Explains how to install and use Lily Design System's React *-picker helper packages — theme-picker, locale-picker, text-size-picker, motion-picker, share-picker, and date-time-picker — their icon-button-plus-listbox / disclosure-of-links / field-plus-dialog shapes, npm package names, and the idempotent-apply guard React consumers need to know about. Use when someone asks how to install or use Lily Design System's React theme/locale/text-size/motion/share/date-time picker, wants the React-specific helper idiom (controlled value/onChange, render-prop children, SSR/"use client" boundaries), or hits a re-entrant apply / infinite-loop bug wiring a picker's onChange back into its own value.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Lily Design System™ — React helpers

The React `*-picker` catalog ships six small, opinionated React 19
packages that sit alongside the headless
`lily-design-system-react-headless` library. Where a headless
component is a pure markup primitive, a helper owns one whole
interaction end to end — selection, DOM application, and (for most of
them) optional persistence. Each is its own npm package:

| Package                                          | Owns                                                                      |
| ------------------------------------------------- | -------------------------------------------------------------------------- |
| `lily-design-system-react-theme-picker`          | A visual theme: swaps a managed `<link>` stylesheet and sets `data-theme` on the document root; pairs with the root `themes/` stylesheets. |
| `lily-design-system-react-locale-picker`         | A BCP 47 locale: sets `lang` and `dir` (auto-detected per script) on the document root. No translation. |
| `lily-design-system-react-text-size-picker`      | A text-size preference: sets `data-text-size` on the document root.       |
| `lily-design-system-react-motion-picker`         | A reduced-motion preference: sets `data-motion` on the document root. Its initial value defers to the OS's own `(prefers-reduced-motion: reduce)` media query **unconditionally**, not behind an opt-in flag — the one behavioural difference from the three preference siblings above. |
| `lily-design-system-react-share-picker`          | An *action*, not a preference: opens the native share sheet where available, else a disclosure list of consumer-supplied destinations plus copy-to-clipboard. Applies nothing, persists nothing. |
| `lily-design-system-react-date-time-picker`      | A *form value*, not a preference: a typeable text field paired with a trigger that opens an APG date-picker dialog. Applies nothing, persists nothing. |

```bash
pnpm install lily-design-system-react-theme-picker
```

(each helper installs the same way, under its own package name.)

## The three root shapes

- **Icon button + APG listbox (`theme-picker`, `locale-picker`,
  `text-size-picker`, `motion-picker`).** Root `<div class="{helper}
  {className}">` wrapping a hidden input (form participation), a
  `<button class="{helper}-button" aria-haspopup="listbox"
  aria-expanded aria-controls>` whose only content is an
  `aria-hidden` glyph span, and a `<ul class="{helper}-list"
  role="listbox" hidden>` of `<li role="option">`. Keyboard follows
  the WAI-ARIA APG listbox pattern. A single glyph keeps a
  page-header control's footprint small: ◑ for theme, 🌐 for locale,
  "A" for text-size, ⏸ for motion — each wrapped `aria-hidden`, with
  the accessible name coming from the button's `aria-label`.
- **Disclosure of real links (`share-picker`).** Its destinations are
  navigation, so they render as real `<a>` elements (not
  `role="menuitem"`, which would strip middle-click and
  open-in-new-tab), plus a real `<button>` for copy-to-clipboard and a
  `{helper}-status` live region for the copy outcome. `share-picker`
  ships no bundled social-network endpoints — the consumer passes
  `targets`, each with its own `href(url, title, text)`.
- **Field + trigger + dialog (`date-time-picker`).** The one helper
  that is a form control, not a page-header control: a typeable text
  field paired with a trigger (📅 glyph) that opens an APG date-picker
  dialog. It is exempt from the "one glyph" page-header rule because a
  date field that can't be typed into is hostile to anyone who already
  knows the date. It takes one `labels` object rather than a dozen
  flat `*Label` props, and its six structural labels are required with
  no English default.

Full contract for all six: root `AGENTS/helpers.md`.

## React-specific consumption idiom

- **React 19 function components**, TypeScript, hooks only
  (`useState`, `useEffect`, `useRef`) — no class components, no legacy
  lifecycle methods.
- **Controlled or uncontrolled.** Every helper accepts a controlled
  `value` + `onChange` pair, or runs internally with its own
  `useState` if you don't pass `value`.
- **Render-prop `children` replaces the glyph, not the options.** When
  you need to override the default icon markup, pass a `children`
  function receiving the helper's `ChildArgs` — it swaps the glyph
  span, the listbox/disclosure structure stays the component's.
- **Rest-props spread onto the root `<div>`**, same convention as the
  headless library: `id`, `data-*`, event handlers, and ARIA overrides
  all pass through untouched.
- **SSR boundary is React's `"use client"` directive.** Any helper
  component that touches the DOM carries it, so the package compiles
  cleanly under Next.js App Router server components, Remix, and Vite
  SSR. DOM writes only ever happen inside `useEffect`, never during
  render.
- **Cookie-based persistence (if you want it to survive SSR)** means
  reading the cookie in a server component and piping the value into
  the client component as its controlled `value` — there's no
  framework-level equivalent to SvelteKit's `hooks.server.ts`
  transform here; you own that plumbing.

## The idempotent-apply guard — why it matters in React specifically

Every preference helper's apply step is a no-op once a value is
already applied: no DOM write, no `localStorage` write, no change
callback fires twice for the same value. This matters more in React
than it sounds, because **React applies a controlled value once when
you set it, and again when your own `onChange` handler writes it back
into the state you passed as `value`** — two applies for one logical
change. Without the guard, a naive `onChange` that does `setValue(v)`
re-triggers a second internal application on the next render, and if
your handler does anything besides a plain state write (e.g. also
calls another `onChange`-driven callback), you can build a real
re-entrant loop. The Svelte reference implementation hit exactly this
class of bug badly enough to freeze a listbox mid-open with a stale
`aria-expanded="true"`; the fix — applying being idempotent — is
already built into every React helper here, so a normal `value` +
`onChange` wiring is safe. See `AGENTS/helpers.md`'s "Applying is
idempotent" rule for the full cross-framework rationale.

## When NOT this skill

- For the headless component library itself — the 491-component
  catalog, JSX usage, `className`, controlled-prop patterns for
  ordinary components — use `lily-design-system-react-headless-skill`
  instead.
- For framework-agnostic Lily concepts (what a helper is versus a
  catalog component, the glyph conventions, the general picker
  contract) use `lily-design-system-skill` instead — it doesn't
  restate React specifics, and this skill doesn't restate its general
  concepts.
