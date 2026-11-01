# Popup

A temporary overlay that appears above page content.

See `components/popup/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `Open` / `OpenChanged` (`@bind-Open`) — shows it through the Popover API (`popover="auto"`); the browser's toggles (Escape, light dismiss, a `command="toggle-popover" commandfor` trigger) write back
- `Id`: string — so a trigger can name it
- `CssClass`: string — extra CSS classes appended to `popup`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Popup Label="...">
    Content
</Popup>
```
