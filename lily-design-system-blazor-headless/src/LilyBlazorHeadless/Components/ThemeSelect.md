# ThemeSelect

A select dropdown for choosing a theme.

See `components/theme-select/index.md` for canonical documentation.

It does not apply the theme: the consumer reacts to `Value`.

## Parameters

- `Label`: string (required) — accessible name
- `Value`, `ValueChanged`: string — two-way with `@bind-Value`
- `CssClass`: string — extra CSS classes appended to `theme-select`
- `ChildContent`: RenderFragment — the options
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ThemeSelect Label="Theme" @bind-Value="theme">
    <ThemeSelectOption value="light">Light</ThemeSelectOption>
    <ThemeSelectOption value="dark">Dark</ThemeSelectOption>
</ThemeSelect>
```
