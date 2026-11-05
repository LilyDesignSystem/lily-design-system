# FloatButton

A floating action button anchored to a viewport corner.

See `components/float-button/index.md` for canonical documentation.

Fixed by an inline style, which is structural.

## Parameters

- `Label`: string (required)
- `Position`: `top-left`, `top-right`, `bottom-left` or `bottom-right`, rendered as `data-position`
- `Disabled`: bool; `Type`: `button`, `submit` or `reset`
- `OnClick`: EventCallback<MouseEventArgs>
- `ChildContent`, `CssClass`, `AdditionalAttributes`

## Usage

```razor
<FloatButton Label="Help" Position="bottom-right" OnClick="OpenHelp">?</FloatButton>
```
