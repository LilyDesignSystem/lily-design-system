# Examples

Self-contained React 19 examples for
`lily-design-system-react-locale-chooser`. Each file is a runnable
component that can be dropped into any React 19 host (Next.js App
Router page, Vite + React route, Remix route, Astro `.tsx` island,
Storybook story).

Every example assumes:

- The consumer file carries `"use client"` if it manages controlled
  state (every file in this directory does).
- The host page allows the select to write to `document.documentElement`
  (the default). Examples that target a panel ref instead pass an
  explicit `target` prop.

## Index

| File                                                   | Demonstrates                                                          |
| ------------------------------------------------------ | --------------------------------------------------------------------- |
| [`basic.tsx`](./basic.tsx)                             | Default globe-button rendering with controlled `value` + `onChange`, plus the default status line. |
| [`custom-rendering.tsx`](./custom-rendering.tsx)       | `children` glyph override: active short code + open/closed chevron.   |
| [`compact-glyph.tsx`](./compact-glyph.tsx)             | `children` glyph override: compact short codes / script characters.   |
| [`rtl-demo.tsx`](./rtl-demo.tsx)                       | RTL locales (ar, he, fa, ur, ps) showing `dir` flipping.               |
| [`nhs-style.tsx`](./nhs-style.tsx)                     | NHS-style banner; `children` pairs the globe with the active endonym.  |
| [`with-react-intl.tsx`](./with-react-intl.tsx)         | Wired through `react-intl`'s `IntlProvider`.                          |
| [`with-react-i18next.tsx`](./with-react-i18next.tsx)   | Wired through `react-i18next`'s `useTranslation` hook.                |
| [`ssr-cookie.tsx`](./ssr-cookie.tsx)                   | Next.js App Router pattern with cookie-resolved initial locale.       |
| [`scoped-target.tsx`](./scoped-target.tsx)             | `target` prop pointing at a panel ref instead of `<html>`.            |
| [`all-locales.tsx`](./all-locales.tsx)                 | All 436 locales, navigated with the built-in listbox typeahead.       |

`custom-rendering`, `compact-glyph`, `nhs-style`, and `all-locales` are
built around the `children` glyph override. In every one, `children`
replaces the globe **inside the button** and receives
`{ value, open, labelFor }` — it does not render the options, which the
component owns along with the whole keyboard contract. Each marks its
glyph content `aria-hidden="true"`, because the button is already named
by the `label` prop.

## Running the examples

These files are illustrations, not a build. The fastest way to try one:

1. Inside any Next.js / Vite + React project, drop the example into a
   page / route file.
2. Make sure `"use client"` is at the top of the file (it already is
   in each example).
3. `pnpm dev` and visit the route.

`with-react-intl` and `with-react-i18next` mock the i18n libraries with
tiny inline stand-ins so they compile without their dependencies
installed. In your real app, replace the stand-ins with the real
imports — the select wiring stays the same.

`ssr-cookie` is split: the client portion (`LocaleClient`) is the
exported component, and the companion server component (`app/layout.tsx`)
is shown in a block comment at the bottom of the file. Paste both into
the right places in your Next.js project.

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
- **with-react-intl** / **with-react-i18next** — externalised i18n state
  wiring.
- **ssr-cookie** — SSR + cookie + server/client component boundary.
- **scoped-target** — `target` prop, multiple instances with distinct
  `name`.
- **all-locales** — long lists navigated by the built-in APG typeahead.

If a future change breaks any of these patterns, the example file
breaks too — they're the canonical reference.
