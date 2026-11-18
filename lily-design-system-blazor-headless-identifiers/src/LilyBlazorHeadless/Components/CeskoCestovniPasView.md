# CeskoCestovniPasView

A a read-only display of Czech Republic's Cestovní pas.

See `components/cesko-cestovni-pas-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `cesko-cestovni-pas-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<CeskoCestovniPasView Label="Czech Passport">...</CeskoCestovniPasView>
```
