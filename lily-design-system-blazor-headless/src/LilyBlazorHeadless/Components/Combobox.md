# Combobox

A text input combined with a dropdown list for filtering options.

See `components/combobox/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label` for both the input and the listbox
- `Value`: string, default `""` — current text input value; bindable via `@bind-Value`
- `Open`: bool, default `false` — dropdown visibility state; bindable via `@bind-Open`
- `ChildContent`: RenderFragment (required) — option elements rendered inside the listbox dropdown
- `CssClass`: string — extra CSS classes appended to `combobox`
- `AdditionalAttributes`: catches unmatched HTML attributes, splatted onto the root `<div>`

## Usage

```razor
<Combobox Label="Select a fruit" @bind-Value="value" @bind-Open="open">
    @foreach (var option in filtered)
    {
        <div role="option" tabindex="-1" @onclick="() => { value = option; open = false; }">
            @option
        </div>
    }
</Combobox>
```
