# OsterreichSozialversicherungsnummerView

A a read-only display of Austria's Sozialversicherungsnummer (SVNR).

See `components/osterreich-sozialversicherungsnummer-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `osterreich-sozialversicherungsnummer-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<OsterreichSozialversicherungsnummerView Label="Osterreich Sozialversicherungsnummer">...</OsterreichSozialversicherungsnummerView>
```
