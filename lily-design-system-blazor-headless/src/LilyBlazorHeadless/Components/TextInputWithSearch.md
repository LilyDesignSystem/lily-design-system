# TextInputWithSearch

A single-line text input field <input type="text"> with search capability.

See `components/text-input-with-search/index.md` for canonical documentation.

Enter searches and never submits a surrounding form. `TextInputWithSearch.razor.js` does that, which needs an interactive render mode.

## Parameters

- `Label`, `InputLabel`, `SearchLabel`: string (required)
- `Value`, `ValueChanged`: two-way with `@bind-Value`
- `Placeholder`: string; `Required`, `Disabled`: bool
- `OnSearch`: EventCallback<string>
- `CssClass`, `AdditionalAttributes`

## Usage

```razor
<TextInputWithSearch Label="Site" InputLabel="Terms" SearchLabel="Search" @bind-Value="terms" OnSearch="Find" />
```
