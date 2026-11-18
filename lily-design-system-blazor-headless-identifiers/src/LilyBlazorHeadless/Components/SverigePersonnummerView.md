# SverigePersonnummerView

A a read-only display of Sweden's Personnummer.

See `components/sverige-personnummer-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `sverige-personnummer-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SverigePersonnummerView Label="Personal Identity Number">...</SverigePersonnummerView>
```
