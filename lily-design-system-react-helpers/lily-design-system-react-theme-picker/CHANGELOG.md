# CHANGELOG — lily-design-system-react-theme-picker

## [0.1.0] — 2026-06-05

### Added

- Initial implementation of `ThemePicker` for React 19.
- `ThemePicker.tsx` — function component with hooks
  (`useState`, `useEffect`, `useRef`). Carries the `"use client"`
  directive.
- `ThemePicker.test.tsx` — vitest spec with one assertion per
  acceptance criterion in `spec.md §7` (criteria 1–13).
- `index.ts` — barrel re-export of `ThemePicker`, `normalizeThemesUrl`,
  `themeHref`, `Props`, `ChildArgs`, and the default export.
- `spec.md` — canonical specification mirroring the Svelte
  counterpart's contract; spec version 0.1.0.
- `index.md` — comprehensive user guide with table of contents,
  quick start, props, custom rendering, persistence, accessibility,
  SSR, preloading, multiple-pickers, recipes, troubleshooting.
- `AGENTS.md` — AI-coding entrypoint.
- `AGENTS/` — five topic files for AI agents:
  `api.md`, `lifecycle.md`, `accessibility.md`, `testing.md`,
  `ssr.md`.
- `docs/` — eight topic guides for humans:
  `props-reference.md`, `accessibility.md`, `styling.md`, `ssr.md`,
  `preloading.md`, `custom-rendering.md`, `recipes.md`,
  `troubleshooting.md`, plus a `README.md` index.
- `examples/` — ten runnable examples plus a `README.md` index:
  `basic.tsx`, `two-way-binding.tsx`, `persistence.tsx`,
  `custom-labels.tsx`, `custom-rendering.tsx`, `preloaded.tsx`,
  `multiple-pickers.tsx`, `system-preference.tsx`, `lily-themes.tsx`,
  `next-cookie/` (Next.js App Router cookie SSR recipe).

### Parity with Svelte counterpart

This helper mirrors
`lily-design-system-svelte-helpers/lily-design-system-svelte-theme-picker`:

- Same `<fieldset role="radiogroup">` DOM contract.
- Same `data-theme` attribute target.
- Same managed `<link data-lily-theme-picker="…">` discriminator.
- Same `themeHref` URL construction.
- Same initial-value resolution order (`value` > storage >
  `defaultValue` > `"light"` > `themes[0]`).
- Same `localStorage` try/catch persistence with silent error
  swallowing.
- Same `onChange(slug)` callback firing after every apply.
- Same `ChildArgs` shape passed to the render prop.

### Differences from the Svelte counterpart

- `value` is a controlled prop, not a `$bindable()` two-way binding.
  Consumer pairs `value` + `onChange` (or omits both for uncontrolled
  mode).
- `children` is a render prop function, not a `Snippet`.
- `className` not `class`.
- The picker carries `"use client"` for the React Server Components
  boundary.
- SSR recipe uses Next.js App Router `cookies()` + a client component
  wrapper, not SvelteKit's `transformPageChunk`.

### Tracking

- Package directory:
  `lily-design-system-react-helpers/lily-design-system-react-theme-picker/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
