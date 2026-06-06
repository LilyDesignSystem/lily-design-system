# Examples

Self-contained React 19 examples for
`lily-design-system-react-theme-picker`. Each file is a runnable
component that can be dropped into any React 19 host (Next.js App
Router page, Vite + React route, Remix route, Astro `.tsx` island,
Storybook story).

Every example assumes:

- A directory of theme CSS files served at `/assets/themes/`
  (typically `public/assets/themes/light.css`,
  `public/assets/themes/dark.css`, …). The Lily themes catalog ships
  41 ready-to-use themes.
- Each theme CSS file scopes its tokens with
  `:root[data-theme="<slug>"]`.
- The consumer's file carries `"use client"` if it manages
  controlled state (every file in this directory does).

| #  | File                                                       | Demonstrates                              |
| -- | ---------------------------------------------------------- | ----------------------------------------- |
| 1  | [`basic.tsx`](./basic.tsx)                                 | Minimal three-theme picker.               |
| 2  | [`two-way-binding.tsx`](./two-way-binding.tsx)             | Controlled `value` + `onChange`.          |
| 3  | [`persistence.tsx`](./persistence.tsx)                     | `localStorage` survival across reloads.   |
| 4  | [`custom-labels.tsx`](./custom-labels.tsx)                 | `themeLabels` for i18n / display names.   |
| 5  | [`custom-rendering.tsx`](./custom-rendering.tsx)           | `children` render prop — swatch buttons.  |
| 6  | [`preloaded.tsx`](./preloaded.tsx)                         | Zero-flicker switching via preloading.    |
| 7  | [`multiple-pickers.tsx`](./multiple-pickers.tsx)           | Two pickers in one page via `name`.       |
| 8  | [`system-preference.tsx`](./system-preference.tsx)         | Follow `prefers-color-scheme`.            |
| 9  | [`lily-themes.tsx`](./lily-themes.tsx)                     | All 41 Lily / DaisyUI themes at once.     |
| 10 | [`next-cookie/`](./next-cookie/)                           | Next.js App Router SSR via a cookie.      |

## Running the examples

These files are illustrations, not a build. The fastest way to try
one:

1. Inside any Next.js / Vite + React project, drop the example into
   a page / route file.
2. Copy a couple of theme CSS files from `themes/` into
   `public/assets/themes/`.
3. `pnpm dev` and visit the route.
