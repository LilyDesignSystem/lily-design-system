# TourList

An ordered list of tour guide steps.

See `components/tour-list/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `Active`: bool (default `false`, bindable with `@bind-Active`) — the list renders only while it is true
- `CssClass`: string — extra CSS classes appended to `tour-list`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<TourList Label="Getting started" @bind-Active="touring">
    Content
</TourList>
```

## Semantics

A plain `<ol>` with `aria-label`: no `role="dialog"` (it hid the list semantics) and no `aria-modal`. Any dialog
semantics belong to the enclosing `Tour`, which is non-modal.

## Keyboard

Escape inside the list sets `Active` to false (and raises `ActiveChanged`). `tabindex="-1"` lets the list take focus.
