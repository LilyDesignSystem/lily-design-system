# Filter (HTML) — specification

`@lilydesignsystem/html-filter` 0.1.0 (2026-10-17). A port of the canonical [Svelte filter](../../lily-design-system-svelte-filter/spec/index.md): read that contract first; the model (§3), editing (§4), validation (§5) and the five outputs (§6–§9) are identical here, because the model is the same file, `shared/filter-model.ts`, copied in by `bin/sync-shared-modules`.

## Component

`<filter-builder label format dialect max-depth readonly class>` with the properties `fields`, `labels` (required), `value` and `onChange`. It renders the Svelte markup exactly (same classes, roles, `data-*` hooks) in light DOM with `document.createElement` only. Every edit calls `onChange(group)` and dispatches a bubbling, composed `filterchange` event whose `detail` is the new group. Typing in a value input updates the stored value and the output text without rebuilding the markup (a rebuild would drop focus); every other edit rebuilds and puts focus back on the control that had it (`data-focus-key`). Adding a condition focuses its field select; removing returns focus to the group's Add condition.

## Deviations from the Svelte contract

- `bind:value` is the `value` property plus `onChange` / `filterchange`.
- Attributes carry the scalars (`label`, `format`, `dialect`, `max-depth`, `readonly`, `class`); `fields`, `labels` and `value` are properties.
- There are no rest props: set attributes on the element itself. `class` on the element lands on the inner `div.filter`.
- The tag is `filter-builder` (a custom element name needs a hyphen); the class is `FilterBuilder`.

## Acceptance criteria

- [x] Every Svelte §8 clause has a test here (markup, editing, output and use, another language, right-to-left).
- [x] The model's own tests (`filter-model.test.ts`, `search-text.test.ts`) pass against this package's copy.
- [x] No English text in the component: every string is a label supplied by the consumer.
