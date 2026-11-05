# CallToAction

A prominent prompt encouraging user action.

See `components/call-to-action/index.md` for canonical documentation.

The contract's `<div>`, which the themes style as a band, holding a link or a button.

## Parameters

- `Href`: string — makes it a link
- `Label`: string — `aria-label` of the link or button
- `Disabled`: bool, button only
- `OnClick`: EventCallback<MouseEventArgs>, button only
- `ChildContent`, `CssClass`, `AdditionalAttributes` (on the root)

## Usage

```razor
<CallToAction Href="/join">Join us</CallToAction>
```
