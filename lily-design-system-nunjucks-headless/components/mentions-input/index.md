# MentionsInput

a text input with at-mention autocomplete suggestions

## Description

MentionsInput renders a `<div>` containing an `<input role="combobox">`
and a sibling suggestions panel. When the user types the configured
`triggerChar` (default `@`), the consumer typically opens the
suggestions panel by setting `expanded: true` and rendering a
`<ul role="listbox">` inside the panel.

The macro is headless: it provides the ARIA scaffolding and the
visibility hook (`hidden` on the panel) but does not detect the
trigger character or filter suggestions itself.

## HTML tag

`<div>` containing `<input>` and a suggestions `<div>`.

## CSS class

`mentions-input`

## Params

- `label` — string. **Required.** `aria-label` for the inner input.
- `value` — string. Default `""`. Input value.
- `triggerChar` — string. Default `"@"`. Character that opens the
  suggestions panel. Exposed via `data-trigger-char`.
- `expanded` — boolean. Default `false`. Whether the suggestions
  panel is open.
- `placeholder` — string. Placeholder text on the input.
- `disabled` — boolean. Disables the input.
- `id` — string. id for the inner input.
- `name` — string. name for the inner input.
- `text` — string. Plain text content for the suggestions panel
  (escaped).
- `html` — string. Raw HTML content for the suggestions panel
  (rendered via `| safe`).
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes on the root element.

## Usage

```njk
{% from "components/mentions-input/macro.njk" import mentionsInput %}

{% call mentionsInput({
  label: "Comment",
  placeholder: "Type @ to mention someone",
  expanded: true
}) %}
  <ul role="listbox">
    <li role="option">@alice</li>
    <li role="option">@bob</li>
  </ul>
{% endcall %}
```

## Keyboard

Follow the
[WAI-ARIA combobox + listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/):

- Type to filter
- `Down`/`Up` to navigate options
- `Enter` to insert the selected mention
- `Escape` to close

## Accessibility

- The inner `<input>` carries `role="combobox"`,
  `aria-haspopup="listbox"`, `aria-autocomplete="list"`, and
  `aria-expanded`.
- `aria-label` is required because the input has no visible label by
  default. Use `attributes` to add `aria-labelledby` instead when a
  visible label exists.

## Headless

No CSS or JavaScript is bundled. Consumers handle trigger detection,
suggestion fetching, and selection insertion.

## Testing

`components/mentions-input/macro.test.js` verifies the base class,
ARIA scaffolding on the input, the trigger char data attribute,
expanded/hidden state, value/placeholder/disabled pass-through, and
slot/attribute pass-through.

## References

- [WAI-ARIA: combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [Ant Design: Mentions](https://ant.design/components/mentions)

---

Lily™ and Lily Design System™ are trademarks.
