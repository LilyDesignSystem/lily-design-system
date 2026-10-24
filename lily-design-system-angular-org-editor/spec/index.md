# OrgEditor — Specification

Single source of truth for the `@lilydesignsystem/angular-org-editor` Angular helper, a port of `@lilydesignsystem/svelte-org-editor` (the canonical reference; where they disagree, Svelte wins — see [its spec](../../lily-design-system-svelte-org-editor/spec/index.md)). Anything not in this
spec is out of scope; anything in this spec must be exercised by a test.

The pure transforms are `org-format.ts` (or its port), copied from `shared/org-format.ts` by `bin/sync-shared-modules`; never edit the copy. See `AGENTS.md` for the file list.

## 1. Goal

A drop-in, headless editor for a `<textarea>` of Emacs Org mode text, with a top bar of buttons for text
effects, tasks, priorities, planning, properties, drawers and contacts, whose value stays plain Org text.

## 2. Non-goals

- Parsing, folding, agenda, Babel, export, or any rendering of Org.
- A WYSIWYG surface; a document model.
- Tables, tags, repeaters, clocking, `CLOSED:` stamps (not yet).
- Bundled CSS, fonts or English interface strings.

## 3. Architectural decisions

- **Plain text in, plain text out** — a native `<textarea>`, as the Markdown editor.
- **Pure core.** All transformation is in `org-format.ts`: `(text, selection, options)` in, `(text, selection)`
  out. No DOM, so it is exhaustively unit-tested (71 cases, mutation-checked).
- **Org syntax is data, not interface text.** `TODO`/`DONE` (`todoKeywords`), priorities, `SCHEDULED:`,
  `:PROPERTIES:`, `#+BEGIN_QUOTE` and the English weekday abbreviation Org itself writes in a timestamp are
  fixed or options; button names are props.
- **Heading-relative tools.** `todo`, `priority`, `scheduled`, `deadline`, `property` and `contact` work on the
  heading the caret is under (nearest `*` line at or above it).
- **Dates by UTC arithmetic** (`dayStamp`), never `Intl` or the clock, so a given `today` always gives the same
  text. The default `today` is the local date, read when a tool runs.
- **Roving-tabindex toolbar** (APG); arrows clamp. **Undo preserved** through `execCommand("insertText")` with
  a `value` + `input` fallback. **Names gate rendering.**
- **A tool with nothing to do changes nothing**: no edit, no `onchange`; focus still returns to the textarea.

## 4. Public API

See [index.md § Props](../index.md#props). Exports: `OrgEditor` (default), `nextOrgEditorId`, the
transforms (`applyTool`, `toggleWrap`, `toggleHeading`, `shiftHeadings`, `toggleList`, `cycleCheckbox`,
`toggleBlock`, `cycleTodo`, `cyclePriority`, `togglePlanning`, `addProperty`, `insertContact`, `insertLink`,
`insertTimestamp`, `dayStamp`, `localToday`), `TOOL_IDS`, `TOOL_GROUPS`, `WRAP_MARKERS`, and the types.

## 5. Markup and class hooks

Root `<div class="org-editor {class}">` holding `<div class="org-editor-toolbar" role="toolbar">` of
`<button class="org-editor-button" type="button" data-tool data-group>` (each with an
`<svg class="org-editor-icon" aria-hidden>`), then `<textarea class="org-editor-textarea">`.

## 6. Behaviour

1. Wrap tools (`*` bold, `/` italic, `_` underline, `+` strikethrough, `~` code, `=` verbatim) wrap the
   selection and unwrap it when already wrapped; an empty selection inserts a pair with the caret between.
2. `link` writes `[[https://][selection]]` (`[[https://]]` with no selection) and selects the address.
3. `heading` toggles `*`×`headingLevel` on every selected line; `promote` / `demote` change the star count of
   selected headings, never below one, and leave other lines alone.
4. `bulletList` / `numberedList` prefix every selected line (numbering from 1, skipping blanks) or remove the
   prefix when every non-empty line has it, replacing a competing prefix rather than stacking.
5. `checkbox` cycles by the first non-empty line: none → `- [ ]` → `- [X]` → none, applied to every line.
6. `quote`, `sourceBlock` and `drawer` wrap the selected lines in begin / end lines, and unwrap when the
   wrapper is the selection's own first and last lines or the lines just outside it (case-insensitive).
7. `todo` cycles keyword on the caret's line (none → each of `todoKeywords` → none); a plain or list line
   becomes a heading first. Only an exact keyword counts (`TODOS` is not `TODO`).
8. `priority` cycles `[#A]` → … → none after the keyword.
9. `scheduled` / `deadline` add `KEYWORD: <date Day>` to the planning line under the heading (creating the line,
   or appending to it) and select the date; pressing again removes it, and the line when it is empty. With no
   heading above, nothing changes.
10. `timestamp` inserts `<date Day>` over the selection and selects the date.
11. `property` adds `:KEY: ` inside the heading's `:PROPERTIES:` drawer (after the planning line), creating it;
    a key already present is not repeated (the caret goes to it); with no heading the drawer goes at the top.
12. `contact` inserts a heading (one level under the heading above, else `headingLevel`) with a property
    drawer of `contactProperties`, the selection as the name, the caret on the first property.
13. After a tool the textarea has focus and the affected text is selected; `onchange` and the bound `value`
    update on typing and on every tool that changed something.
14. `Ctrl`/`Cmd`+`B`/`I`/`U`/`K` apply bold / italic / underline / link when shown. `readonly` and `disabled`
    make tools do nothing; `disabled` disables the buttons.

## 7. Accessibility

See [docs/accessibility.md](../docs/accessibility.md).

## 8. Acceptance criteria

- [x] One test per behaviour clause above, shared with the Svelte reference.
- [ ] A real-browser undo / redo check for this port (the Svelte package has `e2e/undo.spec.ts`).
- [ ] WCAG 2.2 AAA audit with a real screen reader.

---

Lily™ and Lily Design System™ are trademarks.
