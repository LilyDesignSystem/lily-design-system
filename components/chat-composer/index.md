# ChatComposer

A headless wrapper for a chat input form with a text area that grows with its content, sends on Enter, and turns its send button into a stop button while a reply is in progress.

**Status:** beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.

A chat input form kept deliberately narrow: a `<textarea>` and **one** button. The button is "send" normally and turns into "stop" while a reply is in progress (`busy`), so it keeps focus across the swap. Enter sends, Shift+Enter inserts a line break, and Enter during an IME composition (for example confirming a Japanese conversion) does nothing. The component never clears the text, never animates and carries no strings. Model pickers, attachment rows and "+" menus are consumer composition, passed in the default slot and rendered before the textarea.

## Implementation Notes

- Root `<form class="chat-composer {class}">`; the textarea is `.chat-composer-input`; the button is `.chat-composer-button` with `data-state="send"` or `"stop"` and a `.chat-composer-button-label` span holding the word
- `rows` is computed from the number of lines in the value, clamped between `minRows` (1) and `maxRows` (8). Soft-wrapped long lines do not add rows; consumer CSS `field-sizing: content` covers that where supported
- The send button is **disabled, never hidden,** when the text is empty or whitespace, or the form is disabled, so the layout does not shift
- While `busy` the button is `type="button"` and calls the stop handler; Enter does not send
- The component does not clear the text: do it in your send handler
- `restProps` spread onto the `<form>`

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `label` | string (required) | — | Accessible name of the textarea |
| `sendLabel` | string (required) | — | Word for the send button |
| `stopLabel` | string (required) | — | Word for the stop button |
| `value` | string | `""` | The text (bindable / `v-model` / controlled) |
| `placeholder`, `name` | string | — | Passed to the textarea |
| `minRows`, `maxRows` | number | `1`, `8` | Row limits for the growing textarea |
| `busy` | boolean | `false` | A reply is in progress: the button becomes stop |
| `disabled` | boolean | `false` | Disables the textarea and the button |
| `onSend(value)` / `send` event | callback | — | Enter or submit, when there is text and not busy/disabled |
| `onStop()` / `stop` event | callback | — | The stop button was pressed |
| `children` | slot | — | Rendered inside the form before the textarea |
| `class`, `...restProps` | | | Appended to the base class / spread onto the `<form>` |

## Usage

```svelte
<ChatComposer
  label="Message"
  sendLabel="Send"
  stopLabel="Stop"
  bind:value={draft}
  busy={replying}
  onSend={(text) => { send(text); draft = ""; }}
  onStop={cancelReply}
/>
```

## Keyboard Interactions

| Key | Action |
| --- | ------ |
| Enter | Send (when there is text, and not busy or disabled) |
| Shift+Enter | Insert a line break |
| Enter during IME composition | Nothing |
| Enter or Space on the button | Send, or stop while busy |

## ARIA

- The textarea is named by `label` (`aria-label`)
- The button's accessible name is its visible word (`sendLabel` or `stopLabel`), so icon-only styling must hide that text visually, not remove it
- `data-state` is for consumer CSS only; the word carries the meaning

## When to Use

- A chat or assistant input where Enter sends and Shift+Enter adds a line
- When a reply can be stopped and the send button should become a stop button in the same place
- When the input must work with IME text entry in languages like Japanese, Chinese and Korean

## When Not to Use

- Use `TextAreaInput` — a plain multi-line field in an ordinary form where Enter should add a line
- Use `TextAreaInputWithCharacterCounter` — a field with a visible length limit
- Use `Form` and `Field` — a multi-field form rather than a one-message input
- Use `ChatList` and `ChatMessage` — showing the conversation, not entering it

## Headless

This component decides behaviour only: keyboard sending, the IME guard, row growth, and the send/stop swap. It decides no layout, colour, icon, animation or placement of the model picker and attachments.

## Styles

Target `.chat-composer`, `.chat-composer-input`, `.chat-composer-button` (and `[data-state="send"]` / `[data-state="stop"]`), and `.chat-composer-button-label`. No default styles are included.

## Testing

- Form, named textarea and exactly one button
- Send button states: disabled for empty or whitespace text, enabled otherwise; stop while busy
- Enter sends and prevents the line break; Shift+Enter, IME Enter, empty, disabled and busy do not send
- Submit sends; stop calls the stop handler and never send
- Rows follow lines within `minRows` and `maxRows`; disabled, placeholder, name, class and rest props

## Advice

Clear the text in your send handler, and set `busy` for the whole reply so the stop button is available. Hide the button's label text visually (not with `display: none`) if you show an icon. For attachments or a model picker, put your own markup (or other Lily components) in the default slot.

Library differences, each documented in the library's own doc: **Blazor** has no JS interop, so plain Enter inserts a line break there and sending is by the button or Ctrl/Cmd+Enter. **Nunjucks and HTML** are markup-only and render the correct initial state; the live Enter, growth and swap behaviour needs a script (the Web Components element has it). **Angular** and **Web Components** use output / `lily-send` and `lily-stop` events.

## Related components

- `text-area-input`
- `text-area-input-with-character-counter`
- `chat-list`
- `chat-message`
- `form`

## References

- [MDN textarea element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea)
- [MDN KeyboardEvent.isComposing](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing)

---

Lily™ and Lily Design System™ are trademarks.
