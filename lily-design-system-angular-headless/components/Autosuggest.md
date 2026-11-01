# Autosuggest

a text input that proposes matching options as users type

This is the Angular headless implementation. See `components/autosuggest/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-autosuggest
  label="Fruit"
  [(value)]="fruit"
  [suggestions]="suggestions"
  (query)="suggestions = search($event)"
  (selected)="onSelected($event)"
></lily-autosuggest>
```

## Inputs and outputs

- `label` (string) — accessible name of the input and the listbox
- `value` (string, two-way `model`) — the input's text; restored on form reset
- `suggestions` (`AutosuggestSuggestion[]`: `{ value, label }`) — the options to show
- `placeholder`, `name` (string) — on the input
- `className` (string) — appended to the root's class list
- `query` (output, string) — as the user types; recompute `suggestions` here
- `selected` (output, string) — the chosen suggestion's value

The keys: ArrowDown / ArrowUp open the list and move the highlight (wrapping), Home / End jump while it is open, Enter
chooses, Escape closes; blur closes too.

## Files

- `Autosuggest.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `Autosuggest.spec.ts` — vitest + TestBed render test
