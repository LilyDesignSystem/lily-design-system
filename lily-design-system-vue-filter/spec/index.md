# Filter (Vue 3) — specification

`@lilydesignsystem/vue-filter` 0.1.0 (2026-10-17). A port of the canonical [Svelte filter](../../lily-design-system-svelte-filter/spec/index.md): read that contract first; the model (§3), editing (§4), validation (§5) and the five outputs (§6–§9) are identical here, because the model is the same file, `shared/filter-model.ts`, copied in by `bin/sync-shared-modules`.

## Component

`<Filter :label :fields v-model :labels :format :dialect :max-depth :readonly @change />` renders the Svelte markup exactly (same classes, roles, `data-*` hooks), through `Filter.vue` and a recursive `FilterGroupView.vue` that reads a context provided by `Filter`. `v-model` is a `defineModel`: bound by the parent, else kept locally; `change` is also emitted with the new group. `class` and other attributes fall through to the root `div.filter`. Focus after add or remove (after `nextTick`) and the polite status announcements follow the Svelte contract.

## Deviations from the Svelte contract

- `bind:value` is `v-model`; `onChange` is the `change` event.
- Vue wraps the value in a reactive proxy, so a test that checks an untouched node is shared compares `toRaw` of both.

## Acceptance criteria

- [x] Every Svelte §8 clause has a test here (markup, editing, output and use, another language, right-to-left).
- [x] The model's own tests (`filter-model.test.ts`, `search-text.test.ts`) pass against this package's copy.
- [x] No English text in the component: every string is a label supplied by the consumer.
