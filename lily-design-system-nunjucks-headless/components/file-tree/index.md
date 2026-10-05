# FileTree

A hierarchical tree of folders and files following the WAI-ARIA APG tree pattern. The consumer supplies treeitem and group markup.

## Implementation Notes

- Nunjucks macro `fileTree` in `components/file-tree/macro.njk`; root is `<ul role="tree">` with base class `file-tree` plus `params.classes`
- `params.attributes` is spread onto the root element
- Port of the Svelte canonical (`lily-design-system-svelte-headless`)

## Deviations

The Svelte canonical owns the APG keyboard in the component. Nunjucks ships no JavaScript, so this macro renders the tree and `data-module="file-tree"` only; the consumer script owns keyboard behaviour (aria-expanded toggling, roving tabindex over visible items, typeahead). The markup must give exactly one item `tabindex="0"`.

## Props

- `label` (required): aria-label
- `html` / caller content (the treeitems), `classes`, `attributes`, `id`

## Usage

```njk
{% call fileTree({ label: "Project files" }) %}<li role="treeitem" tabindex="0">README</li>{% endcall %}
```

## Keyboard Interactions

ArrowDown/Up, ArrowRight/Left (open, close, child, parent), Home/End, `*`, typeahead, Enter/Space, roving tabindex: see Deviations.

## ARIA

`role="tree"`; consumer supplies `role="treeitem"`, `aria-expanded`, `aria-selected`, `role="group"`.

## When to Use

- You need this pattern in a server-rendered Nunjucks page, with consumer CSS for every visual decision.

## When Not to Use

- See the canonical Svelte component docs for alternatives; this macro has the same contract.

## Headless

No CSS, no inline styles, no icons, no hardcoded strings: every visible string is a param.

## Testing

`macro.test.js` renders the macro through Nunjucks and asserts each contract line in jsdom (`pnpm test`).

## Related components

See `components/file-tree/` in the canonical catalog.
