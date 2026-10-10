/**
 * Barrel re-export for `<lily-kanban-board>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"lily-kanban-board"`. Registration is idempotent — re-imports
 * do not throw.
 *
 * Depends on `@lilydesignsystem/web-components-headless` for
 * `<lily-kanban-table>` (structural) and `<lily-icon-button>` (the
 * move-menu trigger). Importing that package here (for its side
 * effect) registers both before `#render()` ever runs.
 */

import "@lilydesignsystem/web-components-headless";
import { KanbanBoard, nextKanbanBoardId } from "./kanban-board.js";
export { KanbanBoard, nextKanbanBoardId };
export type { KanbanBoardProps, KanbanColumn, KanbanCard, KanbanLabels } from "./kanban-board.js";

if (typeof customElements !== "undefined" && !customElements.get("lily-kanban-board")) {
  customElements.define("lily-kanban-board", KanbanBoard);
}
