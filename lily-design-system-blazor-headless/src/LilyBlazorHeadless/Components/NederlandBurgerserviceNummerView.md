# NederlandBurgerserviceNummerView

A a read-only display of Netherlands's Burgerservicenummer (BSN).

See `components/nederland-burgerservice-nummer-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `nederland-burgerservice-nummer-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<NederlandBurgerserviceNummerView Label="Citizen Service Number">...</NederlandBurgerserviceNummerView>
```
