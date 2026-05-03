# TabPanel

A content panel associated with a tab in a tab bar.

See `components/tab-panel/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `tab-panel`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<TabPanel Label="...">
    Content
</TabPanel>
```
