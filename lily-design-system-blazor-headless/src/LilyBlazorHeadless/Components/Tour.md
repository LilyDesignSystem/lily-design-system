# Tour

A tour guide, such as for sightseeing, or pathways, or demonstrations, etc..

See `components/tour/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `Active`: bool (bindable with `@bind-Active`) — the tour renders only while it is true
- `CssClass`: string — extra CSS classes appended to `tour`
- `ChildContent`: RenderFragment — typically a `TourList`
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Tour Label="Welcome tour" @bind-Active="touring">
    <TourList Label="Steps" Active="true">...</TourList>
</Tour>
```

## Keyboard

Escape inside the tour sets `Active` to false. Tab moves on normally; the tour does not trap focus.

## Modality

Non-modal: a tour points at parts of the real page and often asks the user to try them, so the page stays usable;
no `aria-modal`, no focus trap.
