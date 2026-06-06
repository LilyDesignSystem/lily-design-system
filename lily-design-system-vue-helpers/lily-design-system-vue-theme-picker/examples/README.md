# Examples

Self-contained Vue 3 examples for
`lily-design-system-vue-theme-picker`. Each file is a runnable
component that can be dropped into any Vue 3 host (Nuxt 3 page,
Vite + Vue route, Astro `.vue` island, Storybook story).

Every example assumes:

- A directory of theme CSS files served at `/assets/themes/`
  (typically `public/assets/themes/light.css`,
  `public/assets/themes/dark.css`, …). The
  [Lily themes](../../../themes/) catalog ships 41 ready-to-use
  themes.
- Each theme CSS file scopes its tokens with
  `:root[data-theme="<slug>"]`.

| # | File                                          | Demonstrates                              |
|---|-----------------------------------------------|-------------------------------------------|
| 1 | [`basic.vue`](./basic.vue)                    | Minimal three-theme picker.               |
| 2 | [`two-way-binding.vue`](./two-way-binding.vue)| `v-model:value` and `@change`.            |
| 3 | [`persistence.vue`](./persistence.vue)        | `localStorage` survival across reloads.   |
| 4 | [`custom-labels.vue`](./custom-labels.vue)    | `themeLabels` for i18n / display names.   |
| 5 | [`custom-rendering.vue`](./custom-rendering.vue) | Default scoped slot — swatch buttons.  |
| 6 | [`preloaded.vue`](./preloaded.vue)            | Zero-flicker switching via preloading.    |
| 7 | [`multiple-pickers.vue`](./multiple-pickers.vue) | Two pickers in one page via `name`.    |
| 8 | [`system-preference.vue`](./system-preference.vue) | Follow `prefers-color-scheme`.      |
| 9 | [`lily-themes.vue`](./lily-themes.vue)        | All 41 Lily / DaisyUI themes at once.     |
| 10 | [`nuxt-cookie/`](./nuxt-cookie/)             | SSR-resolved theme via a cookie (Nuxt 3). |

## Running the examples

These files are illustrations, not a build. The fastest way to try
one is:

1. Inside any Vite + Vue 3 project (or Nuxt 3), drop the example
   into a route component.
2. Copy a couple of theme CSS files from
   [`../../../themes/`](../../../themes/) into
   `public/assets/themes/`.
3. `pnpm dev` and visit the route.

## v-model conventions

The picker exposes its bindable on `value` (not the default
`modelValue`). Always use `v-model:value="theme"` in templates, and
pair with `@change` for one-shot side effects.

## Naming

Vue templates use kebab-case for props: `themes-url`, `default-value`,
`theme-labels`, `storage-key`. In `<script setup>` we use camelCase
to match the TypeScript types.
