# Autosuggest

A text input that proposes matching options as users type.

See `components/autosuggest/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible name of the input and the listbox
- `Value` / `ValueChanged`: string (`@bind-Value`) — the input's text
- `Suggestions`: `IReadOnlyList<AutosuggestSuggestion>` — the options to show (`new("apple", "Apple")`)
- `OnInput`: `EventCallback<string>` — as the user types; recompute `Suggestions` here
- `OnSelect`: `EventCallback<string>` — the chosen suggestion's value
- `Placeholder`, `Name`: string — on the input
- `CssClass`: string — extra CSS classes appended to `autosuggest`
- `AdditionalAttributes`: catches unmatched HTML attributes (on the root `<div>`)

## Usage

```razor
<Autosuggest Label="Fruit" @bind-Value="fruit" Suggestions="suggestions" OnInput="Search" OnSelect="Chosen" />
```

The keys (C#): ArrowDown / ArrowUp open the list and move the highlight (wrapping), Home / End jump while it is open,
Enter chooses, Escape closes; blur closes too. `Autosuggest.razor.js` only cancels those keys' default actions while the
list is open (so Enter does not submit a form), which a C# handler cannot do per key; its tests are
`tests/js/autosuggest.test.mjs`.
