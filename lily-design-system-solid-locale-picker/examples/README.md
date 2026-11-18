# Examples

Self-contained Solid 2.0 examples for `@lilydesignsystem/solid-locale-picker`. Each file is a runnable component that can be dropped into any Solid 2.0 app (a Vite + Solid route, an Astro Solid island).

Every example assumes:

## Index

| File                                             | Demonstrates                                                                                       |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| [`basic.tsx`](./basic.tsx)                       | Default globe-button rendering with controlled `value` + `onChange`, plus the default status line. |
| [`custom-rendering.tsx`](./custom-rendering.tsx) | `children` glyph override: active short code + open/closed chevron.                                |
| [`compact-glyph.tsx`](./compact-glyph.tsx)       | `children` glyph override: compact short codes / script characters.                                |
| [`rtl-demo.tsx`](./rtl-demo.tsx)                 | RTL locales (ar, he, fa, ur, ps) showing `dir` flipping.                                           |
| [`nhs-style.tsx`](./nhs-style.tsx)               | NHS-style banner; `children` pairs the globe with the active endonym.                              |
| [`scoped-target.tsx`](./scoped-target.tsx)       | `target` prop pointing at a panel ref instead of `<html>`.                                         |
| [`all-locales.tsx`](./all-locales.tsx)           | All 436 locales, navigated with the built-in listbox typeahead.                                    |

`custom-rendering`, `compact-glyph`, `nhs-style`, and `all-locales` are
built around the `children` glyph override. In every one, `children`
replaces the globe **inside the button** and receives
`{ value, open, labelFor }` — it does not render the options, which the
component owns along with the whole keyboard contract. Each marks its
glyph content `aria-hidden="true"`, because the button is already named
by the `label` prop.

## Running the examples

These files are illustrations, not a build. The fastest way to try one:

1. Inside any Vite + Solid project, drop the example into a route.
2. `pnpm dev` and visit the route.

Server rendering with a cookie, so the page arrives in the right locale: [../AGENTS/ssr.md](../AGENTS/ssr.md).

## What each example tests

The examples double as a hand-driven test plan:

- **basic** — `value` + `onChange` round-trip, default labels from
  `defaultLocaleLabels`, default globe-button rendering, status line.
- **custom-rendering** — `children` receives `{ value, open, labelFor }`;
  `open` drives the chevron; `storageKey` + `detectFromNavigator`.
- **compact-glyph** — compact glyph override with `localeLabels`-style
  short codes, including non-Latin script characters.
- **rtl-demo** — `isRtlLocale` predicate and `bcp47LocaleTag` exported
  helpers; reactive `dir` switching.
- **nhs-style** — `className` prop and class hooks for styled layers;
  `GLOBE_WITH_MERIDIANS` re-used explicitly alongside the endonym.
- **scoped-target** — `target` prop, multiple instances with distinct
  `name`.
- **all-locales** — long lists navigated by the built-in APG typeahead.

If a future change breaks any of these patterns, the example file
breaks too — they're the canonical reference.
