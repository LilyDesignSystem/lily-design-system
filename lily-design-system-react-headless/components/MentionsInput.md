# MentionsInput

A text input with at-mention autocomplete suggestions. The component is a `<div>` wrapping an `<input role="combobox">` and a suggestions panel that the consumer fills (typically with a Listbox of matching mentions).

## Implementation Notes

- `label` is non-optional -- the input MUST have an accessible name
- The trigger character is exposed as `data-trigger-char` on the root
- Suggestions panel uses the `hidden` attribute, controlled by `expanded`
- The component is fully controlled: consumer manages `value` and `expanded`

## Props

- `label`: string (**required**) -- aria-label
- `value`: string (default: `""`)
- `triggerChar`: string (default: `"@"`)
- `expanded`: boolean (default: `false`)
- `placeholder`: string (optional)
- `disabled`: boolean (default: `false`)
- `onInput`: (event: React.FormEvent<HTMLInputElement>) => void (optional)
- `children`: ReactNode (required) -- suggestions panel content
- `...restProps`: Any additional HTML attributes passed to the root `<div>`

## Usage

```tsx
<MentionsInput
  label="Comment"
  value={text}
  expanded={showSuggestions}
  onInput={(e) => setText(e.currentTarget.value)}
>
  <Listbox>…</Listbox>
</MentionsInput>
```

## Keyboard Interactions

- Type the trigger character (default `@`) to open the suggestions panel (consumer detects and toggles `expanded`)
- Arrow keys / Enter on suggestion items: handled by the consumer's listbox

## ARIA

- The `<input>` has `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-autocomplete="list"`
- `aria-label` from the `label` prop
