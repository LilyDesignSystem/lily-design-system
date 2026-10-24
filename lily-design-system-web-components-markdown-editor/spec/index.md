# MarkdownEditor — Specification

Single source of truth for the `@lilydesignsystem/web-components-markdown-editor` Web Components helper, a port of
`@lilydesignsystem/svelte-markdown-editor` (the canonical reference; where they
disagree, Svelte wins — see [its spec](../../lily-design-system-svelte-markdown-editor/spec/index.md)).
Anything not in this spec is out of scope; anything in it must be exercised by a test.

## 1. Goal

A drop-in, headless editor for a `<textarea>` with a top bar of buttons for
rich-text effects, whose value stays plain Markdown text.

## 2. Non-goals

WYSIWYG, a document model, parsing / rendering / sanitising Markdown, images,
tables, mentions, uploads, bundled CSS, fonts or English strings.

## 3. Architectural decisions

- **Plain text in, plain text out** — a native `<textarea>`.
- **Pure core** — all text transformation is `markdown-format.ts` (or its port),
  copied from `shared/markdown-format.ts` by `bin/sync-shared-modules`; never edit the copy.
- **Roving-tabindex toolbar** (APG), arrows clamp.
- **Undo preserved** through `execCommand("insertText")` with a fallback.
- **Names gate rendering** — a tool with no `labels` entry is not rendered.

## 4. Public API

See [index.md § Props](../index.md#props).

## 5. Markup and class hooks

Root `.markdown-editor` holding `.markdown-editor-toolbar` (`role="toolbar"`) of
`button.markdown-editor-button[data-tool]` (each with `svg.markdown-editor-icon[aria-hidden]`),
then `textarea.markdown-editor-textarea`. Extra attributes go on the root.

## 6. Behaviour

The nine clauses of the Svelte spec § 6 apply unchanged: wrap tools toggle; bold and
italic share the asterisk; an empty selection inserts a pair; link selects `https://`;
line tools prefix, unprefix, replace and skip blanks; the formatted text stays selected
and focus returns to the textarea; the value is reported on typing and on every tool;
`Ctrl`/`Cmd`+`B`/`I`/`K` apply bold / italic / link when shown; read-only and disabled
make the tools do nothing.

## 7. Accessibility

See [docs/accessibility.md](../docs/accessibility.md).

## 8. Acceptance criteria

- [x] One test per behaviour clause.
- [ ] A real-browser undo / redo check for this port (the Svelte package has `e2e/undo.spec.ts`).
- [ ] WCAG 2.2 AAA audit with a real screen reader.

---

Lily™ and Lily Design System™ are trademarks.
