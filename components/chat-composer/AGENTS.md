# ChatComposer

## Metadata

- Component: chat-composer
- PascalCase: ChatComposer
- Description: a chat input form with a text area that grows with its content, sends on Enter, and turns its send button into a stop button while a reply is in progress
- Status: beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows
- HTML tag: <form>
- CSS class: .chat-composer
- Interactive: yes

## Key Behaviors

- A `<form>` with `<textarea class="chat-composer-input">` and one `<button class="chat-composer-button">`
- Enter sends; Shift+Enter inserts a line break; Enter during IME composition is ignored
- The button is send (`type=submit`, `data-state=send`) or, while `busy`, stop (`type=button`, `data-state=stop`); disabled, never hidden, when the text is empty
- `rows` follows the line count between `minRows` (1) and `maxRows` (8)
- Never clears the text; never animates; carries no strings
- Blazor: no plain-Enter send (no JS interop); Nunjucks/HTML: markup-only initial state

## ARIA

- Textarea `aria-label` from `label`; the button is named by its visible word

## Keyboard

- Enter: send. Shift+Enter: line break. Enter during IME composition: nothing. Enter/Space on the button: send or stop

## Props

- `label`, `sendLabel`, `stopLabel`: string (required)
- `value`: string (bindable); `placeholder`, `name`: string; `minRows` (1), `maxRows` (8): number
- `busy`, `disabled`: boolean (default `false`)
- `onSend(value)`, `onStop()` (or `send` / `stop` events)
- `children`: slot before the textarea; `class`, `...restProps` on the `<form>`

## Acceptance Criteria

- [ ] Renders <form> with class="chat-composer", a named textarea and one button
- [ ] Enter / Shift+Enter / IME / empty / disabled / busy behave as above
- [ ] Button swaps send and stop, disabled not hidden
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.chat-composer` in css-style-sheet-template.css
