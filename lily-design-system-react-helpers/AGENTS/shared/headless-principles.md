# Headless design principles (React adaptation)

This file adapts the cross-framework Lily headless principles
(`../../../AGENTS/headless.md`) to React 19. All helpers in this
catalog follow these rules.

## Goal

Every helper ships unstyled markup, ARIA, focus management, and
keyboard semantics. Consumers ship every visual decision.

## Markup

- Choose the most specific semantic HTML element that fits
  (`<select>`, `<option>`, `<button>`). Reach for `<div>` and
  `<span>` only when no semantic element fits.
- The first attribute on the root element is the kebab-case base
  class plus the consumer's optional `className`. For the current
  catalog this means
  `className={\`theme-select ${className}\`.trim()}` and
  `className={\`locale-select ${className}\`.trim()}`. Consumer
  CSS targets either form with a single selector.
- Inner sub-classes (`theme-select-option`, `locale-select-option`)
  are kebab-case derivatives of the base class. They are stable
  contracts: consumers can rely on them, so don't rename or remove
  them between versions.
- Spread `{...restProps}` onto the root `<select>` so consumers
  can pass `id`, `data-*`, event handlers, and ARIA overrides
  without the helper blocking them.

## Accessibility

- Reach for native semantics first; add ARIA only where a Lily
  spec demands it. `role="button"` on a `<div>` is a smell — use
  `<button>`.
- ARIA attributes that ride along with semantic elements
  (`aria-label`, `aria-pressed`, `aria-expanded`, `aria-current`,
  `aria-live`) are the helper's responsibility. The helper renders
  them based on its props.
- Keyboard interaction patterns (Arrow / Enter / Space / Escape /
  Home / End / Tab) follow the native control's platform behaviour.
  For the current catalog, that's the native `<select>` element,
  which provides the full keyboard contract.
- WCAG 2.2 AAA is the target. Colour contrast and focus-ring
  visibility are the consumer's CSS concern; semantic structure
  and keyboard reachability are the helper's concern.

## Behaviour boundaries

The helpers handle:

- Focus management inside the component (default: none, because
  the native `<select>` already implements the platform pattern).
- Keyboard navigation between own children (default: provided by
  the platform).
- Opening / closing internal state with controlled/uncontrolled
  `value`.
- `IntersectionObserver` / scroll listeners that belong to the
  component (none in the current catalog).

The helpers do NOT handle:

- Data fetching, network state.
- Locale-specific formatting (currency, dates, numbers).
- Persistence beyond `localStorage` and `data-*` attributes.
- Animation choreography.
- Page-level routing.

These belong to the consumer.

## Visual decisions

- **No stylesheets shipped.** The helper directories contain no
  `.css` files.
- **No inline `style` attributes** except where structurally
  required (e.g. `display: contents` on a hypothetical theme
  provider — not used in the current catalog).
- **No bundled fonts, images, or icon assets.**
- **No CSS framework dependencies** (Tailwind, DaisyUI, Bootstrap).
  The base class is the only contract for consumer CSS.

## Data attributes

`data-*` attributes are used for state that the consumer's CSS or
JS may want to observe:

| Attribute                          | On                          | Set by                            |
| ---------------------------------- | --------------------------- | --------------------------------- |
| `data-theme="<slug>"`              | `target` (default `<html>`) | `ThemeSelect`                     |
| `data-lily-theme-select="<name>"`  | the managed `<link>`        | `ThemeSelect` (discriminator)     |

For state that's purely for assistive technology (`aria-pressed`,
`aria-expanded`), use the ARIA attribute, not `data-*`.

## React-specific application

- `"use client"` directive on every helper `.tsx` file that touches
  the DOM. The directive is the first non-comment token.
- Hooks only — no class components, no legacy lifecycle.
- Render-prop `children` (a function) when consumers need to
  override the default markup. The shape is
  `(args: ChildArgs) => React.ReactNode`.
- Controlled + uncontrolled support via the standard React pattern
  (`value` prop optional; internal state when omitted).
- `useEffect` for all DOM access. No `useLayoutEffect` — the SSR
  warning isn't worth the visual jank avoidance for this lifecycle.
- `useRef` for once-only guards (`initialisedRef`) and for
  stable callback identities (rare in the current catalog).

## What "headless" specifically means in this catalog

The selects own the **behaviour** (when to apply, where to write,
how to persist) and the **semantic structure** (a native `<select>`
with `<option>` children). They do not own:

- How the select looks (consumer CSS).
- What labels appear (`label`, `themeLabels`, `localeLabels` props).
- How errors / validation surface (not applicable — selects don't
  validate).
- Where the select sits on the page (consumer layout).
- Whether the select is wrapped in a flyout, drawer, or banner
  (consumer composition).

The split is what makes the helpers framework-portable and
i18n-clean.

## See also

- Repo root `AGENTS/headless.md` — the canonical cross-framework
  principle file.
- [`../accessibility.md`](../accessibility.md) — the React-specific
  accessibility contract.
- [`../conventions.md`](../conventions.md) — React 19 idioms.
