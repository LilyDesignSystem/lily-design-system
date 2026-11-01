# Autosuggest

A text input that proposes matching options as users type, helping people find an item from a long list without browsing the whole list.

**Status:** beta — implemented and unit-tested in all seven frameworks (Nunjucks renders the markup; opening and the keys are the consumer's script) with an axe-clean demo page; not yet exercised in composed flows.

The component implements the WAI-ARIA Combobox pattern: a single-line `<input>` is paired with a popup `<ul role="listbox">` that appears when there are suggestions and disappears when the user picks one or dismisses it. The consumer owns the matching logic — Autosuggest emits the typed query, the consumer passes back a fresh list of suggestions, and the component handles the open state, the highlight, keyboard navigation, the selection and the ARIA wiring.

Use it for searches over large or remote datasets (countries, services, contacts, products) where typing should narrow the field, but where the user is also free to enter free-form text that may not appear in the suggestion list.

## Implementation Notes

- Implements the WAI-ARIA combobox pattern with list autocomplete: a `<div class="autosuggest">` root holding an `<input class="autosuggest-input" role="combobox">` and a `<ul class="autosuggest-list" role="listbox">` of `<li class="autosuggest-option" role="option">`
- The consumer computes the suggestions: `onInput` receives the typed query, and the consumer passes the new list back in `suggestions` (filtering or fetching is the consumer's). HTML, Alpine and Web Components take the options as `role="option"` children of the list instead, and re-read them whenever the consumer replaces them
- The component owns the open state, the highlight and the selection
- The list opens when the user types or presses an arrow, and only while there are suggestions; it stays in the DOM, `hidden` while closed, so `aria-controls` always resolves
- Choosing a suggestion (Enter, or a click) writes its `value` into the input, calls `onSelect` with it and closes the list
- Pressing on an option does not blur the input, so a click can choose it
- Closing happens on Escape, blur, or a choice
- Supports two-way binding on the `value` prop

## Props

| Prop           | Type                                        | Default | Description                                                         |
| -------------- | ------------------------------------------- | ------- | ------------------------------------------------------------------- |
| `label`        | string (required)                           | —       | Accessible name for the input                                       |
| `value`        | string                                      | ""      | Bindable input value                                                |
| `suggestions`  | array of `{ value: string; label: string }` | []      | Current suggestions to show                                         |
| `onInput`      | (query: string) => void                     | —       | Fired when the typed value changes; consumer recomputes suggestions |
| `onSelect`     | (value: string) => void                     | —       | Fired when the user selects a suggestion                            |
| `placeholder`  | string                                      | —       | Placeholder text                                                    |
| `name`         | string                                      | —       | Form field name of the input                                        |
| `...restProps` | HTML attributes                             | —       | Spread onto the wrapper `<div>`                                     |

## Usage

```html
<Autosuggest
  label="Find a service"
  bind:value="{query}"
  suggestions="{current}"
  onInput="{handleQuery}"
  onSelect="{handleSelect}"
/>
```

`handleQuery` receives the typed text and updates `current`, an array of `{ value, label }`; `handleSelect` receives the chosen
suggestion's `value`, which is also written into the input.

Rendered markup, with the list open on its second option:

```html
<div class="autosuggest">
  <input
    class="autosuggest-input"
    type="text"
    role="combobox"
    autocomplete="off"
    aria-label="Find a service"
    aria-autocomplete="list"
    aria-expanded="true"
    aria-controls="autosuggest-list-1"
    aria-activedescendant="autosuggest-option-1-1"
    value="den"
  />
  <ul
    class="autosuggest-list"
    role="listbox"
    id="autosuggest-list-1"
    aria-label="Find a service"
  >
    <li
      class="autosuggest-option"
      role="option"
      id="autosuggest-option-1-0"
      aria-selected="false"
      data-value="dentist"
    >
      Dentist
    </li>
    <li
      class="autosuggest-option"
      role="option"
      id="autosuggest-option-1-1"
      aria-selected="true"
      data-value="dental-hygienist"
    >
      Dental hygienist
    </li>
  </ul>
</div>
```

## Keyboard Interactions

- Down arrow: open the listbox and highlight the first option / move the highlight to the next option, wrapping
- Up arrow: open the listbox and highlight the last option / move the highlight to the previous option, wrapping
- Enter: select the highlighted option
- Escape: close the listbox without selecting
- Home / End: jump to the first / last option (when listbox is open)

## ARIA

- `role="combobox"` on the input (ARIA 1.2; not on the wrapper), with `aria-autocomplete="list"` and `aria-expanded` reflecting listbox visibility
- `aria-controls` on the input references the listbox id
- `aria-activedescendant` on the input references the highlighted option, and is absent when none is
- `role="listbox"` on the suggestion list (labelled with `label` too), `role="option"` on each suggestion
- The highlighted option has `aria-selected="true"`; the others `"false"`

## When to Use

- Searching long lists of options where typing narrows the choices (e.g. countries, services, contacts)
- Implementing search-as-you-type with server-driven results

## When Not to Use

- Use `Combobox` when you want a permanent dropdown that may also accept typed values
- Use `Select` for short, fixed lists of options
- Use `MentionsInput` for at-mentions inside a textarea

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.autosuggest` as the root class, and `.autosuggest-input`, `.autosuggest-list` and `.autosuggest-option` inside it. Style the highlighted option with `[aria-selected="true"]`. No default styles are included.

## Related components

- `combobox` — input with a permanent dropdown filter
- `select` — native select dropdown
- `mentions-input` — at-mention autocomplete inside a textarea

## References

- [WAI-ARIA Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

---

Lily™ and Lily Design System™ are trademarks.
