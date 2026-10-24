# OrgModeEditor (Svelte helper)

A headless Svelte 5 editor for [Emacs Org mode](https://orgmode.org/) text: a `<textarea>` with a toolbar of
buttons for text effects, headings, **tasks**, priorities, planning dates, **properties**, **drawers** and
**contacts**. The buttons write Org syntax into the textarea, so the value is plain text: it submits with a
form, validates, diffs, goes straight into an `.org` file, and works without JavaScript.

It is a sibling of `@lilydesignsystem/svelte-markdown-editor` (same toolbar, same names-are-props rule, same
undo behaviour) with Org's own tools. The single source of truth is [spec/index.md](./spec/index.md); this
file is the human-readable guide.

## Install

```ts
import { OrgModeEditor, type Labels } from "./lily-design-system-svelte-org-mode-editor";
```

## Quick start

```svelte
<script lang="ts">
  import { OrgModeEditor } from "./lily-design-system-svelte-org-mode-editor";

  let notes = $state("* Ship the release");
  const labels = {
    todo: "Task", priority: "Priority", scheduled: "Scheduled", deadline: "Deadline",
    bold: "Bold", italic: "Italic", link: "Link",
    property: "Property", drawer: "Drawer", contact: "Contact",
  };
</script>

<OrgModeEditor bind:value={notes} label="Notes" toolbarLabel="Formatting" {labels} name="notes" rows={12} />
```

Every name is a prop, because the component ships no English. A tool with no entry in `labels` is not
rendered: an unnamed button is worse than no button.

## The tools

| Group     | Tool (`ToolId`)     | What it writes |
| --------- | ------------------- | -------------- |
| structure | `heading`           | `* ` on each selected line (`headingLevel` stars); again to remove. |
| structure | `promote`, `demote` | One star fewer (never below one) or more on each selected heading. |
| structure | `bulletList`, `numberedList` | `- ` or `1. ` on each selected line; again to remove. |
| structure | `checkbox`          | Cycles the selected lines none → `- [ ]` → `- [X]` → none. |
| structure | `quote`, `sourceBlock` | Wraps the selected lines in `#+BEGIN_QUOTE` / `#+END_QUOTE`, or `#+BEGIN_SRC` / `#+END_SRC`. |
| task      | `todo`              | Cycles the heading under the caret none → `TODO` → `DONE` → none (a plain line becomes a heading). |
| task      | `priority`          | Cycles `[#A]` → `[#B]` → `[#C]` → none. |
| task      | `scheduled`, `deadline` | Adds, or removes, `SCHEDULED: <2026-10-24 Sat>` / `DEADLINE: …` on the planning line under the heading; the date is selected so you can change it. |
| task      | `timestamp`         | Inserts an active timestamp `<2026-10-24 Sat>` at the caret. |
| text      | `bold` `italic` `underline` `strikethrough` `code` `verbatim` | Wraps the selection in `*` `/` `_` `+` `~` `=`; again to remove. |
| text      | `link`              | `[[https://][selection]]`, the address selected. |
| data      | `property`          | Adds `:ID: ` to the `:PROPERTIES:` drawer under the heading, creating the drawer; a key already there is not added twice. |
| data      | `drawer`            | Wraps the selected lines in `:LOGBOOK:` … `:END:`; again to remove. |
| data      | `contact`           | An org-contacts entry: a heading one level under the heading above, with `:EMAIL:`, `:PHONE:`, `:ADDRESS:` and `:BIRTHDAY:` properties; the selection becomes the name. |

Org's own words — `TODO`, `DONE`, `SCHEDULED:`, `:PROPERTIES:`, `#+BEGIN_QUOTE`, the weekday inside a timestamp —
are syntax that Org reads and writes, not interface text, so they are not localisable props. The *button names*
are.

## Props

| Prop | Type | Required | Default | Purpose |
| ---- | ---- | -------- | ------- | ------- |
| `value` | `string` (bindable) | no | `""` | The text, as Org. |
| `label` | `string` | yes | — | Accessible name of the textarea. |
| `toolbarLabel` | `string` | yes | — | Accessible name of the toolbar. |
| `labels` | `Partial<Record<ToolId,string>>` | yes | — | Accessible name per tool; a tool without one is not shown. |
| `tools` | `ToolId[]` | no | all 23 | Which tools to show, and in what order. |
| `headingLevel` | `1`–`6` | no | `1` | Stars the heading tool, and a `todo` on a plain line, write. |
| `todoKeywords` | `string[]` | no | `["TODO","DONE"]` | The cycle `todo` walks, e.g. `["TODO","NEXT","WAIT","DONE"]`. |
| `priorities` | `string[]` | no | `["A","B","C"]` | The cycle `priority` walks. |
| `today` | `string` `YYYY-MM-DD` | no | local date | The date for `scheduled`, `deadline`, `timestamp`; pass it for tests and for servers in another time zone. |
| `propertyKey` | `string` | no | `ID` | The property `property` adds. |
| `drawerName` | `string` | no | `LOGBOOK` | The drawer `drawer` writes. |
| `contactProperties` | `string[]` | no | `["EMAIL","PHONE","ADDRESS","BIRTHDAY"]` | What a contact entry gets. |
| `name`, `id`, `rows`, `placeholder`, `disabled`, `readonly`, `required` | | no | | Passed to the `<textarea>`. |
| `onchange` | `(value: string) => void` | no | — | After every change, typed or from a tool. |
| `icon` | `Snippet<[ToolId]>` | no | bundled SVGs | Replaces a tool's icon. |
| `class`, rest | | no | | Appended to the root class; rest props spread onto the root. |

## Behaviour

- **Toggle.** A tool that adds something removes it when pressed again over the same text.
- **Selection survives.** The affected text stays selected, so effects stack; focus returns to the textarea.
- **Tasks and planning work on the heading the caret is under** — the nearest `*` line at or above it. With no
  heading above, `scheduled` / `deadline` do nothing, and `property` puts a file-level drawer at the top.
- **Undo.** Edits go through the browser's editing pipeline (`execCommand("insertText")`), so native undo and
  redo keep working. A tool that has nothing to do changes nothing and fires no `onchange`.
- **Shortcuts.** `Ctrl`/`Cmd` + `B`, `I`, `U` and `K` apply bold, italic, underline and link, when shown.

## Markup

```html
<div class="org-mode-editor {class}">
  <div class="org-mode-editor-toolbar" role="toolbar" aria-label aria-controls aria-orientation="horizontal">
    <button class="org-mode-editor-button" type="button" data-tool="todo" data-group="task" aria-label tabindex="0">
      <svg class="org-mode-editor-icon" aria-hidden="true">…</svg>
    </button>
    …
  </div>
  <textarea class="org-mode-editor-textarea" aria-label name …></textarea>
</div>
```

`data-group` (`structure`, `task`, `text`, `data`) lets your CSS put a separator between groups.

## Keyboard

| Where    | Key                              | Action                                       |
| -------- | -------------------------------- | -------------------------------------------- |
| Toolbar  | `←` `→`                          | Move to the previous / next button (clamps). |
| Toolbar  | `Home` `End`                     | First / last button.                         |
| Toolbar  | `Tab`                            | Into the toolbar (one tab stop), then out.   |
| Toolbar  | `Enter` `Space`                  | Apply the tool; focus returns to the text.   |
| Textarea | `Ctrl`/`Cmd` + `B` `I` `U` `K`   | Bold, italic, underline, link.               |

## Undo and redo (checked in real browsers)

`npm run test:e2e` runs `e2e/undo.spec.ts` in Chromium, Firefox and WebKit. As of 2026-10-24: Chromium and
WebKit pass (WebKit merges consecutive edits into one undo step); Firefox was **not run** — Playwright's Firefox
157 does not launch on the maintainer's macOS.

## What it is not

- **Org mode.** It does not parse Org, fold or cycle visibility, run Babel, build an agenda or export. It writes
  the text that Org reads.
- **A WYSIWYG editor.** Nothing is rendered in the field.
- **Styled.** No CSS ships. Target `.org-mode-editor`, `.org-mode-editor-toolbar`, `.org-mode-editor-button`
  and `.org-mode-editor-textarea`.
- **Tables, tags, repeaters, clocking, `CLOSED:` stamps.** Not yet.

## Related

[accessibility notes](./docs/accessibility.md) · [examples](./examples/README.md) · the sibling
`lily-design-system-svelte-markdown-editor`
