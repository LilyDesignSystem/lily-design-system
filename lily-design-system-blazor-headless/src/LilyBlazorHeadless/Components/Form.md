# Form

A form element for collecting and submitting user data.

See `components/form/index.md` for canonical documentation.

The default submit is always prevented. Read the values through `@bind-Value`: the event has no form data in C#.

## Parameters

- `Label`: string (required) — accessible name
- `OnSubmit`, `OnReset`: EventCallback<EventArgs>; `@onsubmit` and `@onreset` reach the same parameters
- `CssClass`: string — extra CSS classes appended to `form`
- `ChildContent`: RenderFragment — the fields
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Form Label="Contact" novalidate OnSubmit="HandleSubmit">
    ...
</Form>
```
