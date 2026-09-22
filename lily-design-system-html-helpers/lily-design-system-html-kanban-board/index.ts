/**
 * Barrel re-export for `<kanban-board>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"kanban-board"`. Registration is idempotent — re-imports do
 * not throw. Consumers who want a different tag name can import the
 * class directly from `./kanban-board` and call
 * `customElements.define(...)` themselves.
 */

import { KanbanBoard, nextKanbanBoardId } from "./kanban-board.js";
export { KanbanBoard, nextKanbanBoardId };
export type {
    KanbanBoardProps,
    KanbanBoardMoveDetail,
    KanbanColumn,
    KanbanCard,
    KanbanLabels,
} from "./kanban-board.js";

if (typeof customElements !== "undefined" && !customElements.get("kanban-board")) {
    customElements.define("kanban-board", KanbanBoard);
}
