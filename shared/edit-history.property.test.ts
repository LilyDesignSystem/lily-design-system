// Property tests (fast-check): undo and redo are each other's inverse, and the stacks never exceed their limit.
import fc from "fast-check";
import { describe, expect, test } from "vitest";

import {
    EMPTY_HISTORY,
    type EditHistory,
    type EditRecord,
    recordEdit,
    redoEdit,
    undoEdit,
} from "./edit-history";

const record: fc.Arbitrary<EditRecord> = fc.record({
    ownerId: fc.string({ maxLength: 4 }),
    fieldId: fc.string({ maxLength: 4 }),
    value: fc.oneof(fc.string(), fc.integer(), fc.constant(null)),
    previous: fc.oneof(fc.string(), fc.integer(), fc.constant(null)),
});
const records = fc.array(record, { maxLength: 30 });
const limit = fc.integer({ min: 1, max: 40 });

function recordAll(list: EditRecord[], max: number): EditHistory {
    return list.reduce((h, r) => recordEdit(h, r, max), EMPTY_HISTORY);
}

describe("edit-history (properties)", () => {
    test("the undo stack keeps the last edits, never more than the limit, and recording clears redo", () => {
        fc.assert(
            fc.property(records, limit, (list, max) => {
                const h = recordAll(list, max);
                expect(h.undo).toEqual(list.slice(Math.max(0, list.length - max)));
                expect(h.redo).toEqual([]);
            }),
        );
    });

    test("undo then redo gives back the same history and the same record", () => {
        fc.assert(
            fc.property(records, limit, (list, max) => {
                const h = recordAll(list, max);
                const back = undoEdit(h);
                const forward = redoEdit(back.history);
                expect(forward.history).toEqual(h);
                expect(forward.record).toBe(back.record);
            }),
        );
    });

    test("undoing everything then redoing everything restores the undo stack, in order", () => {
        fc.assert(
            fc.property(records, limit, (list, max) => {
                const start = recordAll(list, max);
                let h = start;
                const undone: EditRecord[] = [];
                for (let r = undoEdit(h); r.record; r = undoEdit(h)) {
                    undone.push(r.record);
                    h = r.history;
                }
                expect(undone).toEqual([...start.undo].reverse());
                expect(h.undo).toEqual([]);
                for (let r = redoEdit(h); r.record; r = redoEdit(h)) h = r.history;
                expect(h).toEqual(start);
            }),
        );
    });

    test("undo on an empty stack, and redo on an empty redo stack, change nothing", () => {
        fc.assert(
            fc.property(records, limit, (list, max) => {
                const h = recordAll(list, max);
                const { history } = redoEdit(h);
                expect(history).toBe(h);
                expect(undoEdit(EMPTY_HISTORY)).toEqual({
                    history: EMPTY_HISTORY,
                    record: undefined,
                });
            }),
        );
    });
});
