# ToolBar

A horizontal bar of tool actions.

See `components/tool-bar/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `tool-bar`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ToolBar Label="...">
    Content
</ToolBar>
```

## Keyboard

ArrowRight / ArrowLeft move focus between its enabled buttons, wrapping at the ends; Home / End jump to the first and last. The keys are handled in `ToolBar.razor.js`, a JavaScript module the component loads after its first
interactive render (C# cannot move focus among the consumer's `ChildContent`); with static server rendering there is
no keyboard handling.
