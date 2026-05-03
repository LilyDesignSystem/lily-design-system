# DontListItem

A discouraged-practice item in a dont-list guideline list.

See `components/dont-list-item/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `dont-list-item`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<DontListItem>
    Content
</DontListItem>
```
