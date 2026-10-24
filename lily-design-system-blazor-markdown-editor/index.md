# MarkdownEditor (Blazor helper)

A headless Blazor Markdown editor: a `<textarea>` with a toolbar of buttons for
rich-text effects — headings, bold, italic, strikethrough, code, link, quote,
bulleted and numbered lists. The buttons **write Markdown into the textarea**,
so the value is plain text: it submits with a form, validates, diffs, stores
anywhere, and works without JavaScript.

It is the Blazor port of `@lilydesignsystem/svelte-markdown-editor`; where the two
disagree, the Svelte side wins. The single source of truth is
[spec/index.md](./spec/index.md); this file is the human-readable guide.

## Install

```
dotnet add package LilyDesignSystem.Blazor.MarkdownEditor
```

```razor
@using LilyDesignSystem.Blazor.Helpers
```

## Quick start

```razor
<MarkdownEditor @bind-Value="_body"
                Label="Message"
                ToolbarLabel="Formatting"
                Labels="_labels"
                Name="body"
                Rows="8" />

@code {
    private string _body = "";
    private readonly Dictionary<string, string> _labels = new()
    {
        ["heading"] = "Heading", ["bold"] = "Bold", ["italic"] = "Italic", ["strikethrough"] = "Strikethrough",
        ["code"] = "Code", ["link"] = "Link", ["quote"] = "Quote",
        ["bulletList"] = "Bulleted list", ["numberedList"] = "Numbered list",
    };
}
```

Every name is a prop, because the component ships no English. A tool with no
entry in `labels` is not rendered: an unnamed button is worse than no button.

## Props

| Prop | Type | Required | Default | Purpose |
| ---- | ---- | -------- | ------- | ------- |
| `Value` / `ValueChanged` (`@bind-Value`) | `string` | no | `""` | The text, as Markdown. |
| `Label` | `string` | yes | — | Accessible name of the textarea. |
| `ToolbarLabel` | `string` | yes | — | Accessible name of the toolbar. |
| `Labels` | `IReadOnlyDictionary<string,string>` | yes | — | Accessible name per tool id; a tool without one is not rendered. |
| `Tools` | `IReadOnlyList<string>` | no | all nine | Which tools to show, and in what order. |
| `HeadingLevel` | `1`–`6` | no | `2` | How many `#` the heading tool writes. |
| `Name`, `Id`, `Rows`, `Placeholder`, `Disabled`, `ReadOnly`, `Required` | | no | | Passed to the `<textarea>`. |
| `Icon` | `RenderFragment<string>` | no | bundled SVGs | Replaces a tool's icon; receives the tool id. |
| `CssClass`, unmatched attributes | | no | | Appended to the root class; spread onto the root. |

`ToolId` is `heading | bold | italic | strikethrough | code | link | quote | bulletList | numberedList`.

`MarkdownFormat` (public, static) is the C# port of `shared/markdown-format.ts` — `ApplyTool`, `ToggleWrap`, `ToggleLines`, `InsertLink` — with the same cases in `MarkdownFormatTests.cs`. It is **not** generated: where the two disagree, the TypeScript wins.

### Deviations from the Svelte reference

Blazor cannot decide `preventDefault` per key without a script, and ships none:

- **No `Ctrl`/`Cmd` + `B` / `I` / `K` shortcuts.** In Firefox those keys open the bookmarks sidebar, page info and the search bar, and the component cannot stop them. Every tool is still on the toolbar.
- **`Home` / `End` on the toolbar also scroll the page.** They still move focus to the first and last button.
- The selection is read, and the edited text applied, through `IJSRuntime` `"eval"` on click — no JS file ships. The browser applies the edit through `execCommand("insertText")`, so native undo and redo keep working.

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
