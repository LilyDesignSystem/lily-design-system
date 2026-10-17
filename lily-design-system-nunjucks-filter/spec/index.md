# Filter (Nunjucks) — specification

`@lilydesignsystem/nunjucks-filter` 0.1.0 (2026-10-17). A port of the canonical [Svelte filter](../../lily-design-system-svelte-filter/spec/index.md): read that contract first; the model (§3), editing (§4), validation (§5) and the five outputs (§6–§9) are identical here, because the model is the same file, `shared/filter-model.ts`, copied in by `bin/sync-shared-modules`.

## Component

`{{ filterBuilder({ label, fields, value?, labels, format?, dialect?, maxDepth?, readonly?, classes?, id?, attributes? }) }}` renders the labelled `div.filter[role=group]`, the configuration (`data-lily-filter-builder-config`) and the polite status region. `filter-builder.client.js` (`initFilterBuilder(root, { labels, onChange })`, `autoInit`) builds the groups, conditions and output inside it with the Svelte markup (same classes, roles, `data-*` hooks) and owns every edit; it returns `{ getValue, setValue, destroy }` and dispatches a bubbling `filterchange` event. Typing in a value input updates the stored value and the output text without rebuilding the markup; every other edit rebuilds and puts focus back on the control that had it (`data-focus-key`).

Labels cross the template boundary as plain strings: `{n}` and `{depth}` templates for `rule`, `group`, `removeRule`, `removeGroup`, `ruleAdded`, `ruleRemoved`, `groupAdded`, `groupRemoved`, and an `operatorNames` object. The client option `labels` may give any of them as a function instead, which wins.

## Deviations from the Svelte contract

- NUNJUCKS: the macro renders no conditions. Every control needs the model's operator lists and immutable editing, which a template cannot do, so without JavaScript the root is empty (the same split as the Nunjucks calendar).
- `bind:value` is the macro's starting `value` plus the client's `getValue()` / `setValue()` / `onChange`.
- A function label cannot cross the template boundary; use the string templates or the client `labels` option.
- The starting `value` crosses as JSON, so it is equal to, not the same object as, the filter you passed.

## Acceptance criteria

- [x] Every Svelte §8 clause has a test here (markup, editing, output and use, another language, right-to-left).
- [x] The model's own tests (`filter-model.test.ts`, `search-text.test.ts`) pass against this package's copy.
- [x] No English text in the component: every string is a label supplied by the consumer.
