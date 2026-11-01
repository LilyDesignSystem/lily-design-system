# TabBar

A group of tabs for switching between content panels.

See `components/tab-bar/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `tab-bar`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<TabBar Label="...">
    Content
</TabBar>
```

## Keyboard

ArrowRight / ArrowLeft move focus between the `role="tab"` tabs, wrapping at the ends; Home / End jump to the first and last. The keys are handled in `TabBar.razor.js`, a JavaScript module the component loads after its first
interactive render (C# cannot move focus among the consumer's `ChildContent`); with static server rendering there is
no keyboard handling.
