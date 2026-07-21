# AGENTS — Lily Vue Helpers

Catalog and conventions: [index.md](./index.md).

Each sibling directory is a self-contained helper. Find the helper's
`spec/index.md` for the canonical contract before changing it. Each helper
follows the file shape in [index.md § Conventions](./index.md#conventions).

## Helpers currently in the catalog

- [`lily-design-system-vue-theme-chooser`](./lily-design-system-vue-theme-chooser/) — dynamic theme CSS loader.
- [`lily-design-system-vue-locale-chooser`](./lily-design-system-vue-locale-chooser/) — `lang` + `dir` locale chooser.
- [`lily-design-system-vue-text-size-chooser`](./lily-design-system-vue-text-size-chooser/) — `data-text-size` text-size chooser.
- [`lily-design-system-vue-share-chooser`](./lily-design-system-vue-share-chooser/) — native share sheet / destination disclosure + copy URL.

## Working rules

- Treat each helper's `spec/index.md` as the single source of truth.
- Vue 3 Composition API only — `<script setup lang="ts">`,
  `defineProps`, `defineEmits`, `defineModel`, `ref`, `watch`,
  `onMounted`. No Options API, no `mixins`, no `defineComponent`
  wrappers.
- Tests use vitest + jsdom + `@vue/test-utils`.
- No hardcoded user-facing strings; everything comes from props.
- The canonical reference is the parallel
  [`lily-design-system-svelte-helpers`](../lily-design-system-svelte-helpers/)
  catalog; Vue helpers are direct ports with framework idioms swapped.
