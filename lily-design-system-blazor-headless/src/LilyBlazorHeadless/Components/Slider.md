# Slider

A draggable control for selecting a value along a track.

See `components/slider/index.md` for canonical documentation.

A native `<input type="range">`: the browser supplies the keys.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `Value`, `ValueChanged`: double, default 50 — two-way with `@bind-Value`
- `Min`, `Max`, `Step`: double, default 0, 100 and 1
- `Disabled`: bool
- `CssClass`: string — extra CSS classes appended to `slider`
- `AdditionalAttributes`: catches unmatched HTML attributes; `aria-valuetext` goes here

## Usage

```razor
<Slider Label="Volume" @bind-Value="volume" Max="200" />
```
