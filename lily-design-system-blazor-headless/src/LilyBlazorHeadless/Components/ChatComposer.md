# ChatComposer

A headless wrapper for a chat input form with a text area that grows with its content, sends on Enter, and turns its send button into a stop button while a reply is in progress.

## Canonical documentation

See [components/chat-composer/index.md](../../../../components/chat-composer/index.md) for the full component documentation: keyboard, ARIA, props and guidance.

## Usage

```razor
<ChatComposer Label="Message" SendLabel="Send" StopLabel="Stop" @bind-Value="draft" Busy="@replying" OnSend="Send" OnStop="Cancel" />
```

## Contract

A `<form class="chat-composer">` with a named `<textarea>` and one send/stop button; Enter sends, Shift+Enter inserts a line break, IME Enter is ignored; the button is disabled, never hidden, when empty; no string, animation or clearing of the text.

Blazor deviation: no JS interop, so plain Enter inserts a line break; send with the button (form submit) or Ctrl/Cmd+Enter.

---

Lily™ and Lily Design System™ are trademarks.
