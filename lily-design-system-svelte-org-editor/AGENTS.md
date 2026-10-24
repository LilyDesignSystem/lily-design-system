# AGENTS — OrgEditor (Svelte helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything below is a fast index.

## What this package is

A Svelte 5 headless editor for Emacs Org mode text: a `<textarea>` with a toolbar of buttons (text effects,
headings, tasks, priorities, planning dates, properties, drawers, contacts) that write Org syntax into it. The
value is plain text. Ships no CSS, no English strings and no Org parser. The names of the textarea, the toolbar
and every tool are props; a tool with no name is not rendered. A sibling of
`../lily-design-system-svelte-markdown-editor/`.

## Files

| File | Purpose |
| ---- | ------- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `OrgEditor.svelte` | Implementation. Svelte 5 runes + TypeScript. |
| `OrgEditor.test.ts` | Vitest spec. |
| `org-format.ts` | Pure Org transforms. **Copied from `shared/org-format.ts` by `bin/sync-shared-modules`; never edit this copy.** |
| `org-format.test.ts` | The shared module's tests (copied the same way). |
| `e2e/undo.spec.ts` | Real-browser undo / redo (Playwright). |
| `index.md` | User guide. |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |
| `examples/` | Runnable examples. |

## Rules that matter

- Org's own words (`TODO`, `SCHEDULED:`, `:PROPERTIES:`, `#+BEGIN_QUOTE`) are syntax, not interface text; button names are props. Never add a default English label.
- Dates come from `today` or the local date and are named by UTC arithmetic, never `Intl`.
- Heading-relative tools act on the nearest heading at or above the caret.
- The toolbar is a roving-tabindex `role="toolbar"`; arrows clamp, they do not wrap.
- Edit through `execCommand("insertText")` with a `value` + `input` fallback, so native undo survives.
- Headless: no CSS, no inline styles.
