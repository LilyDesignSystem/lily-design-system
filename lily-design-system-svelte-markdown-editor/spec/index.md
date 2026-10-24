# MarkdownEditor — Specification

Single source of truth for the `@lilydesignsystem/svelte-markdown-editor` Svelte
helper. Anything not in this spec is out of scope; anything in this spec must be
exercised by a test.

Sibling files: `MarkdownEditor.svelte` (implementation), `format.ts` (the pure
Markdown transforms), `MarkdownEditor.test.ts` and `format.test.ts` (tests),
`index.ts` (barrel), `index.md` (guide).

## 1. Goal

A drop-in, headless editor for a `<textarea>` with a top bar of buttons for
rich-text effects, whose value stays plain Markdown text.

## 2. Non-goals

- A WYSIWYG surface (`contenteditable`), a document model, collaborative editing.
- Parsing, rendering or sanitising Markdown.
- Images, tables, mentions, uploads, autocomplete, slash commands.
- Bundled CSS, fonts or English strings.

## 3. Architectural decisions

- **Plain text in, plain text out.** A `<textarea>` keeps form participation,
  `required`, spellcheck, IME, mobile keyboards and screen-reader behaviour for
  free; a `contenteditable` re-implements all of them and rarely gets them right.
- **Pure core.** All text transformation is in `format.ts`: `(text, selection)`
  in, `(text, selection)` out. No DOM, so it is exhaustively unit-tested.
- **Own toolbar, no headless dependency.** The toolbar uses a roving tabindex
  (APG); the headless `ToolBar` leaves every button in the tab order. The package
  therefore has only a `svelte` peer dependency.
- **Undo is preserved** by editing through `execCommand("insertText")` where the
  browser has it, falling back to setting `value` and dispatching `input`.
- **Names gate rendering.** A tool with no `labels` entry is not rendered.

## 4. Public API

See [index.md § Props](../index.md#props). Exports: `MarkdownEditor` (default),
`nextMarkdownEditorId`, `applyTool`, `toggleWrap`, `toggleLines`, `insertLink`,
`TOOL_IDS`, `WRAP_MARKERS`, and the types `Props`, `Labels`, `ToolId`,
`WrapTool`, `LineTool`, `Edit`.

## 5. Markup and class hooks

Root `<div class="markdown-editor {class}">` holding
`<div class="markdown-editor-toolbar" role="toolbar">` of
`<button class="markdown-editor-button" type="button" data-tool>` (each with a
`<svg class="markdown-editor-icon" aria-hidden>`), then
`<textarea class="markdown-editor-textarea">`. Rest props spread onto the root.

## 6. Behaviour

1. A wrap tool (bold `**`, italic `*`, strikethrough `~~`, code `` ` ``) wraps the
   selection; applied again over wrapped text it unwraps, whether the markers are
   just outside or just inside the selection.
2. Bold and italic share the asterisk: `***x***` is both; each is removed
   independently (italic needs an odd run, bold at least two).
3. With nothing selected a wrap tool inserts the pair and leaves the caret between.
4. Link writes `[selection](https://)` and selects `https://`; with nothing selected
   the caret goes inside the brackets.
5. Line tools (heading, quote, bulleted, numbered) prefix every selected line,
   remove the prefix when every non-empty line has it, replace a competing prefix,
   skip blank lines, and ignore a final line the selection only touches at its start.
   Numbered lists count from 1.
6. After a tool the textarea has focus and the formatted text is selected.
7. `onchange` and the bound `value` update on typing and on every tool.
8. `Ctrl`/`Cmd`+`B`/`I`/`K` apply bold/italic/link when that tool is shown.
9. `readonly` and `disabled` make tools do nothing; `disabled` disables the buttons.

## 7. Accessibility

Toolbar role with roving tabindex, `←`/`→`/`Home`/`End`, `aria-controls` to the
textarea, decorative icons, supplied names. See [docs/accessibility.md](../docs/accessibility.md).

## 8. Acceptance criteria

- [x] One test per behaviour clause above (`format.test.ts`, `MarkdownEditor.test.ts`).
- [x] Mutation-checked: removing the readonly guard or the roving tab stop fails a test.
- [x] `svelte-check` clean; `npm run build` emits `dist/` with `format.js`.
- [ ] Ports to the other seven helper catalogs (React, Vue, Angular, HTML,
      Nunjucks, Blazor, Web Components, Alpine) — not started.
- [ ] WCAG 2.2 AAA audit with a real screen reader.

---

Lily™ and Lily Design System™ are trademarks.
