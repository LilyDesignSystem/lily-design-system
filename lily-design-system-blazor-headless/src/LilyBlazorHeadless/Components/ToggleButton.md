# ToggleButton

A button that toggles between pressed and unpressed states.

See `components/toggle-button/index.md` for canonical documentation.

Enter and Space click the native button, so Space has no handler of its own.

## Parameters

- `Label`: string (required) — accessible name
- `Pressed`, `PressedChanged`: bool — two-way with `@bind-Pressed`, reported in `aria-checked`
- `Disabled`: bool
- `CssClass`: string — extra CSS classes appended to `toggle-button`
- `ChildContent`: RenderFragment — button content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ToggleButton Label="Mute" @bind-Pressed="muted">Mute</ToggleButton>
```
