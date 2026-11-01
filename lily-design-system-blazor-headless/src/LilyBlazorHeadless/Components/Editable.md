# Editable

An inline-editable text element that toggles between view and edit modes.

See `components/editable/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — the accessible name: the input's in edit mode; `"value, label"` in display mode
- `Value`: string (bindable with `@bind-Value`) — the text, shown in display mode
- `Editing`: bool (bindable with `@bind-Editing`) — whether the input is shown
- `Disabled`: bool — `aria-disabled`, out of the tab order, never starts editing
- `CssClass`: string — extra CSS classes appended to `editable`
- `ChildContent`: RenderFragment — display-mode content in place of the value text
- `AdditionalAttributes`: catches unmatched HTML attributes, on whichever element is shown

## Usage

```razor
<Editable Label="Project title" @bind-Value="title" />
```

## Keyboard

On the display `<span role="button">`, a click, Enter or Space start editing. In the input, Enter keeps the draft
and Escape discards it; both return to display mode. Blazor here uses no JavaScript interop, and an event handler cannot cancel only some keys, so Space on the span may also scroll the page, and Enter in
the input also submits an enclosing form.
