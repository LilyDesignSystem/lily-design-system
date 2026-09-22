# Macro options reference — KanbanBoard

See [spec/index.md §4](../spec/index.md#4-macro-parameters-and-nunjucks-deviations)
for the canonical table and every Svelte-prop deviation. Quick
reference:

| Param | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `label` | `string` | yes | — | `aria-label` for the grid `<table>`. |
| `columns` | `array<{id, title, wipLimit?}>` | yes | — | Rendered in array order. |
| `cards` | `array<{id, columnId, title}>` | yes | — | Order within a column follows array order. |
| `caption` | `string` | no | — | Visible `<caption>`, forwarded to `kanbanTable`. |
| `labels.cardCount` | template string, `{count}` | no | — | Gates the per-column count span. |
| `labels.overLimit` | template string, `{count}`/`{limit}` | no | — | Gates the WIP warning span. |
| `labels.moveButton` | template string, `{card}` | no | — | Move button's `aria-label`. |
| `labels.moveMenuLabel` | plain string | no | — | Move listbox's `aria-label`. |
| `labels.moveAnnouncement` | function (client.js init opt only) | no | — | Never a macro param — see spec §4. |
| `name` | `string` | no | `"board"` | Discriminator for generated ids. |
| `id` | `string` | no | `"kanban-board-{name}"` | Id prefix. |
| `classes` | `string` | no | — | Extra CSS classes on the root `<div>`. |
| `attributes` | `object` | no | — | Extra HTML attributes spread onto the root `<div>`. |

`wipLimit: 0` is a real limit (a column that must stay empty), not
treated as "no limit" — checked with `is defined and is not none`, not
truthiness.
