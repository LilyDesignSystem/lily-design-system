# SubmitInput

A button input that submits a form <input type="submit">.

See `components/submit-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `submit-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SubmitInput>
    Content
</SubmitInput>
```
