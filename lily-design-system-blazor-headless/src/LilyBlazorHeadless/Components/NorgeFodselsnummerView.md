# NorgeFodselsnummerView

A a read-only display of Norway's Fødselsnummer.

See `components/norge-fodselsnummer-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `norge-fodselsnummer-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<NorgeFodselsnummerView Label="Norwegian Birth Number">...</NorgeFodselsnummerView>
```
