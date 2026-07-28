# Examples

Self-contained React 19 examples for
`lily-design-system-react-text-size-picker`. Each file is a runnable
component that can be dropped into any React 19 host (Next.js App
Router page, Vite + React route, Remix route, Astro `.tsx` island,
Storybook story).

Every example assumes:

- Your stylesheet maps each `[data-text-size="<slug>"]` on `:root` to a
  relative font size, e.g.:

  ```css
  :root[data-text-size="small"] {
    font-size: 87.5%;
  }
  :root[data-text-size="medium"] {
    font-size: 100%;
  }
  :root[data-text-size="large"] {
    font-size: 112.5%;
  }
  :root[data-text-size="x-large"] {
    font-size: 125%;
  }
  ```

  Without that mapping the control works but nothing visibly resizes.
- The consumer's file carries `"use client"` if it manages controlled
  state (every file in this directory does).
- Some CSS positions the dropdown. The control is an icon button that
  opens a `<ul role="listbox">`, and the package ships no CSS, so the
  list sits in normal flow until you give the root `position: relative`
  and the list `position: absolute`.

| #   | File                                                | Demonstrates                                              |
| --- | ---------------------------------------------------- | ----------------------------------------------------------- |
| 1   | [`basic.tsx`](./basic.tsx)                           | Minimal four-size picker + the default status line.       |
| 2   | [`two-way-binding.tsx`](./two-way-binding.tsx)       | Controlled `value` + `onChange`.                           |
| 3   | [`persistence.tsx`](./persistence.tsx)               | `localStorage` survival across reloads.                   |
| 4   | [`custom-labels.tsx`](./custom-labels.tsx)           | `sizeLabels` for i18n / display names.                     |
| 5   | [`custom-rendering.tsx`](./custom-rendering.tsx)     | `children` render prop — custom button glyph.              |
| 6   | [`multiple-pickers.tsx`](./multiple-pickers.tsx)     | Two pickers in one page via distinct `name` + `target`.   |
| 7   | [`external-buttons.tsx`](./external-buttons.tsx)     | Driving the control from your own preset buttons via the controlled `value`. |

## Running the examples

These files are illustrations, not a build. The fastest way to try one:

1. Inside any Next.js / Vite + React project, drop the example into a
   page / route file.
2. Add the slug → font-size mapping above to your site stylesheet.
3. `pnpm dev` and visit the route.

## What is deliberately missing

There is no `system-preference.tsx` here, unlike the sibling
`theme-picker` and `locale-picker` example sets. Browsers expose no
"preferred text size" signal — there is no media query equivalent to
`prefers-color-scheme` and no `navigator.languages` analogue — so the
component ships no detection prop to demonstrate. Users who scale text
at the OS level are already served by browser zoom and the browser's
own minimum-font-size setting, which this helper must not fight.

There is also no `themesUrl`/preloading/stylesheet-swapping example: this
helper sets one data attribute only and ships no managed `<link>`, unlike
`theme-picker`.

---

Lily™ and Lily Design System™ are trademarks.
