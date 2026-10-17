import { describe, expect, it } from "vitest";
import { EMPTY_HISTORY, HISTORY_LIMIT, historyKey, recordEdit, redoEdit, undoEdit, type EditRecord } from "./edit-history";

const rec = (n: number): EditRecord => ({ ownerId: "t1", fieldId: "cost", value: n + 1, previous: n });

describe("edit history", () => {
    it("starts empty and undoes nothing", () => {
        expect(undoEdit(EMPTY_HISTORY).record).toBeUndefined();
        expect(redoEdit(EMPTY_HISTORY).record).toBeUndefined();
    });
    it("undo returns the latest edit and moves it to redo", () => {
        let h = recordEdit(recordEdit(EMPTY_HISTORY, rec(1)), rec(2));
        const first = undoEdit(h);
        expect(first.record).toEqual(rec(2));
        h = first.history;
        expect(h.undo).toEqual([rec(1)]);
        expect(h.redo).toEqual([rec(2)]);
    });
    it("redo re-applies what undo took back", () => {
        const undone = undoEdit(recordEdit(EMPTY_HISTORY, rec(1))).history;
        const redone = redoEdit(undone);
        expect(redone.record).toEqual(rec(1));
        expect(redone.history).toEqual({ undo: [rec(1)], redo: [] });
    });
    it("a new edit ends the redo chain", () => {
        const undone = undoEdit(recordEdit(EMPTY_HISTORY, rec(1))).history;
        expect(recordEdit(undone, rec(5)).redo).toEqual([]);
    });
    it("keeps at most the limit, dropping the oldest", () => {
        let h = EMPTY_HISTORY;
        for (let i = 0; i < HISTORY_LIMIT + 5; i++) h = recordEdit(h, rec(i));
        expect(h.undo).toHaveLength(HISTORY_LIMIT);
        expect(h.undo[0]).toEqual(rec(5));
        expect(recordEdit(EMPTY_HISTORY, rec(1), 2).undo).toHaveLength(1);
    });
    it("is not mutated: earlier values stay intact", () => {
        const h = recordEdit(EMPTY_HISTORY, rec(1));
        undoEdit(h);
        expect(h.undo).toEqual([rec(1)]);
    });
    it("reads the keys", () => {
        expect(historyKey({ key: "z", ctrlKey: true })).toBe("undo");
        expect(historyKey({ key: "Z", metaKey: true })).toBe("undo");
        expect(historyKey({ key: "z", ctrlKey: true, shiftKey: true })).toBe("redo");
        expect(historyKey({ key: "y", ctrlKey: true })).toBe("redo");
        expect(historyKey({ key: "y", ctrlKey: true, shiftKey: true })).toBeNull();
        expect(historyKey({ key: "z" })).toBeNull();
        expect(historyKey({ key: "z", ctrlKey: true, altKey: true })).toBeNull();
    });
});
