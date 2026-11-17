# Examples

Self-contained Solid 2.0 examples for
`@lilydesignsystem/solid-theme-picker`. Each file is a runnable
component that can be dropped into any Solid 2.0 app (a Vite + Solid route, an Astro
Solid island,
Storybook story).

Every example assumes:

- A directory of theme CSS files served at `/assets/themes/`
  (typically `public/assets/themes/light.css`,
  `public/assets/themes/dark.css`, …). The Lily themes catalog ships
  63 ready-to-use themes.
- Each theme CSS file scopes its tokens with
  `:root[data-theme="<slug>"]`.
- Some CSS positions the dropdown. The control is an icon button that
  opens a `<ul role="listbox">`, and the package ships no CSS, so the
  list sits in normal flow until you give the root `position: relative`
  and the list `position: absolute`. See
  [`../docs/styling.md`](../docs/styling.md).

| #   | File                                               | Demonstrates                                          |
| --- | -------------------------------------------------- | ----------------------------------------------------- |
| 1   | [`basic.tsx`](./basic.tsx)                         | Minimal three-theme picker + the default status line. |
| 2   | [`two-way-binding.tsx`](./two-way-binding.tsx)     | Controlled `value` + `onChange`.                      |
| 3   | [`persistence.tsx`](./persistence.tsx)             | `localStorage` survival across reloads.               |
| 4   | [`custom-labels.tsx`](./custom-labels.tsx)         | `themeLabels` for i18n / display names.               |
| 5   | [`custom-rendering.tsx`](./custom-rendering.tsx)   | `children` render prop — custom button glyph.         |
| 6   | [`preloaded.tsx`](./preloaded.tsx)                 | Zero-flicker switching via preloading.                |
| 7   | [`multiple-pickers.tsx`](./multiple-pickers.tsx)   | Two selects in one page via `name`.                   |
| 8   | [`system-preference.tsx`](./system-preference.tsx) | Follow `prefers-color-scheme`.                        |
| 9   | [`lily-themes.tsx`](./lily-themes.tsx)             | Many Lily themes at once.                             |

## Running the examples

These files are illustrations, not a build. The fastest way to try
one:

1. Inside any Vite + Solid project, drop the example into
   a page / route file.
2. Copy a couple of theme CSS files from `themes/` into
   `public/assets/themes/`.
3. `pnpm dev` and visit the route.
