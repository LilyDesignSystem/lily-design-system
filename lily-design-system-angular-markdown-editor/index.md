# MarkdownEditor (Angular helper)

A headless Angular Markdown editor: a `<textarea>` with a toolbar of buttons for
rich-text effects — headings, bold, italic, strikethrough, code, link, quote,
bulleted and numbered lists. The buttons **write Markdown into the textarea**,
so the value is plain text: it submits with a form, validates, diffs, stores
anywhere, and works without JavaScript.

It is the Angular port of `@lilydesignsystem/svelte-markdown-editor`; where the two
disagree, the Svelte side wins. The single source of truth is
[spec/index.md](./spec/index.md); this file is the human-readable guide.

## Install

```ts
import { MarkdownEditor, type Labels } from "@lilydesignsystem/angular-markdown-editor";
```

## Quick start

```ts
import { Component, signal } from "@angular/core";
import { MarkdownEditor } from "@lilydesignsystem/angular-markdown-editor";

@Component({
  standalone: true,
  imports: [MarkdownEditor],
  template: `
    <lily-markdown-editor
      [(value)]="body"
      label="Message"
      toolbarLabel="Formatting"
      [labels]="labels"
      name="body"
      [rows]="8"
    />
  `,
})
export class Message {
  body = signal("");
  labels = {
    heading: "Heading", bold: "Bold", italic: "Italic", strikethrough: "Strikethrough", code: "Code",
    link: "Link", quote: "Quote", bulletList: "Bulleted list", numberedList: "Numbered list",
  };
}
```

Every name is a prop, because the component ships no English. A tool with no
entry in `labels` is not rendered: an unnamed button is worse than no button.

## Props

| Prop | Type | Required | Default | Purpose |
| ---- | ---- | -------- | ------- | ------- |
| `value` | `string` (a `model()`: `[(value)]`) | no | `""` | The text, as Markdown. |
| `label` | `string` | yes | — | Accessible name of the textarea. |
| `toolbarLabel` | `string` | yes | — | Accessible name of the toolbar. |
| `labels` | `Partial<Record<ToolId,string>>` | yes | — | Accessible name per tool; a tool without one is not shown. |
| `tools` | `ToolId[]` | no | all nine | Which tools to show, and in what order. |
| `headingLevel` | `1`–`6` | no | `2` | How many `#` the heading tool writes. |
| `name`, `id`, `rows`, `placeholder`, `disabled`, `readonly`, `required` | | no | | Passed to the `<textarea>`. |
| `changed` (output) | `string` | | | After every change, typed or from a tool. |
| `icon` | `TemplateRef<{ $implicit: ToolId }>` | no | bundled SVGs | Replaces a tool's icon. |
| `className` | `string` | no | `""` | Appended to the root `markdown-editor` class. |

`ToolId` is `heading | bold | italic | strikethrough | code | link | quote | bulletList | numberedList`.

The selector is `lily-markdown-editor`; the host element has no class of its own, the base class is on the inner `<div class="markdown-editor">`.

## Behaviour

- **Toggle.** A tool pressed over text that already has the formatting takes it
  off. `**bold**` selected, Bold again: back to `bold`.
- **Selection survives.** After a tool runs the same text stays selected, so you
  can stack effects. Link selects the `https://` placeholder, ready to type over.
- **Lines.** Heading, quote and lists act on every selected line; numbered lists
  count from 1 and skip blank lines. A different list or heading prefix is
  replaced, not stacked.
- **Undo.** Edits go through the browser's editing pipeline where it has one
  (`execCommand("insertText")`), so native undo and redo keep working.
- **Shortcuts.** `Ctrl`/`Cmd` + `B`, `I` and `K` apply bold, italic and link —
  only when that tool is shown.

## Markup

```html
<div class="markdown-editor {class}">
  <div class="markdown-editor-toolbar" role="toolbar" aria-label aria-controls aria-orientation="horizontal">
    <button class="markdown-editor-button" type="button" data-tool="bold" aria-label tabindex="0">
      <svg class="markdown-editor-icon" aria-hidden="true">…</svg>
    </button>
    …
  </div>
  <textarea class="markdown-editor-textarea" aria-label name …></textarea>
</div>
```

## Keyboard

| Where    | Key                            | Action                                       |
| -------- | ------------------------------ | -------------------------------------------- |
| Toolbar  | `←` `→`                        | Move to the previous / next button (clamps). |
| Toolbar  | `Home` `End`                   | First / last button.                         |
| Toolbar  | `Tab`                          | Into the toolbar (one tab stop), then out.   |
| Toolbar  | `Enter` `Space`                | Apply the tool; focus returns to the text.   |
| Textarea | `Ctrl`/`Cmd` + `B` `I` `K`     | Bold, italic, link.                          |

## What it is not

- **A WYSIWYG editor.** It does not render the Markdown, draw bold text in the
  field, or edit a document tree. Show a preview with your own Markdown
  renderer if you want one; the value is yours to render and to sanitise.
- **A Markdown parser or sanitiser.** Nothing here reads the text back as HTML.
- **Styled.** No CSS ships. Target `.markdown-editor`, `.markdown-editor-toolbar`,
  `.markdown-editor-button` and `.markdown-editor-textarea`.
- **Images, tables, mentions, uploads.** None; use the headless components.

## Related

[accessibility notes](./docs/accessibility.md) · [examples](./examples/README.md) ·
the Svelte canonical package `lily-design-system-svelte-markdown-editor`
