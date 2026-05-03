# MockupShell

A box area that looks like a terminal shell.

See `components/mockup-shell/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `mockup-shell`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<MockupShell Label="...">
    Content
</MockupShell>
```
