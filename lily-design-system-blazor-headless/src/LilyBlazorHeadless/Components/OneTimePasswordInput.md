# OneTimePasswordInput

A single one-time-password input with a numeric keypad, SMS autofill, and a fixed length.
Root is one native `<input type="text">`, not segmented boxes (see `PinInputDiv`), so SMS autofill and paste work.
See `components/one-time-password-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — `aria-label`
- `Length`: int (required, no default) — `maxlength` and `data-length`
- `Value` / `ValueChanged`: string — bind with `@bind-Value`; fires on every input
- `InputMode`: string, default `"numeric"`
- `Pattern`: string, default `"[0-9]*"`
- `Name`, `Required`, `Disabled`: native attributes
- `CssClass`, `AdditionalAttributes`: root class hook / rest attributes

Fixed attributes: `autocomplete="one-time-code"`, `spellcheck="false"`, `autocapitalize="off"`. No keyboard handling beyond native.

## Usage

```razor
<OneTimePasswordInput Label="Verification code" Length="6" @bind-Value="code" />
```
