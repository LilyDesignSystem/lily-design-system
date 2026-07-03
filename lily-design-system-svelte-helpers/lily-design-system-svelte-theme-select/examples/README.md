# Examples

Self-contained Svelte 5 examples for
`lily-design-system-svelte-theme-select`. Each file is a runnable
component that can be dropped into any Svelte 5 host (SvelteKit page,
Vite + Svelte route, Astro `.svelte` island, Storybook story).

Every example assumes:

- A directory of theme CSS files served at `/assets/themes/`
  (typically `static/assets/themes/light.css`,
  `static/assets/themes/dark.css`, …). The
  [Lily themes](../../themes/) catalog ships 41 ready-to-use themes.
- Each theme CSS file scopes its tokens with
  `:root[data-theme="<slug>"]`.

| # | File                                                | Demonstrates                              |
|---|------------------------------------------------------|-------------------------------------------|
| 1 | [`basic.svelte`](./basic.svelte)                     | Minimal three-theme select.               |
| 2 | [`two-way-binding.svelte`](./two-way-binding.svelte) | `bind:value` and `onChange`.              |
| 3 | [`persistence.svelte`](./persistence.svelte)         | `localStorage` survival across reloads.   |
| 4 | [`custom-labels.svelte`](./custom-labels.svelte)     | `themeLabels` for i18n / display names.   |
| 5 | [`custom-rendering.svelte`](./custom-rendering.svelte) | `children` snippet — swatch buttons.    |
| 6 | [`preloaded.svelte`](./preloaded.svelte)             | Zero-flicker switching via preloading.    |
| 7 | [`multiple-selects.svelte`](./multiple-selects.svelte) | Two selects in one page via `name`.     |
| 8 | [`system-preference.svelte`](./system-preference.svelte) | Follow `prefers-color-scheme`.        |
| 9 | [`lily-themes.svelte`](./lily-themes.svelte)         | All 41 Lily / DaisyUI themes at once.     |
| 10 | [`sveltekit-cookie/`](./sveltekit-cookie/)          | SSR-resolved theme via a cookie.          |

## Running the examples

These files are illustrations, not a build. The fastest way to try one
is:

1. Inside any SvelteKit project, drop the example into
   `src/routes/+page.svelte`.
2. Copy a couple of theme CSS files from
   [`../../themes/`](../../themes/) into `static/assets/themes/`.
3. `pnpm dev` and visit the route.
