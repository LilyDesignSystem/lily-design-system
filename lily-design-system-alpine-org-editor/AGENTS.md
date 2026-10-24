# AGENTS — OrgEditor (Alpine.js helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything below is a fast index.

## What this package is

A Alpine.js headless editor for Emacs Org mode text: a `<textarea>` with a toolbar of buttons (text effects,
headings, tasks, priorities, planning dates, properties, drawers, contacts) that write Org syntax into it. The
value is plain text. Ships no CSS, no English strings and no Org parser. The names of the textarea, the toolbar
and every tool are props; a tool with no name is not rendered.

The canonical implementation is the Svelte package (`../lily-design-system-svelte-org-editor/`); where they disagree, Svelte wins.

## Files

| File | Purpose |
| ---- | ------- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `org-editor.ts` | Implementation: the `createOrgEditor` state and the Alpine plugin. |
| `snippet.html` | The markup, bound to the state. |
| `org-editor.test.ts` | Vitest + jsdom + Alpine spec, run against the snippet. |
| `index.md` | User guide. |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |
| `examples/` | Runnable examples. |

## Rules that matter

- Do not add a prop here first: Svelte leads, ports follow.
- Org's own words (`TODO`, `SCHEDULED:`, `:PROPERTIES:`, `#+BEGIN_QUOTE`) are syntax, not interface text; button names are props. Never add a default English label.
- Dates come from `today` or the local date and are named by UTC arithmetic, never `Intl`.
- The toolbar is a roving-tabindex `role="toolbar"`; arrows clamp, they do not wrap.
- Edit through `execCommand("insertText")` with a `value` + `input` fallback, so native undo survives.
- Headless: no CSS, no inline styles.
