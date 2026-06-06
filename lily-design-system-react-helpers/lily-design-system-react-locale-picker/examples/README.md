# Examples

Self-contained React 19 examples for
`lily-design-system-react-locale-picker`. Each file is a runnable
component that can be dropped into any React 19 host (Next.js App
Router page, Vite + React route, Remix route, Astro `.tsx` island,
Storybook story).

Every example assumes:

- The consumer file carries `"use client"` if it manages controlled
  state (every file in this directory does).
- The host page allows the picker to write to `document.documentElement`
  (the default). Examples that target a panel ref instead pass an
  explicit `target` prop.

## Index

| #  | File                                                         | Demonstrates                                                       |
| -- | ------------------------------------------------------------ | ------------------------------------------------------------------ |
| 1  | [`01-radios.tsx`](./01-radios.tsx)                           | Default radio rendering with controlled `value` + `onChange`.      |
| 2  | [`02-select.tsx`](./02-select.tsx)                           | `children` render prop with native `<select>`.                     |
| 3  | [`03-buttons.tsx`](./03-buttons.tsx)                         | `children` render prop with button group + `aria-pressed`.         |
| 4  | [`04-rtl-demo.tsx`](./04-rtl-demo.tsx)                       | RTL locales (ar, he, fa, ur, ps) showing `dir` flipping.            |
| 5  | [`05-nhs-style.tsx`](./05-nhs-style.tsx)                     | Class hook + NHS-style markup demonstrating the styling layer.     |
| 6  | [`06-with-react-intl.tsx`](./06-with-react-intl.tsx)         | Wired through `react-intl`'s `IntlProvider`.                       |
| 7  | [`07-with-react-i18next.tsx`](./07-with-react-i18next.tsx)   | Wired through `react-i18next`'s `useTranslation` hook.             |
| 8  | [`08-ssr-cookie.tsx`](./08-ssr-cookie.tsx)                   | Next.js App Router pattern with cookie-resolved initial locale.    |
| 9  | [`09-scoped-target.tsx`](./09-scoped-target.tsx)             | `target` prop pointing at a panel ref instead of `<html>`.         |
| 10 | [`10-combobox.tsx`](./10-combobox.tsx)                       | `children` render prop with a combobox / `<datalist>` pattern.     |

## Running the examples

These files are illustrations, not a build. The fastest way to try one:

1. Inside any Next.js / Vite + React project, drop the example into a
   page / route file.
2. Make sure `"use client"` is at the top of the file (it already is
   in each example).
3. `pnpm dev` and visit the route.

Examples 06 and 07 mock the i18n libraries (`react-intl`,
`react-i18next`) with tiny inline stand-ins so they compile without
their dependencies installed. In your real app, replace the stand-ins
with the real imports — the picker wiring stays the same.

Example 08 is split: the client portion (`LocaleClient`) is the
exported component, and the companion server component (`app/layout.tsx`)
is shown in a block comment at the bottom of the file. Paste both into
the right places in your Next.js project.

## What each example tests

The examples doubles as a hand-driven test plan:

- **01** — `value` + `onChange` round-trip, default labels from
  `defaultLocaleLabels`.
- **02** — `children` render prop receives `{ locales, value, setLocale,
  name, labelFor, tagFor, isRtl }`.
- **03** — `aria-pressed` accessibility for button-group fallback;
  `localeLabels` overrides.
- **04** — `isRtlLocale` predicate and `bcp47LocaleTag` exported
  helpers; reactive `dir` switching.
- **05** — `className` prop, class-hook approach for styled layers.
- **06** / **07** — externalised i18n state wiring.
- **08** — SSR + cookie + server/client component boundary.
- **09** — `target` prop, multiple instances with distinct `name`.
- **10** — long lists via combobox.

If a future change breaks any of these patterns, the example file
breaks too — they're the canonical reference.
