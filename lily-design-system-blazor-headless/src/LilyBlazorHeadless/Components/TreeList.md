# TreeList

A hierarchical list with nested expandable items.

See `components/tree-list/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `tree-list`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<TreeList>
    Content
</TreeList>
```

## Keyboard

ArrowDown / ArrowUp move focus between the visible `role="treeitem"` items (those inside a collapsed `aria-expanded="false"` item are skipped), wrapping at the ends; Home / End jump to the first and last. The keys are handled in `TreeList.razor.js`, a JavaScript module the component loads after its first
interactive render (C# cannot move focus among the consumer's `ChildContent`); with static server rendering there is
no keyboard handling.
