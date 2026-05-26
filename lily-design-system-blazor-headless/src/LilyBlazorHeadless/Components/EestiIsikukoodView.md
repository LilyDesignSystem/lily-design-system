# EestiIsikukoodView

A a read-only display of Estonia's Isikukood (IK).

See `components/eesti-isikukood-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `eesti-isikukood-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<EestiIsikukoodView Label="Personal Identification Code">...</EestiIsikukoodView>
```
