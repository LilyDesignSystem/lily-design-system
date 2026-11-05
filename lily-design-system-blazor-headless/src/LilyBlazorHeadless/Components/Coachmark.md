# Coachmark

An anchored popover that spotlights and explains a single feature.

See `components/coachmark/index.md` for canonical documentation.

A non-modal `popover="manual"`. Name the feature with `position-anchor`; with none, the themes place it in the viewport.

## Parameters

- `Title`, `DismissLabel`: string (required)
- `Description`: string
- `Open`: bool — the consumer owns it
- `OnDismiss`: EventCallback<MouseEventArgs>
- `CssClass`, `AdditionalAttributes`

## Usage

```razor
<Coachmark Open="open" Title="New" DismissLabel="Close" OnDismiss="@(() => open = false)" style="position-anchor: --feature" />
```
