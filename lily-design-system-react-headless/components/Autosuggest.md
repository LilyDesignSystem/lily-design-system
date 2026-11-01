# Autosuggest

A text input that proposes matching options as users type: the WAI-ARIA combobox pattern with list autocomplete.

See `components/autosuggest/index.md` for the canonical documentation (ARIA, keyboard, behaviour).

The keys: ArrowDown / ArrowUp open the list and move the highlight (wrapping), Home / End jump while it is open, Enter
chooses, Escape closes; blur closes too. Choosing writes the suggestion's `value` into the input.

## Props

- `label`: string (required) — accessible name of the input and the listbox
- `value`: string (optional) — the input's text, controlled when given; update it from `onInput` and `onSelect`
- `defaultValue`: string (default `""`) — the starting text when uncontrolled
- `suggestions`: `{ value: string; label: string }[]` (default `[]`) — the options to show
- `onInput`: `(query: string) => void` — called as the user types; recompute `suggestions` here
- `onSelect`: `(value: string) => void` — called with the chosen suggestion's value
- `placeholder`, `name`: string — on the input
- `className` and rest props — on the root `<div>`

## Usage

```tsx
const [suggestions, setSuggestions] = useState<AutosuggestSuggestion[]>([]);

<Autosuggest
  label="Fruit"
  suggestions={suggestions}
  onInput={(query) => setSuggestions(search(query))}
  onSelect={(value) => console.log(value)}
/>;
```
