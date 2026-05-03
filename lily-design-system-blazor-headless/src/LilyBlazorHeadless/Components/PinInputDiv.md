# PinInputDiv

A series of single-digit inputs for entering a PIN or OTP code.

See `components/pin-input-div/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `pin-input-div`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<PinInputDiv Label="...">
    Content
</PinInputDiv>
```
