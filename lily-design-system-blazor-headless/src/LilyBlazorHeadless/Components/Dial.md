# Dial

A rotary dial control for selecting a value.

See `components/dial/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `Value`: double (bindable with `@bind-Value`) — the current value, reflected in `aria-valuenow`
- `Min`, `Max`: double (default 0 and 100) — the range, in `aria-valuemin` / `aria-valuemax`
- `Step`: double (default 1) — the change per key press
- `Disabled`: bool — `aria-disabled`, out of the tab order, keys ignored
- `CssClass`: string — extra CSS classes appended to `dial`
- `ChildContent`: RenderFragment — what the consumer draws inside the dial
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Dial Label="Volume" @bind-Value="volume" Min="0" Max="11" />
```

## Keyboard

ArrowRight / ArrowUp raise the value by `Step` and ArrowLeft / ArrowDown lower it (ten steps with Shift); Home and End
set `Min` and `Max`. The value stays inside the range. Blazor here uses no JavaScript interop, and an event handler cannot cancel only some keys, so the keys may also scroll the page.
