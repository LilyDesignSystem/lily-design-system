# Filter (React) — specification

`@lilydesignsystem/react-filter` 0.1.0 (2026-10-17). A port of the canonical [Svelte filter](../../lily-design-system-svelte-filter/spec/index.md): read that contract first; the model (§3), editing (§4), validation (§5) and the five outputs (§6–§9) are identical here, because the model is the same file, `shared/filter-model.ts`, copied in by `bin/sync-shared-modules`.

## Component

`<Filter label fields value? defaultValue? onChange? labels format? dialect? maxDepth? readonly? className? />` renders the Svelte markup exactly (same classes, roles, `data-*` hooks). It is controlled when `value` is given and uncontrolled otherwise (`defaultValue` starts it); every edit calls `onChange` with a new object. Rest props land on the root `div.filter`. Focus after add or remove and the polite status announcements follow the Svelte contract; focus moves in an effect after the render that creates its target.

## Deviations from the Svelte contract

- `bind:value` becomes the React `value` / `defaultValue` / `onChange` triple.
- `class` is `className`.

## Acceptance criteria

- [x] Every Svelte §8 clause has a test here (markup, editing, output and use, another language, right-to-left).
- [x] The model's own tests (`filter-model.test.ts`, `search-text.test.ts`) pass against this package's copy.
- [x] No English text in the component: every string is a label supplied by the consumer.
