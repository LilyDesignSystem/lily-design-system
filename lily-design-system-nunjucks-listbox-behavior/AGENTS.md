# AGENTS — ListboxBehavior (Nunjucks helper)

Single source of truth: [spec/index.md](./spec/index.md). User guide:
[index.md](./index.md).

## What this package is

`@lilydesignsystem/nunjucks-listbox-behavior`: the one shared copy of the
WAI-ARIA APG listbox keyboard contract (active-descendant cursor, clamp or
wrap, Home/End, typeahead, paging, Enter/Space/Escape/Tab callbacks) that
the Nunjucks theme, locale, text-size and motion picker client scripts and
the kanban-board move menu use, instead of each carrying its own.
Behaviour only: no template, no markup, no CSS. A top-level subproject of
its own since 2026-10-10 (until then inside `lily-design-system-nunjucks-helpers`).

## Files

| File                          | Purpose                                         |
| ----------------------------- | ----------------------------------------------- |
| `spec/index.md`               | Contract and acceptance criteria (canonical).   |
| `listbox-behavior.client.js`  | Implementation (`createListboxKeyboard`).       |
| `listbox-behavior.test.ts`    | Vitest spec, one test per acceptance clause.    |
| `build.sh`                    | tsup build to `dist/index.js` + `index.d.ts`.   |
| `index.md`                    | User guide.                                     |

## Rules

- Never set `aria-selected`: that is the picker's applied value, not the
  keyboard cursor. Only `data-active` and `aria-activedescendant` move.
- Read options live on every call, so a changing option set stays correct
  without re-attaching.
- No user-facing strings, no DOM writes beyond the two attributes above.

Run `pnpm install`, `pnpm build`, `pnpm test` here.
