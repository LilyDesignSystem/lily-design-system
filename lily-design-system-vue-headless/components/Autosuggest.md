# Autosuggest

A text input that proposes matching options as users type: the WAI-ARIA combobox pattern with list autocomplete.

See `components/autosuggest/index.md` for the canonical documentation (ARIA, keyboard, behaviour).

The keys: ArrowDown / ArrowUp open the list and move the highlight (wrapping), Home / End jump while it is open, Enter
chooses, Escape closes; blur closes too. Choosing writes the suggestion's `value` into the input.

## Props and events

- `label`: string (required) — accessible name of the input and the listbox
- `v-model` (`modelValue`): string (default `""`) — the input's text
- `suggestions`: `{ value: string; label: string }[]` (default `[]`) — the options to show
- `placeholder`, `name`: string — on the input
- `@input`: `(query: string)` — as the user types; recompute `suggestions` here
- `@select`: `(value: string)` — the chosen suggestion's value
- Attributes fall through to the root `<div>`

## Usage

```vue
<Autosuggest
  v-model="fruit"
  label="Fruit"
  :suggestions="suggestions"
  @input="(query) => (suggestions = search(query))"
  @select="(value) => console.log(value)"
/>
```
