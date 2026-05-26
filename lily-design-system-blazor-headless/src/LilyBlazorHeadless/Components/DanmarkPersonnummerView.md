# DanmarkPersonnummerView

A a read-only display of Denmark's Personnummer (CPR-nummer) (CPR).

See `components/danmark-personnummer-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `danmark-personnummer-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<DanmarkPersonnummerView Label="Personal Identity Code">...</DanmarkPersonnummerView>
```
