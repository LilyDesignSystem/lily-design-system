# BulgariaEdinenGrazhdanskiNomerView

A a read-only display of Bulgaria's Единен граждански номер / Edinen grazhdanski nomer (EGN).

See `components/bulgaria-edinen-grazhdanski-nomer-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `bulgaria-edinen-grazhdanski-nomer-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<BulgariaEdinenGrazhdanskiNomerView Label="Uniform Civil Number">...</BulgariaEdinenGrazhdanskiNomerView>
```
