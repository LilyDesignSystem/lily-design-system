# Tooltip

A small popup showing descriptive text on hover or focus.

See `components/tooltip/index.md` for canonical documentation.

The consumer's trigger sets `Visible` on hover and focus.

## Parameters

- `Label`: string (required) — the text
- `Visible`: bool — the consumer owns it
- `Id`: string — for `aria-describedby`
- `CssClass`, `AdditionalAttributes`

## Usage

```razor
<Tooltip Id="tip" Label="Help" Visible="visible" style="position-anchor: --trigger" />
```
