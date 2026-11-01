# Menu

A list of actions or options triggered by a button.

See `components/menu/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `menu`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Menu Label="...">
    Content
</Menu>
```

## Keyboard

ArrowDown / ArrowUp move focus between the `role="menuitem"` items, wrapping at the ends; Home / End jump to the first and last. The keys are handled in `Menu.razor.js`, a JavaScript module the component loads after its first
interactive render (C# cannot move focus among the consumer's `ChildContent`); with static server rendering there is
no keyboard handling.
