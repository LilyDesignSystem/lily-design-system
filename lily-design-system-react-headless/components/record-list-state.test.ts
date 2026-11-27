// @vitest-environment jsdom
import { describe, expect, test, vi } from "vitest";

import { hasEntries, recordListState, watchConflict, watchEntries } from "./record-list-state";

const NONE = { status: "none-known", statusLabel: "No known allergies" };
const list = (items: string) => {
    const ul = document.createElement("ul");
    ul.innerHTML = items;
    return ul;
};

describe("recordListState", () => {
    test("HC-C17: none known beside an entry says the conflict, never none known", () => {
        expect(
            recordListState({ ...NONE, conflictLabel: "Check the source record" }, true),
        ).toEqual({
            status: "conflict",
            name: "Check the source record",
            showItem: true,
            words: "Check the source record",
            conflict: true,
        });
    });

    test.each([undefined, "", "   ", " ", "—"])(
        "HC-C17: with no words for the conflict (%j), none known is still not said",
        (conflictLabel) => {
            const state = recordListState({ ...NONE, conflictLabel }, true);
            expect(state).toMatchObject({ name: undefined, showItem: false, words: undefined });
        },
    );

    test("a label of its own names the list, unless it only repeats the status", () => {
        const given = { ...NONE, conflictLabel: "Check" };
        expect(recordListState({ ...given, label: "Allergies" }, true).name).toBe("Allergies");
        expect(recordListState({ ...given, label: NONE.statusLabel }, true).name).toBe("Check");
        expect(recordListState({ ...given, label: NONE.statusLabel }, false).name).toBe(
            NONE.statusLabel,
        );
    });

    test("without entries, and for every other status, nothing changes", () => {
        expect(recordListState({ ...NONE, conflictLabel: "Check" }, false)).toMatchObject({
            status: "none-known",
            words: NONE.statusLabel,
            showItem: true,
        });
        for (const status of ["not-recorded", "unavailable", "omitted", "not-applicable"])
            expect(
                recordListState({ status, statusLabel: "Words", conflictLabel: "Check" }, true),
            ).toMatchObject({
                status,
                name: "Words",
                words: "Words",
                showItem: true,
                conflict: false,
            });
        expect(recordListState({ status: "known", statusLabel: "Known" }, true).showItem).toBe(
            false,
        );
    });
});

describe("hasEntries", () => {
    test.each([
        ["nothing", "", false],
        [
            "only the list's own items",
            '<li class="x-status"></li><li class="x-coverage"></li>',
            false,
        ],
        ["a template", "<template><li></li></template>", false],
        ["an entry", "<li>Penicillin</li>", true],
        ["a withheld entry", '<li data-entry-state="withheld"></li>', true],
        ["a resolved entry", '<li data-clinical-status="resolved"></li>', true],
        ["an entry in error", '<li data-entry-state="entered-in-error"></li>', false],
        ["a refuted allergy", '<li data-verification-status="refuted"></li>', false],
        ["an allergy in error", '<li data-verification-status="entered-in-error"></li>', false],
        ["a medicine in error", '<li data-status="entered-in-error"></li>', false],
        [
            "a refuted one and another",
            '<li data-verification-status="refuted"></li><li></li>',
            true,
        ],
    ])("HC-C17: %s", (_name, items, expected) => {
        expect(hasEntries(list(items), "x")).toBe(expected);
    });

    test("watchEntries follows entries added, withdrawn and removed, and stops", async () => {
        const ul = list("");
        const seen: boolean[] = [];
        const stop = watchEntries(ul, "x", (entries) => seen.push(entries));
        const last = async () => {
            await Promise.resolve();
            await new Promise((resolve) => setTimeout(resolve, 0));
            return seen[seen.length - 1];
        };
        expect(await last()).toBe(false);
        ul.innerHTML = "<li>Penicillin</li>";
        expect(await last()).toBe(true);
        ul.firstElementChild!.setAttribute("data-verification-status", "refuted");
        expect(await last()).toBe(false);
        stop();
        ul.innerHTML = "<li>Latex</li>";
        expect(await last()).toBe(false);
    });

    test("watchEntries reads once where nothing can be watched", () => {
        vi.stubGlobal("MutationObserver", undefined);
        try {
            const seen: boolean[] = [];
            const stop = watchEntries(list("<li>Penicillin</li>"), "x", (found) =>
                seen.push(found),
            );
            expect(seen).toEqual([true]);
            expect(() => stop()).not.toThrow();
        } finally {
            vi.unstubAllGlobals();
        }
    });
});

describe("watchConflict (P50-T29)", () => {
    test("follows a record list inside a section into and out of conflict, and stops", async () => {
        const section = document.createElement("section");
        section.innerHTML = '<ul class="allergy-record-list" data-status="none-known"></ul>';
        const seen: boolean[] = [];
        const stop = watchConflict(section, (conflict) => seen.push(conflict));
        const last = async () => {
            await Promise.resolve();
            await new Promise((resolve) => setTimeout(resolve, 0));
            return seen[seen.length - 1];
        };
        expect(await last()).toBe(false);
        section.firstElementChild!.setAttribute("data-status", "conflict");
        expect(await last()).toBe(true);
        section.firstElementChild!.setAttribute("data-status", "none-known");
        expect(await last()).toBe(false);
        stop();
        section.firstElementChild!.setAttribute("data-status", "conflict");
        expect(await last()).toBe(false);
    });

    test("reads once where nothing can be watched", () => {
        vi.stubGlobal("MutationObserver", undefined);
        try {
            const section = document.createElement("section");
            section.innerHTML = '<ul data-status="conflict"></ul>';
            const seen: boolean[] = [];
            const stop = watchConflict(section, (c) => seen.push(c));
            expect(seen).toEqual([true]);
            expect(() => stop()).not.toThrow();
        } finally {
            vi.unstubAllGlobals();
        }
    });
});
