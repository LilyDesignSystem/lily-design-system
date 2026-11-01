# EditableForm

A form wrapper for inline editing of content.

See `components/editable-form/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `Editing`: bool (bindable with `@bind-Editing`) — the form renders only while it is true
- `OnSubmit`: EventCallback — raised when the form is submitted (Blazor stops the browser's own submission)
- `OnCancel`: EventCallback — raised when Escape cancels editing
- `CssClass`: string — extra CSS classes appended to `editable-form`
- `ChildContent`: RenderFragment — the fields and buttons
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<EditableForm Label="Address" @bind-Editing="editing" OnSubmit="Save" OnCancel="Revert">
    <input name="street" @bind="street" />
    <button type="submit">Save</button>
</EditableForm>
```

## Keyboard

Enter in a field (or a submit button) submits: edit mode ends and `OnSubmit` is raised. Escape inside the form ends
edit mode and raises `OnCancel`.
