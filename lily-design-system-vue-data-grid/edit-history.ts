/**
 * Undo / redo for typed-field edits: pure, so it is unit-tested without a browser. The components own nothing but the stacks:
 * the consumer owns the data, so an undo is reported the same way an edit is — through `onFieldEdit`, with the earlier value.
 */

/** One accepted edit: which record and field, the value it took and the value it replaced. */
export type EditRecord = { ownerId: string; fieldId: string; value: unknown; previous: unknown };

export type EditHistory = { undo: readonly EditRecord[]; redo: readonly EditRecord[] };

export const EMPTY_HISTORY: EditHistory = { undo: [], redo: [] };

/** Most steps kept; the oldest fall off. */
export const HISTORY_LIMIT = 100;

/** A new edit goes on the undo stack and ends any redo chain. */
export function recordEdit(history: EditHistory, record: EditRecord, limit: number = HISTORY_LIMIT): EditHistory {
    const undo = [...history.undo, record];
    return { undo: undo.length > limit ? undo.slice(undo.length - limit) : undo, redo: [] };
}

/** Step back: the record to reverse (apply `previous`), and the history with it moved to the redo stack. */
export function undoEdit(history: EditHistory): { history: EditHistory; record: EditRecord | undefined } {
    const record = history.undo[history.undo.length - 1];
    if (!record) return { history, record: undefined };
    return { history: { undo: history.undo.slice(0, -1), redo: [...history.redo, record] }, record };
}

/** Step forward: the record to re-apply (apply `value`), and the history with it moved back to the undo stack. */
export function redoEdit(history: EditHistory): { history: EditHistory; record: EditRecord | undefined } {
    const record = history.redo[history.redo.length - 1];
    if (!record) return { history, record: undefined };
    return { history: { undo: [...history.undo, record], redo: history.redo.slice(0, -1) }, record };
}

/** Whether a key press is Undo (Ctrl/Cmd+Z) or Redo (Ctrl/Cmd+Shift+Z, or Ctrl+Y), or neither. */
export function historyKey(event: { key: string; ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean; altKey?: boolean }): "undo" | "redo" | null {
    if (event.altKey || !(event.ctrlKey || event.metaKey)) return null;
    const key = event.key.toLowerCase();
    if (key === "z") return event.shiftKey ? "redo" : "undo";
    if (key === "y" && !event.shiftKey) return "redo";
    return null;
}
