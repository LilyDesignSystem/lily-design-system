# Filter (Angular) — specification

`@lilydesignsystem/angular-filter` 0.1.0 (2026-10-17). A port of the canonical [Svelte filter](../../lily-design-system-svelte-filter/spec/index.md): read that contract first; the model (§3), editing (§4), validation (§5) and the five outputs (§6–§9) are identical here, because the model is the same file, `shared/filter-model.ts`, copied in by `bin/sync-shared-modules`.

## Component

`<lily-filter [label] [fields] [(value)] [labels] [format] [dialect] [maxDepth] [readonly] [className] />` is a standalone `OnPush` component rendering the Svelte markup exactly (same classes, roles, `data-*` hooks), through an internal recursive `FilterGroupView` that reaches the filter through the abstract `FilterHost` token. `value` is a `model()`: `[(value)]` binds it and `(valueChange)` reports every new object. Focus after add or remove (`afterNextRender`) and the polite status announcements follow the Svelte contract.

## Deviations from the Svelte contract

- `bind:value` is `[(value)]`; `onChange` is `(valueChange)`.
- Angular has no rest props: attributes set on `<lily-filter>` land on the host element, and `className` lands on the inner `div.filter`.
- The class is `Filter` (selector `lily-filter`).

## Acceptance criteria

- [x] Every Svelte §8 clause has a test here (markup, editing, output and use, another language, right-to-left).
- [x] The model's own tests (`filter-model.test.ts`, `search-text.test.ts`) pass against this package's copy.
- [x] No English text in the component: every string is a label supplied by the consumer.
