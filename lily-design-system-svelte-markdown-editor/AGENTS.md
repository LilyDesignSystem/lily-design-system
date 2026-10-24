# AGENTS — MarkdownEditor (Svelte helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A Svelte headless Markdown editor: a `<textarea>` with a toolbar of buttons
(heading, bold, italic, strikethrough, code, link, quote, bulleted and numbered
lists) that write Markdown into it. The value is plain text. Ships no CSS, no
English strings and no Markdown parser. Names of the textarea, the toolbar and
every tool are props; a tool with no name is not rendered.

The canonical implementation is the Svelte package
(`../lily-design-system-svelte-markdown-editor/`); where they disagree, Svelte wins.

## Files

| File | Purpose |
| ---- | ------- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `MarkdownEditor.svelte` | Implementation. Svelte 5 runes + TypeScript. |
| `MarkdownEditor.test.ts` | Vitest spec. |
| `e2e/undo.spec.ts` | Real-browser undo / redo (Playwright). |
| `markdown-format.ts` | Pure Markdown transforms. **Copied from `shared/markdown-format.ts` by `bin/sync-shared-modules`; never edit this copy.** |
| `index.md` | User guide. |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |
| `examples/` | Runnable examples. |

## Rules that matter

- Do not add a prop here first: Svelte leads, ports follow.
- Every user-facing string is a prop; never add a default English label.
- The toolbar is a roving-tabindex `role="toolbar"`; arrows clamp, they do not wrap.
- Edit through `execCommand("insertText")` with a `value` + `input` fallback, so native undo survives.
- Headless: no CSS, no inline styles.
