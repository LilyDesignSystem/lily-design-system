# Mentions Input

A mentions input is a text input with at-mention autocomplete suggestions.
It pairs a single-line `<input type="text">` with a suggestions panel
that opens when the user types a configurable trigger character.

Use it for chat composers, comment fields, or any text entry where the
user can mention people, tags, or entities by typing `@`, `#`, or
another trigger.

## Implementation Notes

- Renders a `<div class="mentions-input" data-trigger-char={triggerChar}>` container
- Inner input has `class="mentions-input-control"`, `type="text"`, `role="combobox"`
- Input gets `aria-haspopup="listbox"`, `aria-expanded`, `aria-autocomplete="list"`
- Suggestions panel is `<div class="mentions-input-suggestions">` toggled by `hidden`
- `label` is **required** and is set as `aria-label` on the input
- `triggerChar` defaults to `"@"`
- `disabled` disables the input
- `value` is the current text; consumer manages input state via `oninput`/`onInput`

## Props

- `label`: string (**required**) -- aria-label for the input
- `value`: string (default: "") -- input value
- `triggerChar`: string (default: "@") -- character that opens suggestions
- `expanded`: boolean (default: false) -- whether suggestions panel is open
- `placeholder`: string (optional)
- `disabled`: boolean (default: false)
- `oninput` / `onInput`: callback (optional) -- input change handler
- `children`: slot -- suggestions panel content (typically a Listbox)
- `...restProps`: any additional HTML attributes

## Usage

```html
<MentionsInput
  label="Mention a teammate"
  value={text}
  triggerChar="@"
  expanded={showSuggestions}
  oninput={handleInput}
>
  <ul role="listbox">
    <li role="option">@alice</li>
    <li role="option">@bob</li>
  </ul>
</MentionsInput>
```

## Keyboard Interactions

- Tab: Focus the input
- Type the trigger char: Consumer should set `expanded` to true
- Arrow Down / Up: Consumer should move focus or active descendant inside the listbox
- Enter: Consumer should commit the active suggestion
- Escape: Consumer should close the suggestions panel

## ARIA

- Input has `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-autocomplete="list"`
- `aria-label` is the entire accessible name of the input (required)
- Consumer-supplied listbox uses `role="listbox"` with `role="option"` children

## When to Use

- Use in chat composers, comment fields, or task descriptions where users mention people or entities.
- Use when the suggestions are filtered by what the user types after the trigger.

## When Not to Use

- Do not use for free-form selection unrelated to a trigger character — use Combobox.
- Do not use for static dropdown selection — use Select.

## Headless

Renders semantic combobox markup with no styling. Consumer manages
suggestion filtering, the `expanded` state, listbox markup, focus
management, and any visual treatment.

## Styles

Consumer CSS targets `mentions-input`, `mentions-input-control`, and
`mentions-input-suggestions`. Provide a clear focus ring on the input
and a visible boundary on the suggestions panel.

## Testing

- Verify the component renders a `<div>` element with class `mentions-input`
- Verify the inner `<input type="text">` has class `mentions-input-control`
- Verify `role="combobox"`, `aria-haspopup="listbox"`, `aria-autocomplete="list"` are set
- Verify `aria-expanded` reflects the `expanded` prop
- Verify `aria-label` equals the `label` prop
- Verify `data-trigger-char` equals the `triggerChar` prop (default `@`)
- Verify the suggestions panel is `hidden` when `expanded` is false
- Verify `disabled` attribute is applied to the input when `disabled` is true

## Advice

- **Designers**: Show the trigger character in the placeholder hint so users know how to invoke suggestions.
- **Developers**: Track caret position to detect the trigger char accurately. Use `aria-activedescendant` on the input to announce the current suggestion.

## Related components

- `text-input` — a single-line text input field <input type="text">

## References

- WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- Ant Design Mentions: https://ant.design/components/mentions

---

Lily™ and Lily Design System™ are trademarks.
