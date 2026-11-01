# PinInputDiv

A series of single-digit inputs for entering a PIN or OTP code.

See `components/pin-input-div/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — the group's `aria-label`, and each input's name when `DigitLabel` is not given
- `Length`: int (default 4) — how many digit inputs
- `DigitLabel`: `Func<int, int, string>?` — each input's name from its position and the length, e.g. `(n, of) => $"Digit {n} of {of}"`
- `Value`: string (bindable with `@bind-Value`) — the digits joined
- `Disabled`: bool — disables every input
- `CssClass`: string — extra CSS classes appended to `pin-input-div`
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<PinInputDiv Label="Security code" Length="6" DigitLabel="@((n, of) => $"Digit {n} of {of}")" @bind-Value="code" />
```

## Keyboard

Typing a digit fills the input and moves to the next; any other character is refused. Backspace clears the input, or
in an empty input moves to the previous one and clears it. ArrowLeft and ArrowRight move between the inputs; Tab is the
browser's. Focus moves with Blazor's own `FocusAsync`, so no JavaScript module is needed.
