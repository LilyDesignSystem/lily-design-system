# MentionsInput

A text input with at-mention autocomplete suggestions. Renders a wrapper `<div>`, an inner `<input>` with combobox semantics, and a suggestions panel populated by the consumer.

## Implementation Notes

- Headless: no CSS, no styles
- `label` is **required** and non-optional in the TypeScript interface
- The trigger character (default `@`) is exposed via `data-trigger-char` for styling/behavior hooks
- The inner input uses `role="combobox"` with `aria-haspopup="listbox"` and `aria-autocomplete="list"`

## Props

- `label`: string (**required**) — accessible name (aria-label)
- `value`: string (default `""`) — input value
- `triggerChar`: string (default `"@"`) — character that opens suggestions
- `expanded`: boolean (default `false`) — whether the suggestions panel is open
- `placeholder`: string — input placeholder
- `disabled`: boolean (default `false`)
- default slot — suggestions panel content (typically a Listbox)
- `...$attrs` — additional HTML attributes

## Events

- `input(event: Event)` — emitted on each input change

## Usage

```vue
<MentionsInput
    label="Reply"
    :value="text"
    :expanded="showSuggestions"
    placeholder="Type @ to mention someone…"
    @input="onInput"
>
    <ul role="listbox">
        <li role="option">alice</li>
        <li role="option">bob</li>
    </ul>
</MentionsInput>
```

## Keyboard Interactions

- `Tab` — focus the input
- Typing the trigger character should cause the consumer to set `expanded="true"`
- Consumer is responsible for arrow-key listbox navigation inside the suggestions panel

## ARIA

- Input: `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-autocomplete="list"`, `aria-label` (required)

## When to Use

- Free-form text entry with @mentions, #hashtags, or `:emoji` shortcodes

## When Not to Use

- Single-token selection — use `Combobox` or `Select`

## Headless

The component renders semantic HTML and ARIA structure only. Consumers supply suggestions content and all visual styling.

## Testing

- Verify the root `mentions-input` class and `data-trigger-char`
- Verify combobox role, aria-haspopup, aria-autocomplete, aria-label
- Verify `value` and `placeholder` are passed through
- Verify suggestions panel hidden state
- Verify the input event is emitted

## References

- [WAI-ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [Ant Design Mentions](https://ant.design/components/mentions)
