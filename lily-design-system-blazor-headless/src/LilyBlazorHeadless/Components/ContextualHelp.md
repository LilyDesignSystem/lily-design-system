# ContextualHelp

A help button that opens a popover with explanatory content.

See `components/contextual-help/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — the trigger's `aria-label`
- `TriggerLabel`: string (required, no default) — the trigger's visible text, such as `?`
- `Expanded` / `ExpandedChanged` (`@bind-Expanded`) — the panel is `popover="auto"`, opened by the trigger's `command="toggle-popover" commandfor`
- `OnClick` — the trigger's click
- `CssClass`: string — extra CSS classes appended to `contextual-help`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ContextualHelp Label="..." TriggerLabel="?">
    Content
</ContextualHelp>
```
