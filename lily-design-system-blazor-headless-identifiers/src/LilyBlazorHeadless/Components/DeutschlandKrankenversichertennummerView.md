# DeutschlandKrankenversichertennummerView

A a read-only display of Germany's Krankenversichertennummer (KVNR).

See `components/deutschland-krankenversichertennummer-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `deutschland-krankenversichertennummer-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<DeutschlandKrankenversichertennummerView Label="Health Insurance Number">...</DeutschlandKrankenversichertennummerView>
```
